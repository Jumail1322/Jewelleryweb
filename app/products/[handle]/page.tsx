import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.title,
    description: product.seoDescription ?? (product.description.replace(/\s+/g, " ").slice(0, 160) || undefined),
    openGraph: { images: product.images.slice(0, 1).map((i) => i.src) },
  };
}

const DETAILS = [
  {
    title: "Care",
    body: "Wipe with a soft, dry cloth after wearing and store each piece separately to avoid scratches.",
  },
  {
    title: "Shipping & returns",
    body: "Free shipping and easy 15 day returns. See our policies for details.",
  },
];

// The page shell renders instantly; the product (which depends on the URL)
// streams in behind Suspense.
export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <section className="pdp" aria-busy="true" aria-label="Loading product">
      <div className="pdp-gallery">
        <div className="pdp-gallery__main skeleton" />
      </div>
      <div className="pdp-info">
        <span className="skeleton skeleton--line" style={{ width: "20%" }} />
        <span className="skeleton skeleton--title" />
        <span className="skeleton skeleton--line" style={{ width: "30%" }} />
        <span className="skeleton skeleton--button" />
      </div>
    </section>
  );
}

async function ProductDetails({ params }: { params: PageProps<"/products/[handle]">["params"] }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <>
      <section className="pdp">
        <ProductGallery images={product.images} title={product.title} />

        <div className="pdp-info">
          <p className="sma-label-text">{product.category ?? "Julmill"}</p>
          <h1 className="sma-primary-heading pdp-title">{product.title}</h1>
          <AddToCart product={product} />

          {product.description && (
            <div className="sma-body-text pdp-description">
              {product.description.split(/\n{2,}/).map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          )}

          <div className="pdp-accordion">
            {product.specifications.length > 0 && (
              <details open>
                <summary>Specifications</summary>
                <dl className="pdp-specs">
                  {product.specifications.map((s) => (
                    <div key={s.name}>
                      <dt>{s.name}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
            {DETAILS.map((d) => (
              <details key={d.title}>
                <summary>{d.title}</summary>
                <p className="sma-body-text">{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="collection related">
          <div className="collection__title">
            <div className="collection__title-left">
              <span className="sma-label-text">You may also like</span>
              <h2 className="sma-primary-heading">Pair it with</h2>
            </div>
          </div>
          <ul className="collection-grid collection-grid--4">
            {related.map((p) => (
              <li key={p.handle}>
                <ProductCard product={p} sizes="(max-width: 749px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
