import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionView } from "@/components/CollectionView";
import { getCollection, getCollectionProducts, getCollections } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  return collection ? { title: collection.title, description: collection.description || undefined } : {};
}

// The page shell renders instantly; the collection (which depends on the URL)
// streams in behind Suspense.
export default function CollectionPage({ params }: PageProps<"/collections/[handle]">) {
  return (
    <section className="collection collection--page">
      <Suspense fallback={<CollectionSkeleton />}>
        <CollectionContent params={params} />
      </Suspense>
    </section>
  );
}

function CollectionSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading collection">
      <header className="page-hero">
        <span className="skeleton skeleton--title" style={{ margin: "0 auto" }} />
      </header>
      <ul className="collection-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="product-card skeleton" />
        ))}
      </ul>
    </div>
  );
}

async function CollectionContent({ params }: { params: PageProps<"/collections/[handle]">["params"] }) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();

  const items = (await getCollectionProducts(handle)).map((product) => ({ product, category: product.group }));

  return (
    <>
      <header className="page-hero">
        <span className="sma-label-text">Collection</span>
        <h1 className="sma-primary-heading">{collection.title}</h1>
        {collection.description && <p className="sma-body-text">{collection.description}</p>}
      </header>
      {/* Filters read the query string, so they render on the client */}
      <Suspense fallback={<div className="collection-toolbar" />}>
        <CollectionView items={items} />
      </Suspense>
    </>
  );
}
