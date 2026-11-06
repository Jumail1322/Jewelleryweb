// Server-side catalogue reads from the backend, cached with `use cache`.
// Prices and stock refresh in the background every few minutes.

import { cacheLife } from "next/cache";
import { apiFetch, listOf } from "@/lib/api";
import {
  type Collection,
  mapCategory,
  mapProduct,
  type Product,
  type RawCategory,
  type RawProduct,
} from "@/lib/shop";

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  const data = await apiFetch<RawProduct[] | { results: RawProduct[] }>("/customer/products/?page_size=500");
  return listOf(data)
    .filter((p) => p.is_active !== false && !p.is_deleted)
    .map(mapProduct);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.handle === handle);
}

/** Categories that actually have products, plus "All products". */
export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("hours");
  const [data, products] = await Promise.all([
    apiFetch<RawCategory[] | { results: RawCategory[] }>("/customer/category/?page_size=200"),
    getProducts(),
  ]);
  const used = new Set(products.map((p) => p.categoryHandle).filter(Boolean));
  const categories = listOf(data)
    .filter((c) => !c.is_deleted || c.is_deleted === "false")
    .map(mapCategory)
    .filter((c) => used.has(c.handle));
  return [{ handle: "all", title: "All Products", description: "", image: null }, ...categories];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  return (await getCollections()).find((c) => c.handle === handle);
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  const products = await getProducts();
  return handle === "all" ? products : products.filter((p) => p.categoryHandle === handle);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = (await getProducts()).filter((p) => p.handle !== product.handle && p.images.length > 0);
  const same = products.filter((p) => p.group === product.group);
  const rest = products.filter((p) => p.group !== product.group);
  return [...same, ...rest].slice(0, limit);
}

/** Products by handle, in the given order; falls back to in-stock products with photos. */
export async function pickProducts(handles: string[], count: number): Promise<Product[]> {
  const products = await getProducts();
  const chosen = handles
    .map((h) => products.find((p) => p.handle === h))
    .filter((p): p is Product => p !== undefined);
  const fill = products.filter((p) => p.available && p.images.length > 0 && !chosen.includes(p));
  return [...chosen, ...fill].slice(0, count);
}
