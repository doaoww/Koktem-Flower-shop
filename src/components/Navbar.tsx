"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingBag, Flower2, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import AuthButton from "@/components/AuthButton";

export default function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-playfair text-xl font-bold text-rose-600"
        >
          <Flower2 className="w-6 h-6" />
          Kóktem
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-stone-600 hover:text-rose-500 font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Cart + Wishlist + mobile menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/wishlist"
            className="relative p-2 hover:bg-rose-50 rounded-full transition-colors"
          >
            <Heart className="w-6 h-6 text-stone-700" />
            {wishCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative p-2 hover:bg-rose-50 rounded-full transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-stone-700" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>
          <AuthButton />
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-rose-100 px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-stone-700 hover:text-rose-500 font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}