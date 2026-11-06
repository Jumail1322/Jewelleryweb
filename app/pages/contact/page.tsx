import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

const FAQ = [
  { q: "Do you ship across India?", a: "Yes — shipping is free." },
  { q: "What is your return policy?", a: "We offer easy 15 day returns. Write to us and we will help." },
];

export default function ContactPage() {
  return (
    <section className="contact-page">
      <header className="page-hero">
        <span className="sma-label-text">Get in touch</span>
        <h1 className="sma-primary-heading">Contact</h1>
        <p className="sma-body-text">
          Questions about a piece, an order or gifting? Write to us at{" "}
          <a href="mailto:support@ornmnt.com" className="text-link">
            support@ornmnt.com
          </a>{" "}
          or use the form below.
        </p>
      </header>

      <ContactForm />

      <div className="contact-page__faq" id="faq">
        <h2 className="sma-primary-heading">FAQs</h2>
        <div className="pdp-accordion">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="sma-body-text">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
