"use client";

import { useState } from "react";
import { SHOP_URL } from "@/lib/env";

// Posts to Shopify's customer form so sign-ups land in Shopify Customers
// (tagged "newsletter"), exactly like the theme's footer form.
const SHOPIFY_CONTACT = `${SHOP_URL}/contact#sma-footer-newsletter-form`;

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <form
      className="sma-footer__form"
      method="post"
      action={SHOPIFY_CONTACT}
      target="newsletter-sink"
      onSubmit={() => setStatus("sent")}
    >
      <input type="hidden" name="form_type" value="customer" />
      <input type="hidden" name="utf8" value="✓" />
      <input type="hidden" name="contact[tags]" value="newsletter" />
      {status === "sent" && <p className="sma-body-text sma-footer__form-message">Thanks for subscribing.</p>}
      <input
        type="email"
        name="contact[email]"
        className="sma-body-text sma-footer__email-input"
        placeholder="Email Address"
        aria-label="Email Address"
        autoComplete="email"
        required
      />
      <button type="submit" className="sma-button-second">
        Join our family
      </button>
      {/* Keeps the visitor on this site while Shopify receives the form */}
      <iframe name="newsletter-sink" title="Newsletter submission" hidden />
    </form>
  );
}
