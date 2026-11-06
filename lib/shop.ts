// Catalogue model: maps the backend's product/category payloads into the
// shape the UI uses. Pure functions only — safe to import from client components.

type RawImage = { id: string; image: string; alt_text: string | null };
type RawAttribute = { id: string; name: string; value: string };
type RawVariant = {
  id: string;
  sku: string;
  price: number | string | null;
  actual_price: number | string | null;
  stock: number | null;
  attributes: RawAttribute[] | null;
  images: RawImage[] | null;
  is_primary: boolean;
};
export type RawProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  product_category?: string | null;
  /** A URL, a list of URLs/image objects, or [] when the product has none */
  product_images?: string | (string | { image?: string })[] | null;
  specifications?: { id: string; name: string; value: string }[] | null;
  variants?: RawVariant[] | null;
  similar_products?: unknown;
  is_active?: boolean;
  is_deleted?: boolean;
  is_next_day_shipping_available?: boolean;
};
export type RawCategory = {
  id: string;
  name: string;
  image: string | null;
  icon_image: string | null;
  parent: string | null;
  is_deleted: string | boolean | null;
};

export type Image = { src: string; alt: string };

export type Variant = {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  available: boolean;
  attributes: Record<string, string>;
  image: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string | null;
  categoryHandle: string | null;
  group: CategoryGroup;
  tags: string[];
  /** Every backend spec, with customer-friendly labels and units */
  specifications: { name: string; value: string }[];
  /** SEO overrides from the backend (global.title_tag / global.description_tag) */
  seoTitle: string | null;
  seoDescription: string | null;
  /** Option groups shared by every variant (e.g. Size, Color) */
  options: { name: string; values: string[] }[];
  variants: Variant[];
  images: Image[];
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  nextDayShipping: boolean;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  image: string | null;
};

export type CategoryGroup = "necklace" | "earring" | "ring" | "bracelet" | "other";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const num = (v: number | string | null | undefined) => (v === null || v === undefined || v === "" ? null : Number(v));

/** Colour attributes are stored as hex codes. */
export const isHexColor = (v: string) => /^#[0-9a-f]{3,8}$/i.test(v.trim());

