import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-section not-found">
      <span className="sma-label-text">404</span>
      <h1 className="sma-primary-heading">Page not found</h1>
      <p className="sma-body-text">The page you were looking for does not exist.</p>
      <Link href="/collections/all" className="sma-button-primary">
        Continue shopping
      </Link>
    </section>
  );
}
