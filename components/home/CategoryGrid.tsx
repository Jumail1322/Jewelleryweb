"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/content";
import { sized } from "@/lib/shop";

/** Grey veil lifts and "Shop Now" slides in; the last hovered tile stays lit. */
export function CategoryGrid() {
  const [active, setActive] = useState(0);

  return (
    <section className="sma-category-grid">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.title}
          href={`/collections/all?category=${c.filter}`}
          className={`sma-category-box${active === i ? " is-active" : ""}`}
          style={{ backgroundImage: `url('${sized(c.image, 1400)}')` }}
          onMouseEnter={() => {
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setActive(i);
          }}
        >
          <div className="sma-category-overlay-1" />
          <div className="sma-category-overlay-2" />
          <div className="sma-category-content">
            <div className="sma-category-heading-row">
              <span className="sma-category-line" />
              <h2 className="sma-primary-heading">{c.title}</h2>
              <span className="sma-category-line" />
            </div>
            <div className="sma-category-button-wrapper">
              <span className="sma-button-third">Shop Now</span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