/** Jewellery group from category name, falling back to the product name (many items are "Uncategorized"). */
export function groupOf(category: string | null | undefined, title: string): CategoryGroup {
  const hay = `${category ?? ""} ${title}`.toLowerCase();
  if (/necklace|pendant|pendent|chain/.test(hay)) return "necklace";
  if (/earring|stud|hoop|nose pin/.test(hay)) return "earring";
  if (/bracelet|cuff|bangle|anklet/.test(hay)) return "bracelet";
  if (/ring|band/.test(hay)) return "ring";
  return "other";
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Backend descriptions are HTML (<p>, <strong>, <br>…). Turn them into plain paragraphs separated by blank lines. */
export function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) => {
      if (e[0] === "#") {
        const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .split(/\n{2,}/)
    .map((para) => para.replace(/[ \t ]+/g, " ").replace(/ *\n */g, "\n").trim())
    .filter(Boolean)
    .join("\n\n");
}

type SpecKind = "text" | "grams" | "carats" | "count" | "price";

/** Backend spec keys → customer-facing label and unit. Order here is display order. */
const SPEC_FIELDS: Record<string, { label: string; kind: SpecKind }> = {
  "custom.product_code": { label: "Product Code", kind: "text" },
  "custom.product_weight": { label: "Product Weight", kind: "grams" },
  "custom.metal_weight": { label: "Metal Weight", kind: "grams" },
  "custom.total_no_of_stones": { label: "No. of Stones", kind: "count" },
  "custom.total_stone_weight_carat": { label: "Stone Weight (Carat)", kind: "carats" },
  "custom.total_stone_weight_gram": { label: "Stone Weight (Gram)", kind: "grams" },
  "custom.total_metal_price": { label: "Metal Price", kind: "price" },
  "custom.total_making_charges": { label: "Making Charges", kind: "price" },
  "custom.stone_price": { label: "Stone Price", kind: "price" },
  "custom.gst": { label: "GST", kind: "price" },
  "custom.total_price": { label: "Total Price", kind: "price" },
  "global.title_tag": { label: "Title", kind: "text" },
  "global.description_tag": { label: "Description", kind: "text" },
};

const inrPaise = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const trimNum = (n: number) => String(Number(n.toFixed(3)));

function formatSpec(kind: SpecKind, raw: string): string {
  const value = raw.trim();
  const n = Number(value);
  if (kind === "text" || !value || !Number.isFinite(n)) return value;
  switch (kind) {
    case "grams": return `${trimNum(n)} g`;
    case "carats": return `${trimNum(n)} ct`;
    case "count": return String(Math.round(n));
    case "price": return inrPaise.format(n);
  }
}

/** "custom.some_field" → "Some Field" for keys we don't have a label for yet. */
const humanize = (key: string) =>
  key
    .replace(/^[a-z]+\./i, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

function splitSpecs(raw: { name: string; value: string }[]) {
  const byKey = new Map(raw.map((s) => [s.name.trim(), s.value ?? ""]));
  const known = Object.keys(SPEC_FIELDS).filter((k) => byKey.has(k));
  const unknown = [...byKey.keys()].filter((k) => !(k in SPEC_FIELDS));

  const specifications = [
    ...known.map((k) => ({ name: SPEC_FIELDS[k].label, value: formatSpec(SPEC_FIELDS[k].kind, byKey.get(k)!) })),
    ...unknown.map((k) => ({ name: humanize(k), value: byKey.get(k)!.trim() })),
  ].filter((s) => s.value);

  return {
    specifications,
    seoTitle: byKey.get("global.title_tag")?.trim() || null,
    seoDescription: byKey.get("global.description_tag")?.trim() || null,
  };
}

function variantTitle(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    // Hex colours are shown as swatches on the product page, not as text
    .filter(([name, value]) => name !== "Title" && !isHexColor(value))
    .map(([, value]) => value)
    .join(" / ");
}

export function mapProduct(p: RawProduct): Product {
  const rawVariants = [...(p.variants ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary));

  const variants: Variant[] = rawVariants.map((v) => {
    const attributes = Object.fromEntries((v.attributes ?? []).map((a) => [a.name, a.value]));
    const price = num(v.price) ?? 0;
    const actual = num(v.actual_price);
    const stock = v.stock ?? 0;
    return {
      id: v.id,
      sku: v.sku,
      title: variantTitle(attributes),
      price,
      compareAtPrice: actual && actual > price ? actual : null,
      stock,
      available: stock > 0,
      attributes,
      image: v.images?.[0]?.image ?? null,
    };
  });

  // Gallery: every variant image (primary variant first), de-duplicated
  const seen = new Set<string>();
  const images: Image[] = [];
  for (const v of rawVariants) {
    for (const img of v.images ?? []) {
      if (!seen.has(img.image)) {
        seen.add(img.image);
        images.push({ src: img.image, alt: img.alt_text || p.name });
      }
    }
  }
  if (images.length === 0) {
    const fallback = Array.isArray(p.product_images) ? p.product_images : [p.product_images];
    for (const item of fallback) {
      const src = typeof item === "string" ? item : item?.image;
      if (src) images.push({ src, alt: p.name });
    }
  }

  // Only offer an option picker for attributes every variant has
  const names = variants.length ? Object.keys(variants[0].attributes).filter((n) => n !== "Title") : [];
  const options = names
    .filter((n) => variants.every((v) => n in v.attributes))
    .map((name) => ({ name, values: [...new Set(variants.map((v) => v.attributes[name]))] }))
    .filter((o) => o.values.length > 1);

  const primary = variants.find((v) => v.available) ?? variants[0];
  const category = p.product_category && p.product_category !== "Uncategorized" ? p.product_category : null;

  return {
    id: p.id,
    handle: p.slug,
    title: p.name,
    description: htmlToText(p.description ?? ""),
    category,
    categoryHandle: category ? slugify(category) : null,
    group: groupOf(category, p.name),
    tags: (p.specifications ?? []).map((s) => s.value),
    ...splitSpecs(p.specifications ?? []),
    options,
    variants,
    images,
    price: primary?.price ?? 0,
    compareAtPrice: primary?.compareAtPrice ?? null,
    available: variants.some((v) => v.available),
    nextDayShipping: Boolean(p.is_next_day_shipping_available),
  };
}

export function mapCategory(c: RawCategory): Collection {
  return { handle: slugify(c.name), title: c.name, description: "", image: c.image };
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return inr.format(Math.round(amount));
}

/** Shopify CDN images can be resized with ?width=; local files and other hosts are returned as-is. */
export function sized(src: string, width: number): string {
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  const url = new URL(src.startsWith("//") ? `https:${src}` : src);
  if (/shopify/.test(url.hostname)) url.searchParams.set("width", String(width));
  return url.toString();
}
