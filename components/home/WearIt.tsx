import { WEAR_IT } from "@/lib/content";
import { type Product, sized } from "@/lib/shop";
import { WearCarousel } from "./WearCarousel";

export function WearIt({ products }: { products: Product[] }) {
  return (
    <section className="sma-wear-it">
      <div className="sma-wear-header">
        <h2 className="sma-primary-heading">{WEAR_IT.heading}</h2>
        <p className="sma-body-text">{WEAR_IT.body}</p>
      </div>

      {WEAR_IT.rows.map((row, i) => {
        // Rotate the list so each row leads with different pieces
        const offset = (i * 2) % Math.max(products.length, 1);
        const list = [...products.slice(offset), ...products.slice(0, offset)];
        return (
          <div key={row.title} className={`sma-wear-row${i % 2 === 1 ? " sma-wear-row--swap" : ""}`}>
            <div
              className="sma-wear-image-column"
              role="img"
              aria-label={row.title}
              style={{ backgroundImage: `url('${sized(row.image, 1500)}')` }}
            />
            <div className="sma-wear-content-column">
              <p className="sma-label-text">Wear it for</p>
              <h2 className="sma-primary-heading">{row.title}</h2>
              <p className="sma-body-text">{row.body}</p>
              <WearCarousel products={list} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
