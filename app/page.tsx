import { AboutIntro } from "@/components/home/AboutIntro";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { Intention } from "@/components/home/Intention";
import { ProductReel } from "@/components/home/ProductReel";
import { ShopBy } from "@/components/home/ShopBy";
import { Signatures } from "@/components/home/Signatures";
import { Testimonials } from "@/components/home/Testimonials";
import { WearIt } from "@/components/home/WearIt";
import { WorldOf } from "@/components/home/WorldOf";
import { getProducts, pickProducts } from "@/lib/catalog";
import { FEATURED, REEL } from "@/lib/content";

export default async function HomePage() {
  const [all, featured, reel] = await Promise.all([
    getProducts(),
    pickProducts(FEATURED.products, 4),
    pickProducts(REEL.products, 6),
  ]);
  // Lead with pieces that are in stock and photographed
  const showcase = all.filter((p) => p.available && p.images.length > 0);

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <Signatures items={showcase.slice(0, 9).map((product) => ({ product, category: product.group }))} />
      <CategoryGrid />
      <WearIt products={showcase.slice(0, 8)} />
      <ShopBy />
      <AboutIntro />
      <Intention />
      <WorldOf />
      <Testimonials />
      <ProductReel products={reel} />
    </>
  );
}
