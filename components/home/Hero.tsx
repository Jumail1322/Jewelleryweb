"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HERO } from "@/lib/content";

function ArrivalsCarousel() {
  const slides: string[][] = [];
  for (let i = 0; i < HERO.arrivals.images.length; i += 2) slides.push(HERO.arrivals.images.slice(i, i + 2));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div className="sma-banner__carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="sma-banner__carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((pair, i) => (
          <div key={i} className="sma-banner__carousel-slide">
            {pair.map((src) => (
              <div key={src} className="sma-banner__carousel-image">
                <Image src={src} alt="" fill sizes="170px" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="sma-banner">
      <picture className="sma-banner__bg">
        <source media="(max-width: 768px)" srcSet={HERO.imageMobile} />
        <Image src={HERO.image} alt="" fill preload sizes="100vw" />
      </picture>
      <div className="sma-banner__container">
        <div className="sma-banner__row">
          <div className="sma-banner__col-left">
            <div>
              <h2 className="sma-primary-heading">{HERO.eyebrow}</h2>
              <h1 className="sma-primary-heading sma-banner__main-heading">{HERO.heading}</h1>
            </div>
            <div className="sma-banner__content-box">
              <p className="sma-label-text sma-banner__content-label">{HERO.label}</p>
              <p className="sma-body-text sma-banner__content-body">{HERO.body}</p>
              <Link href={HERO.cta.href} className="sma-button-second">
                {HERO.cta.label}
              </Link>
            </div>
          </div>

          <div className="sma-banner__col-right">
            <Link href={HERO.look.href} className="sma-banner__info-box">
              <Image className="sma-banner__info-image" src={HERO.look.image} alt="" width={148} height={128} />
              <div>
                <p className="sma-label-text sma-banner__info-label">{HERO.look.label}</p>
                <p className="sma-chotta-text sma-banner__info-body">{HERO.look.body}</p>
              </div>
            </Link>
            <Link href={HERO.arrivals.href} className="sma-banner__carousel-box" aria-label={HERO.arrivals.label}>
              <ArrivalsCarousel />
              <div className="sma-banner__carousel-footer">
                <p className="sma-label-text">{HERO.arrivals.label}</p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
