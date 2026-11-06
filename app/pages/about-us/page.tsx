import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Intention } from "@/components/home/Intention";
import { ABOUT, ABOUT_PAGE, FOOTER } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT_PAGE.intro,
};

export default function AboutPage() {
  return (
    <>
      <section className="about-page">
        <header className="page-hero">
          <span className="sma-label-text">{ABOUT_PAGE.label}</span>
          <h1 className="sma-primary-heading">{ABOUT_PAGE.heading}</h1>
        </header>

        <div className="about-page__grid">
          <Image className="about-page__image" src={ABOUT.imageLeft} alt="" width={572} height={512} preload sizes="(max-width: 749px) 100vw, 45vw" />
          <div className="sma-body-text about-page__text">
            <p>{ABOUT_PAGE.intro}</p>
            <p>
              <em>{ABOUT_PAGE.question}</em>
            </p>
            {ABOUT_PAGE.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <div className="about-page__badges">
          {FOOTER.badges.map((b) => (
            <div key={b.label} className="about-page__badge">
              <Image src={b.icon} alt="" width={28} height={28} unoptimized />
              <span className="sma-label-text">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Intention />

      <section className="about-page about-page--care" id="materials">
        <span className="sma-label-text">Materials &amp; care</span>
        <h2 className="sma-primary-heading">Made to stay.</h2>
        <p className="sma-body-text" id="care">
          {ABOUT_PAGE.materials}
        </p>
        <Link href="/collections/all" className="sma-button-primary">
          Shop the collection
        </Link>
      </section>
    </>
  );
}
