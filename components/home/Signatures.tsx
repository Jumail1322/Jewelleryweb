"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SIGNATURES } from "@/lib/content";
import type { Product } from "@/lib/shop";

type Item = { product: Product; category: string };

export function Signatures({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const visible = filter ? items.filter((i) => i.category === filter) : items;

  return (
    <section className="collection">
      <div className="collection__title">
        <div className="collection__title-left">
          <span className="sma-label-text">{SIGNATURES.label}</span>
          <Reveal as="h2" className="sma-primary-heading">{SIGNATURES.heading}</Reveal>
          <Reveal as="p" className="sma-body-text" order={1}>{SIGNATURES.body}</Reveal>
        </div>
        <div className="collection__title-right">
          <span className="sma-label-text collection__tab-label">Filter by:</span>
          <div className="collection-tabs" role="tablist" aria-label="Filter by category">
            {SIGNATURES.tabs.map((tab) => (
              <button
                key={tab.filter}
                type="button"
                role="tab"
                title={tab.label}
                aria-selected={filter === tab.filter}
                className={`collection-tab${filter === tab.filter ? " is-active" : ""}`}
                // Clicking the active tab again shows everything
                onClick={() => setFilter((f) => (f === tab.filter ? null : tab.filter))}
              >
                <Image src={tab.icon} alt={tab.label} width={48} height={48} unoptimized />
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="collection-grid">
        {visible.map(({ product }, i) => (
          <Reveal as="li" key={`${filter}-${product.handle}`} order={i + 1}>
            <ProductCard product={product} />
          </Reveal>
        ))}
        {visible.length === 0 && <li className="sma-body-text collection-grid__empty">No pieces in this category yet.</li>}
      </ul>
    </section>
  );
}
