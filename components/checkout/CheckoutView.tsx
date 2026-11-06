"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";
import { useCart } from "@/components/cart/CartProvider";
import {
  type Address,
  createAddress,
  createOrder,
  getAddresses,
  type NewAddress,
  type PaymentMethod,
  payWithRazorpay,
  syncCart,
} from "@/lib/checkout";
import { formatPrice } from "@/lib/shop";

const EMPTY_ADDRESS: NewAddress = {
  full_name: "",
  phone_number: "",
  street_address: "",
  city: "",
  state: "",
  country: "India",
  zip_code: "",
  is_default: true,
};

function AddressForm({ onSaved }: { onSaved: (a: Address) => void }) {
  const { authFetch } = useAuth();
  const [form, setForm] = useState<NewAddress>(EMPTY_ADDRESS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const field = (key: keyof NewAddress, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="field">
      <span className="form__label">{label}</span>
      <input
        value={String(form[key] ?? "")}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required
        {...props}
      />
    </label>
  );

  return (
    <form
      className="address-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          onSaved(await createAddress(authFetch, form));
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not save the address.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {field("full_name", "Full name", { autoComplete: "name" })}
      {field("phone_number", "Phone", { type: "tel", autoComplete: "tel" })}
      {field("street_address", "Address", { autoComplete: "street-address" })}
      <div className="contact-form__row">
        {field("city", "City", { autoComplete: "address-level2" })}
        {field("state", "State", { autoComplete: "address-level1" })}
      </div>
      <div className="contact-form__row">
        {field("zip_code", "PIN code", { inputMode: "numeric", autoComplete: "postal-code" })}
        {field("country", "Country", { autoComplete: "country-name" })}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="sma-button-primary" disabled={busy}>
        {busy ? "Saving…" : "Save address"}
      </button>
    </form>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const { session, ready, authFetch } = useAuth();
  const { lines, subtotal, clear } = useCart();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("ONLINE_PAYMENT");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    getAddresses(authFetch)
      .then((list) => {
        if (cancelled) return;
        setAddresses(list);
        setAddressId((list.find((a) => a.is_default) ?? list[0])?.id ?? null);
        setAdding(list.length === 0);
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [session, authFetch]);

  if (!ready) return null;

  if (lines.length === 0) {
    return (
      <div className="cart-page__empty">
        <p className="sma-body-text">Your cart is empty.</p>
        <Link href="/collections/all" className="sma-button-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!addressId) return;
    setPlacing(true);
    setError(null);
    try {
      await syncCart(authFetch, lines);
      const order = await createOrder(authFetch, addressId, method);
      if (method === "ONLINE_PAYMENT") {
        const address = addresses?.find((a) => a.id === addressId);
        await payWithRazorpay(authFetch, order, {
          name: address?.full_name,
          email: session?.email,
          contact: address?.phone_number,
        });
      }
      clear();
      router.push(`/account?placed=${order.order_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong placing your order.");
      setPlacing(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__steps">
        <section className="checkout__step">
          <h2 className="checkout__heading">1. Account</h2>
          {session ? (
            <p className="sma-body-text">
              Logged in as <strong>{session.email}</strong>
            </p>
          ) : (
            <LoginForm />
          )}
        </section>

        <section className={`checkout__step${session ? "" : " is-locked"}`}>
          <h2 className="checkout__heading">2. Delivery address</h2>
          {session && addresses === null && !error && <p className="sma-chotta-text">Loading addresses…</p>}
          {session && addresses && addresses.length > 0 && (
            <div className="address-list" role="radiogroup" aria-label="Delivery address">
              {addresses.map((a) => (
                <label key={a.id} className={`address-card${addressId === a.id ? " is-active" : ""}`}>
                  <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} />
                  <span>
                    <strong>{a.full_name}</strong>
                    <br />
                    {a.street_address}, {a.city}, {a.state} {a.zip_code}
                    <br />
                    {a.phone_number}
                  </span>
                </label>
              ))}
            </div>
          )}
          {session &&
            addresses &&
            (adding ? (
              <AddressForm
                onSaved={(a) => {
                  setAddresses((list) => [...(list ?? []), a]);
                  setAddressId(a.id);
                  setAdding(false);
                }}
              />
            ) : (
              <button type="button" className="link-button" onClick={() => setAdding(true)}>
                + Add a new address
              </button>
            ))}
        </section>

        <section className={`checkout__step${session && addressId ? "" : " is-locked"}`}>
          <h2 className="checkout__heading">3. Payment</h2>
          <div className="address-list" role="radiogroup" aria-label="Payment method">
            <label className={`address-card${method === "ONLINE_PAYMENT" ? " is-active" : ""}`}>
              <input type="radio" name="payment" checked={method === "ONLINE_PAYMENT"} onChange={() => setMethod("ONLINE_PAYMENT")} />
              <span>
                <strong>Pay online</strong>
                <br />
                UPI, cards, netbanking and wallets via Razorpay
              </span>
            </label>
            <label className={`address-card${method === "CASH_ON_DELIVERY" ? " is-active" : ""}`}>
              <input type="radio" name="payment" checked={method === "CASH_ON_DELIVERY"} onChange={() => setMethod("CASH_ON_DELIVERY")} />
              <span>
                <strong>Cash on delivery</strong>
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className="cart-page__summary checkout__summary">
        <h2 className="checkout__heading">Order summary</h2>
        <ul className="checkout__lines">
          {lines.map((l) => (
            <li key={l.variantId}>
              <span className="checkout__thumb">
                {l.image && <Image src={l.image} alt="" fill sizes="56px" />}
                <span className="checkout__qty">{l.quantity}</span>
              </span>
              <span className="checkout__line-title">
                {l.title}
                {l.variantTitle && <small>{l.variantTitle}</small>}
              </span>
              <span>{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <span className="sma-label-text">Total</span>
          <span className="cart-total__amount">{formatPrice(subtotal)}</span>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="button" className="button-solid" disabled={!session || !addressId || placing} onClick={placeOrder}>
          {placing ? "Placing order…" : method === "ONLINE_PAYMENT" ? "Pay now" : "Place order"}
        </button>
      </aside>
    </div>
  );
}
