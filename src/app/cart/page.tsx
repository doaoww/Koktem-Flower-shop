"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-rose-200 mx-auto mb-4" />
        <h2 className="font-playfair text-2xl font-bold text-stone-700 mb-2">
          Корзина пуста
        </h2>
        <p className="text-stone-500 mb-8">
          Добавьте что-нибудь из нашего каталога
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
        >
          В каталог <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold text-stone-800 mb-8">
        Корзина
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-sm border border-rose-50"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-800 text-sm line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-rose-500 font-bold mt-1">
                  {product.price.toLocaleString("ru-RU")} ₸
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    quantity === 1
                      ? removeItem(product.id)
                      : updateQty(product.id, quantity - 1)
                  }
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3 h-3 text-rose-500" />
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => updateQty(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3 h-3 text-rose-500" />
                </button>
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="text-stone-300 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 h-fit">
          <h2 className="font-playfair text-xl font-bold mb-4">Итого</h2>
          <div className="flex justify-between text-stone-600 mb-2">
            <span>Товары ({items.length})</span>
            <span>{total.toLocaleString("ru-RU")} ₸</span>
          </div>
          <div className="flex justify-between text-stone-600 mb-4">
            <span>Доставка</span>
            <span className="text-green-600 font-semibold">Бесплатно</span>
          </div>
          <div className="border-t border-rose-100 pt-4 flex justify-between font-bold text-xl mb-6">
            <span>Итого</span>
            <span className="text-rose-600">
              {total.toLocaleString("ru-RU")} ₸
            </span>
          </div>
          <Link
            href="/checkout"
            className="block text-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            Оформить заказ
          </Link>
        </div>
      </div>
    </div>
  );
}
