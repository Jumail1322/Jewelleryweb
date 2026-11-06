import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="page-section">
      <header className="page-hero">
        <h1 className="sma-primary-heading">Checkout</h1>
      </header>
      <CheckoutView />
    </section>
  );
}
