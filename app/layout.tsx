import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Julmill Jewelry",
    template: "%s | Julmill Jewelry",
  },
  description: "India’s first 316L surgical-grade jewelry — made to wear every day, made to feel like it was made for you.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
