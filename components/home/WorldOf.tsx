import Image from "next/image";
import Link from "next/link";
import { WORLD_OF } from "@/lib/content";

/** Endless vertical (desktop) / horizontal (mobile) strip; the list is doubled so the loop is seamless. */
function Carousel({ images, direction }: { images: string[]; direction: "up" | "down" }) {
  return (
    <div className="sma-world__carousel">
      <div className={`sma-world__track sma-world__track--${direction}`}>
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            className="sma-world__photo"
            src={src}
            alt=""
            width={800}
            height={1071}
            sizes="(max-width: 767px) 90px, 20vw"
            aria-hidden={i >= images.length || undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function WorldOf() {
  return (
    <section className="sma-world">
      <div className="sma-world__side sma-world__side--left">
        <Carousel images={WORLD_OF.imagesLeft} direction="up" />
      </div>

      <div className="sma-world__center">
        <div className="sma-world__headings">
          <h2 className="sma-primary-heading">{WORLD_OF.heading}</h2>
          <h2 className="sma-primary-heading sma-world__accent">{WORLD_OF.headingAccent}</h2>
        </div>
        <div className="sma-world__divider" />
        <div className="sma-world__body">
          <div className="sma-body-text">
            {WORLD_OF.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <ul className="sma-world__features">
            {WORLD_OF.features.map((f) => (
              <li key={f.label} className="sma-world__feature">
                <Image src={f.icon} alt="" width={40} height={40} unoptimized />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
          <Link href={WORLD_OF.cta.href} className="sma-button-primary">
            {WORLD_OF.cta.label}
          </Link>
        </div>
      </div>

      <div className="sma-world__side sma-world__side--right">
        <Carousel images={WORLD_OF.imagesRight} direction="down" />
      </div>
    </section>
  );
}
