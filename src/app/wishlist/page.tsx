"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Heart className="w-16 h-16 text-rose-200 mx-auto mb-4" />
        <h2 className="font-playfair text-2xl font-bold text-stone-700 mb-2">
          Избранное пусто
        </h2>
        <p className="text-stone-500 mb-8">
          Нажмите на ❤️ на карточке товара чтобы сохранить
        </p>
        <Link
          href="/catalog"
          className="inline-flex bg-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold text-stone-800 mb-8">
        Избранное
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}