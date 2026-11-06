import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/shop";

/** Card with the theme's hover: image zooms 1.03 over .5s; a second image cross-fades in when there is one. */
export function ProductCard({ product, sizes = "(max-width: 749px) 50vw, 33vw" }: { product: Product; sizes?: string }) {
  const [first, second] = product.images;
  return (
    <Link href={`/products/${product.handle}`} className={`product-card${second ? " product-card--swap" : ""}`}>
      {first ? (
        <Image className="product-card__img" src={first.src} alt={first.alt} fill sizes={sizes} />
      ) : (
        <span className="product-card__placeholder" aria-hidden="true">{product.title.charAt(0)}</span>
      )}
      {second && <Image className="product-card__img product-card__img--alt" src={second.src} alt="" fill sizes={sizes} />}
      <div className="product-card__info">
        <span className="product-card__title">{product.title}</span>
        <span className="product-card__price">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <s className="product-card__compare">{formatPrice(product.compareAtPrice)}</s>
          )}
          {formatPrice(product.price)}
        </span>
      </div>
      {!product.available && <span className="product-card__badge">Sold out</span>}
      <span className="sma-button-third product-card__cta">View details</span>
    </Link>
  );
}
