# Julmill — Next.js storefront

Next.js 16 storefront running on the store backend (`NEXT_PUBLIC_API_BASE_URL`):
products, categories, customer login, cart, addresses, orders and Razorpay
payments all go through that API.

## Run

```bash
cp .env.example .env   # then fill in the values
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

`NEXT_PUBLIC_*` values are baked in at build time — rebuild after changing them.

## Environment

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Store backend base URL |
| `NEXT_PUBLIC_VENDOR_ID` | Sent as the `X-Vendor-ID` header on every customer request |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Opens Razorpay Checkout in the browser |
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | Optional — Shopify store still hosting homepage media, policies and form inboxes |

The Razorpay **key secret** is not used by this app: the backend creates and
verifies payments (`/payment/create-order/`, `/payment/verify/`).

## How it fits together

| Path | What |
|---|---|
| `lib/api.ts` | Fetch wrapper: base URL, `X-Vendor-ID`, `{status, message, data}` unwrapping, errors |
| `lib/catalog.ts` | Server-side product/category reads, cached (`use cache`, refreshed every few minutes) |
| `lib/shop.ts` | Maps API products/variants into the UI model; price formatting |
| `lib/checkout.ts` | Cart sync → order → Razorpay → verify; addresses; order history |
| `components/auth/` | Email + one-time-code login, token storage and refresh |
| `app/checkout`, `app/account` | Checkout and order history |
| `lib/content.ts` | Homepage copy, editorial media, featured product slugs |
| `app/globals.css` | All styles, including the hover effects |

### Checkout flow

1. The cart lives in the browser until checkout.
2. The customer logs in with an emailed code (`/authentication/customer-login/` → `/authentication/verify/otp/`).
3. The browser cart is copied to the backend cart (`/customer/cart/`).
4. An order is created for the chosen address (`/customer/orders/`).
5. Online payment: the backend opens a Razorpay order, Razorpay Checkout collects payment, and the backend verifies the signature. Cash on delivery skips this step.
