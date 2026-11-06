import Image from "next/image";
import Link from "next/link";
import { SHOP_BY } from "@/lib/content";

/** Tiles whose media zooms 1.08 and blurs 4px on hover. */
export function ShopBy() {
  return (
    <section className="sma-shop-by">
      <div className="sma-shop-by__inner">
        <div className="sma-shop-by__intro">
          <span className="sma-label-text">{SHOP_BY.label}</span>
          <h2 className="sma-primary-heading">{SHOP_BY.heading}</h2>
          <p className="sma-body-text">{SHOP_BY.body}</p>
        </div>

        <div className="sma-shop-by__grid">
          <div className="sma-shop-by__row--video">
            {SHOP_BY.videos.map((tile) => (
              <Link key={tile.title} href="/collections/signature" className="sma-shop-by__box sma-shop-by__box--video">
                <video className="sma-shop-by__media" src={tile.video} autoPlay loop muted playsInline preload="metadata" />
                <div className="sma-shop-by__overlay" />
                <div className="sma-shop-by__content">
                  <span className="sma-primary-heading">{tile.title}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="sma-shop-by__row--images">
            {SHOP_BY.images.map((tile) => (
              <Link key={tile.title} href="/collections/signature" className="sma-shop-by__box sma-shop-by__box--image">
                <Image className="sma-shop-by__media" src={tile.image} alt="" fill sizes="(max-width: 767px) 33vw, 400px" />
                <div className="sma-shop-by__overlay" />
                <div className="sma-shop-by__content">
                  <span className="sma-primary-heading">{tile.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="sma-shop-by__cta">
          <Link className="sma-button-primary" href="/collections/all">
            Shop All
          </Link>
        </div>
      </div>
    </section>
  );
}
