"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/shop";

type Item = { product: Product; category: string };

const CATEGORY_LABELS: Record<string, string> = {
  necklace: "Necklaces",
  earring: "Earrings",
  ring: "Rings",
  bracelet: "Bracelets",
};

const SORTS = {
  featured: { label: "Featured", fn: () => 0 },
  "price-asc": { label: "Price, low to high", fn: (a: Product, b: Product) => a.price - b.price },
  "price-desc": { label: "Price, high to low", fn: (a: Product, b: Product) => b.price - a.price },
  "title-asc": { label: "Alphabetically, A–Z", fn: (a: Product, b: Product) => a.title.localeCompare(b.title) },
} as const;
type SortKey = keyof typeof SORTS;

/** Category filter + sort, kept in the URL (?category=ring&sort=price-asc) so views are shareable. */
export function CollectionView({ items }: { items: Item[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category");
  const sortParam = params.get("sort");
  const sort: SortKey = sortParam && sortParam in SORTS ? (sortParam as SortKey) : "featured";

  const available = Object.keys(CATEGORY_LABELS).filter((c) => items.some((i) => i.category === c));
  // Sold-out pieces sink to the bottom unless sorting by price/name says otherwise
  const visible = items
    .filter((i) => !category || i.category === category)
    .map((i) => i.product)
    .sort((a, b) => (sort === "featured" ? Number(b.available) - Number(a.available) : SORTS[sort].fn(a, b)));

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  return (
    <>
      <div className="collection-toolbar">
        <div className="collection-filters" role="group" aria-label="Filter by category">
          <button type="button" className={`filter-chip${!category ? " is-active" : ""}`} onClick={() => update("category", null)}>
            All
          </button>
          {available.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-chip${category === c ? " is-active" : ""}`}
              onClick={() => update("category", category === c ? null : c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <label className="collection-sort">
          <span className="sma-label-text">Sort by</span>
          <select value={sort} onChange={(e) => update("sort", e.target.value === "featured" ? null : e.target.value)}>
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="sma-chotta-text collection-count">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      <ul className="collection-grid">
        {visible.map((p) => (
          <li key={p.handle}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="sma-body-text collection-grid__empty">No products found.</p>}
    </>
  );
}
