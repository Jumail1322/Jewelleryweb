import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/SearchView";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  const products = await getProducts();
  return (
    <section className="collection collection--page">
      <header className="page-hero">
        <h1 className="sma-primary-heading">Search</h1>
      </header>
      <Suspense fallback={null}>
        <SearchView products={products} />
      </Suspense>
    </section>
  );
}
