"use client";

import { type ElementType, useEffect, useRef, useState } from "react";

/** Slide-up + fade when scrolled into view, cascaded by `order` (75ms steps). */
export function Reveal({
  as: Tag = "div",
  order = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  order?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`scroll-trigger animate--slide-in${visible ? " is-visible" : ""} ${className}`.trim()}
      style={{ "--animation-order": order } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
