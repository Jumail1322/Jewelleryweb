"use client";

import { useState } from "react";
import { SHOP_URL } from "@/lib/env";

// Posts to Shopify's built-in contact form, so messages arrive in the store's
// notification inbox exactly as they did with the theme.
const SHOPIFY_CONTACT = `${SHOP_URL}/contact#ContactForm`;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="sma-body-text contact-form__success">Thanks for contacting us. We’ll get back to you as soon as possible.</p>;
  }

  return (
    <form className="contact-form" method="post" action={SHOPIFY_CONTACT} target="contact-sink" onSubmit={() => setSent(true)}>
      <input type="hidden" name="form_type" value="contact" />
      <input type="hidden" name="utf8" value="✓" />
      <div className="contact-form__row">
        <label className="field">
          <span className="form__label">Name</span>
          <input type="text" name="contact[name]" autoComplete="name" />
        </label>
        <label className="field">
          <span className="form__label">Email *</span>
          <input type="email" name="contact[email]" autoComplete="email" required />
        </label>
      </div>
      <label className="field">
        <span className="form__label">Phone number</span>
        <input type="tel" name="contact[phone]" autoComplete="tel" />
      </label>
      <label className="field">
        <span className="form__label">Comment</span>
        <textarea name="contact[body]" rows={6} />
      </label>
      <button type="submit" className="button-solid">
        Send
      </button>
      <iframe name="contact-sink" title="Contact submission" hidden />
    </form>
  );
}
