"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Plus } from "lucide-react";

const ADD_ONS: Product[] = [
  {
    id: "addon-1",
    name: "Коробка Raffaello",
    description: "Нежные кокосовые конфеты",
    price: 2500,
    image: "/flowers/addon-candy.jpg",
    category: "gift",
    occasion: [],
    inStock: true,
    popular: false,
  },
  {
    id: "addon-2",
    name: "Мягкая игрушка — Мишка",
    description: "Плюшевый мишка 30 см",
    price: 3500,
    image: "/flowers/addon-bear.jpg",
    category: "gift",
    occasion: [],
    inStock: true,
    popular: false,
  },
  {
    id: "addon-3",
    name: "Топпер «С Днём Рождения»",
    description: "Деревянный топпер для букета",
    price: 800,
    image: "/flowers/addon-topper.jpg",
    category: "gift",
    occasion: [],
    inStock: true,
    popular: false,
  },
];

export default function FrequentlyBought() {
  const { addItem } = useCart();

  return (
    <div className="mt-10">
      <h2 className="font-playfair text-2xl font-bold text-stone-800 mb-4">
        С этим часто покупают
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ADD_ONS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-rose-50 shadow-sm"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm line-clamp-1">
                {item.name}
              </p>
              <p className="text-rose-500 font-bold text-sm">
                {item.price.toLocaleString("ru-RU")} ₸
              </p>
            </div>
            <button
              onClick={() => addItem(item)}
              className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-500 hover:text-white text-rose-500 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}