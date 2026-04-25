import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "Кокtem | Цветочный магазин",
  description: "Свежие цветы и букеты с доставкой по Алматы",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${nunito.variable}`}>
      <head>
        {/* Принудительно указываем favicon чтобы перебить кэш */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-rose-50 text-stone-800 font-nunito min-h-screen flex flex-col">
        <SessionProviderWrapper>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <AiConsultant />
            </WishlistProvider>
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
