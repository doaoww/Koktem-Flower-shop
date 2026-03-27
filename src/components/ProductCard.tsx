"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-rose-50 hover:-translate-y-1">
        <div className="relative overflow-hidden h-56">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.popular && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Хит
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-stone-500 font-semibold">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-playfair font-semibold text-stone-800 text-lg leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-stone-400 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-rose-600 text-lg whitespace-nowrap">
              {product.price.toLocaleString("ru-RU")} ₸
            </span>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                added
                  ? "bg-green-100 text-green-700"
                  : product.inStock
                    ? "bg-rose-100 hover:bg-rose-500 hover:text-white text-rose-600"
                    : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              {added ? "Добавлено!" : "В корзину"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
