"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/content";

const items = TESTIMONIALS.items;

/** Inactive quotes sit at 50%; selecting one slides the track and cross-fades the photo. */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [shownImage, setShownImage] = useState(0);
  const [fading, setFading] = useState(false);
  const [offset, setOffset] = useState(0);
  const touchX = useRef(0);

  const goTo = (i: number) => {
    if (i < 0 || i >= items.length) return;
    setActive(i);
  };

  // Track offset = widths of the slides before the active one
  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      const gap = parseFloat(getComputedStyle(t).gap) || 0;
      let x = 0;
      for (let k = 0; k < active; k++) x += (t.children[k] as HTMLElement).offsetWidth + gap;
      setOffset(x);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Cross-fade the photo
  useEffect(() => {
    if (active === shownImage) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFading(true);
    const id = setTimeout(() => {
      setShownImage(active);
      setFading(false);
    }, 200);
    return () => clearTimeout(id);
  }, [active, shownImage]);

  // Mobile only: auto-advance every 5s while on screen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const mobile = window.matchMedia("(max-width: 768px)");
    const io = new IntersectionObserver(
      ([e]) => {
        clearInterval(timer);
        if (e.isIntersecting && mobile.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          timer = setInterval(() => setActive((a) => (a + 1) % items.length), 5000);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="sma-testimonial" ref={root}>
      <div className="sma-testimonial__container">
        <div className="sma-testimonial__row-1">
          <div>
            <span className="sma-label-text">{TESTIMONIALS.label}</span>
            <h2 className="sma-primary-heading">{TESTIMONIALS.heading}</h2>
            <p className="sma-body-text">{TESTIMONIALS.body}</p>
          </div>
          <nav className="sma-testimonial__nav" aria-label="Testimonial navigation">
            <button
              type="button"
              aria-label="Previous testimonial"
              className={`sma-testimonial__nav-btn sma-testimonial__nav-btn--prev${active === 0 ? " is-disabled" : ""}`}
              onClick={() => goTo(active - 1)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className={`sma-testimonial__nav-btn${active === items.length - 1 ? " is-disabled" : ""}`}
              onClick={() => goTo(active + 1)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </nav>
        </div>

        <div className="sma-testimonial__row-2">
          <div className="sma-testimonial__image-wrapper">
            <Image
              className="sma-testimonial__image"
              src={items[shownImage].image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ opacity: fading ? 0 : 1 }}
            />
          </div>
          <div className="sma-testimonial__carousel">
            <div
              ref={track}
              className="sma-testimonial__track"
              style={{ transform: `translateX(-${offset}px)` }}
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (dx < -50) setActive((a) => (a + 1) % items.length);
                else if (dx > 50) setActive((a) => (a - 1 + items.length) % items.length);
              }}
            >
              {items.map((t, i) => (
                <article
                  key={t.name}
                  className={`sma-testimonial__slide${i === active ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Testimonial ${i + 1} of ${items.length}`}
                >
                  <h3 className="sma-primary-heading">{t.title}</h3>
                  <p className="sma-body-text">{t.body}</p>
                  <div className="sma-testimonial__slide-footer">
                    <span className="sma-label-text">{t.name}</span>
                    <span className="sma-chotta-text">{t.city}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="sma-testimonial__dots" role="tablist">
              {items.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-selected={i === active}
                  className={`sma-testimonial__dot${i === active ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
