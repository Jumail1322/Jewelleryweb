import type { NextConfig } from "next";

const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "ornmnt-jewelry.myshopify.com";
const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: { root: __dirname },
  // Legal policies are still hosted on Shopify
  async redirects() {
    const shop = `https://${SHOP_DOMAIN}`;
    return [
      { source: "/policies/:slug", destination: `${shop}/policies/:slug`, permanent: false },
      { source: "/products", destination: "/collections/all", permanent: true },
      { source: "/collections", destination: "/collections/all", permanent: true },
    ];
  },
  // Built-in optimizer: backend uploads are often multi-MB PNGs, so they are
  // resized to the rendered size and served as WebP from /_next/image.
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      ...(API_HOST ? [{ protocol: "https" as const, hostname: API_HOST, pathname: "/media/**" }] : []),
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
