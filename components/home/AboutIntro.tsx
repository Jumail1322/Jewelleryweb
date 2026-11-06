import Image from "next/image";
import Link from "next/link";
import { ABOUT } from "@/lib/content";

export function AboutIntro() {
  return (
    <section className="sma-home-about">
      <div className="sma-home-about__inner">
        <div className="sma-home-about__col sma-home-about__col--left">
          <Image className="sma-home-about__image--left" src={ABOUT.imageLeft} alt="" width={572} height={512} sizes="300px" />
        </div>
        <div className="sma-home-about__col sma-home-about__col--center">
          <p className="sma-label-text">{ABOUT.label}</p>
          <h2 className="sma-primary-heading">{ABOUT.heading}</h2>
          <div className="sma-body-text">
            {ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <strong>{ABOUT.closing}</strong>
            </p>
          </div>
          <Link href="/pages/about-us" className="sma-button-primary">
            Learn more
          </Link>
        </div>
        <div className="sma-home-about__col sma-home-about__col--right">
          <Image className="sma-home-about__image--right" src={ABOUT.imageRight} alt="" width={490} height={512} sizes="271px" />
        </div>
      </div>
    </section>
  );
}
