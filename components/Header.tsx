"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOGO, NAV } from "@/lib/content";
import { useCart } from "./cart/CartProvider";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, open: openCart } = useCart();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  // Only the homepage hero sits under a transparent header
  const overlay = pathname === "/";

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 94);
      setHidden(y > last && y > 94);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={[
          "site-header",
          overlay ? "site-header--overlay" : "",
          scrolled || !overlay ? "is-scrolled" : "",
          hidden && !searchOpen ? "is-hidden" : "",
        ].join(" ")}
      >
        <div className="header">
          <nav className="header__nav" aria-label="Main">
            <button type="button" className="header__icon header__burger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
            <ul className="header__menu">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`header__menu-item${isActive(item.href) ? " header__menu-item--active" : ""}`}>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="header__logo" aria-label="Julmill home">
            <Image src={LOGO} alt="Julmill" width={800} height={182} sizes="160px" preload />
          </Link>

          <div className="header__icons">
            <button type="button" className="header__icon" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            </button>
            <Link href="/account" className="header__icon header__icon--account" aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
            </Link>
            <button type="button" className="header__icon header__cart" aria-label={`Cart, ${count} items`} onClick={openCart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              {count > 0 && <span className="header__cart-count">{count}</span>}
            </button>
          </div>
        </div>

        <form
          className={`header-search${searchOpen ? " is-open" : ""}`}
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = searchInput.current?.value.trim() ?? "";
            setSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <input ref={searchInput} type="search" name="q" placeholder="Search" aria-label="Search products" />
          <button type="submit" className="sma-button-second">Search</button>
        </form>
      </header>

      <div className={`drawer-backdrop${drawerOpen ? " is-open" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <nav className={`menu-drawer${drawerOpen ? " is-open" : ""}`} aria-label="Mobile" inert={!drawerOpen}>
        <button type="button" className="header__icon menu-drawer__close" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
