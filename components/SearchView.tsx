"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/shop";

export function SearchView({ products }: { products: Product[] }) {
  const router = useRouter();
  const q = useSearchParams().get("q")?.trim() ?? "";
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

  const results = terms.length
    ? products.filter((p) => {
        const hay = `${p.title} ${p.category ?? ""} ${p.group} ${p.tags.join(" ")} ${p.description}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
    : [];

  return (
    <>
      <form
        className="search-page__form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
          router.replace(`/search?q=${encodeURIComponent(value)}`);
        }}
      >
        <input key={q} type="search" name="q" defaultValue={q} placeholder="Search for a piece" aria-label="Search products" />
        <button type="submit" className="sma-button-primary">
          Search
        </button>
      </form>

      {terms.length > 0 && (
        <p className="sma-chotta-text collection-count">
          {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
        </p>
      )}

      <ul className="collection-grid">
        {results.map((p) => (
          <li key={p.handle}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
