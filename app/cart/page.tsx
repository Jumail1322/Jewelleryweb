import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <section className="page-section">
      <header className="page-hero">
        <h1 className="sma-primary-heading">Your cart</h1>
      </header>
      <CartPageView />
    </section>
  );
}
