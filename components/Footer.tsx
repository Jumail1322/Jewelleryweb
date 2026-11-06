import Image from "next/image";
import Link from "next/link";
import { FOOTER, FOOTER_LOGO } from "@/lib/content";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="sma-footer">
      <div className="sma-footer__inner">
        <div className="sma-footer__logo-row">
          <span className="sma-footer__divider sma-footer__divider--left" />
          <div className="sma-footer__logo">
            <Image src={FOOTER_LOGO} alt="Julmill" width={800} height={182} sizes="200px" />
          </div>
          <span className="sma-footer__divider" />
        </div>

        <div className="sma-footer__main-row">
          <div className="sma-footer__left-col">
            <div className="sma-footer__newsletter">
              <h2 className="sma-primary-heading">{FOOTER.heading}</h2>
              <p className="sma-body-text sma-footer__subheading">{FOOTER.subheading}</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="sma-footer__right-col">
            <div className="sma-footer__menu-wrapper">
              {FOOTER.menus.map((menu) => (
                <div key={menu.title} className="sma-footer__menu-col">
                  <span className="sma-label-text sma-footer__menu-heading">{menu.title}</span>
                  <ul className="sma-footer__menu-list">
                    {menu.links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith("/policies/") ? (
                          // Redirects to Shopify, so it needs a full page load
                          <a href={link.href} className="sma-body-text sma-footer__menu-link">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className="sma-body-text sma-footer__menu-link">
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="sma-footer__menu-col sma-footer__menu-col--last">
                <div>
                  <span className="sma-label-text sma-footer__menu-heading">Connect</span>
                  <ul className="sma-footer__menu-list">
                    {FOOTER.connect.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="sma-body-text sma-footer__menu-link">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="sma-body-text sma-footer__copyright">© 2026 Julmill. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="sma-footer__hr" />

        <div className="sma-footer__icons-row">
          {FOOTER.badges.map((badge) => (
            <div key={badge.label} className="sma-footer__icon-item">
              <Image src={badge.icon} alt="" width={20} height={20} unoptimized />
              <span className="sma-label-text">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
