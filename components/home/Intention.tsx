import Image from "next/image";
import { INTENTION } from "@/lib/content";

export function Intention() {
  return (
    <section className="sma-intention">
      <div className="sma-intention__banner">
        <Image className="sma-intention__banner-image" src={INTENTION.image} alt="" fill sizes="100vw" />
        <div className="sma-intention__content">
          <p className="sma-label-text">{INTENTION.label}</p>
          <h2 className="sma-primary-heading">{INTENTION.heading}</h2>
          <p className="sma-body-text">{INTENTION.body}</p>
        </div>
      </div>
      <div className="sma-intention__columns-row">
        <div className="sma-intention__columns">
          {INTENTION.columns.map((col) => (
            <div key={col.title} className="sma-intention__column">
              <div className="sma-intention__image-wrap">
                <Image src={col.image} alt="" fill sizes="(max-width: 749px) 240px, 400px" />
              </div>
              <h3 className="sma-primary-heading">{col.title}</h3>
              <p className="sma-body-text">{col.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
