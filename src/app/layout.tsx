import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import AiConsultant from "@/components/AiConsultant";

const playfair = Playfair_Display({
  subsets: ["cyrillic"],
  variable: "--font-playfair",
});
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Цветочный | Магазин цветов",
  description: "Свежие цветы и букеты с доставкой",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="bg-rose-50 text-stone-800 font-nunito min-h-screen flex flex-col">
        <SessionProviderWrapper>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </SessionProviderWrapper>
        <AiConsultant />
      </body>
    </html>
  );
}
