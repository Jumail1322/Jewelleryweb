// Checkout against the backend: server cart → order → Razorpay payment → verify.
// The Razorpay secret never reaches the browser; the backend creates and verifies payments.

import { listOf } from "@/lib/api";
import type { CartLine } from "@/components/cart/CartProvider";

type AuthFetch = <T>(path: string, init?: RequestInit) => Promise<T>;

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

export type Address = {
  id: string;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  is_default?: boolean;
};
export type NewAddress = Omit<Address, "id">;

export type PaymentMethod = "ONLINE_PAYMENT" | "CASH_ON_DELIVERY";

export type Order = {
  id: string;
  order_id: number;
  total_price: string;
  payment_method?: PaymentMethod | "" | null;
  payment_status?: string;
  created_at: string;
  items: {
    id: string;
    quantity: number;
    price: string;
    status?: string;
    product_variant?: {
      sku?: string;
      product?: { name?: string; slug?: string };
      images?: { image: string }[];
      attributes?: { name: string; value: string }[];
    };
  }[];
};

type ServerCart = { id: string; items: { id: string; product_variant: { id: string } | string; quantity: number }[] };

export async function getAddresses(authFetch: AuthFetch): Promise<Address[]> {
  return listOf(await authFetch<Address[] | { results: Address[] }>("/customer/addresses/?page_size=50"));
}

export async function createAddress(authFetch: AuthFetch, address: NewAddress): Promise<Address> {
  return authFetch<Address>("/customer/addresses/", { method: "POST", body: JSON.stringify(address) });
}

/** Makes the backend cart match the local cart exactly (orders are built from the backend cart). */
export async function syncCart(authFetch: AuthFetch, lines: CartLine[]): Promise<void> {
  const cart = await authFetch<ServerCart | null>("/customer/cart/list/").catch(() => null);
  for (const item of cart?.items ?? []) {
    await authFetch(`/customer/cart/${item.id}/`, { method: "DELETE" });
  }
  for (const line of lines) {
    await authFetch("/customer/cart/", {
      method: "POST",
      body: JSON.stringify({ product_variant: line.variantId, quantity: line.quantity }),
    });
  }
}

export async function createOrder(authFetch: AuthFetch, addressId: string, method: PaymentMethod): Promise<Order> {
  return authFetch<Order>("/customer/orders/", {
    method: "POST",
    body: JSON.stringify({ address: addressId, payment_method: method }),
  });
}

export async function getOrders(authFetch: AuthFetch): Promise<Order[]> {
  return listOf(await authFetch<Order[] | { results: Order[] }>("/customer/orders/?page_size=50"));
}

// ---------------------------------------------------------------------------
// Razorpay
// ---------------------------------------------------------------------------

type RazorpayOrder = { razorpayOrderId: string; amount: number; currency: string; key: string };

/** Asks the backend to open a Razorpay order for our order. */
async function createRazorpayOrder(authFetch: AuthFetch, order: Order): Promise<RazorpayOrder> {
  const data = await authFetch<Record<string, unknown>>("/payment/create-order/", {
    method: "POST",
    body: JSON.stringify({ order_id: order.id }),
  });
  // Accept either our field names or Razorpay's own order object
  const nested = (data.razorpay_order as Record<string, unknown> | undefined) ?? data;
  const razorpayOrderId = String(data.razorpay_order_id ?? nested.id ?? nested.order_id ?? "");
  if (!razorpayOrderId) throw new Error("The payment could not be started (no Razorpay order id returned).");
  return {
    razorpayOrderId,
    // Razorpay amounts are in paise
    amount: Number(nested.amount ?? Math.round(Number(order.total_price) * 100)),
    currency: String(nested.currency ?? "INR"),
    key: String(data.key ?? data.key_id ?? data.razorpay_key ?? RAZORPAY_KEY_ID),
  };
}

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (r: { error?: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Razorpay. Check your connection and try again."));
    document.body.appendChild(s);
  });
}

/** Opens Razorpay Checkout and resolves once the backend has verified the payment. */
export async function payWithRazorpay(
  authFetch: AuthFetch,
  order: Order,
  prefill: { name?: string; email?: string; contact?: string },
): Promise<void> {
  const [rzp] = await Promise.all([createRazorpayOrder(authFetch, order), loadRazorpay()]);
  if (!rzp.key) throw new Error("NEXT_PUBLIC_RAZORPAY_KEY_ID is not set in .env");

  const response = await new Promise<RazorpayResponse>((resolve, reject) => {
    const checkout = new window.Razorpay!({
      key: rzp.key,
      order_id: rzp.razorpayOrderId,
      amount: rzp.amount,
      currency: rzp.currency,
      name: "Julmill Jewelry",
      description: `Order #${order.order_id}`,
      prefill,
      theme: { color: "#1b0e08" },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
    });
    checkout.on("payment.failed", (r) => reject(new Error(r.error?.description ?? "Payment failed.")));
    checkout.open();
  });

  await authFetch("/payment/verify/", {
    method: "POST",
    body: JSON.stringify({ ...response, order_id: order.id }),
  });
}
