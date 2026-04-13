"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Product, CATEGORY_LABELS } from "@/types";
import { useCart } from "@/context/CartContext";
import FrequentlyBought from "@/components/FrequentlyBought";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data: Product = await res.json();
        setProduct(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="h-96 bg-rose-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-rose-100 rounded w-3/4" />
            <div className="h-4 bg-rose-50 rounded w-full" />
            <div className="h-4 bg-rose-50 rounded w-2/3" />
            <div className="h-12 bg-rose-100 rounded-2xl w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-stone-500 text-lg mb-6">Товар не найден</p>
        <Link
          href="/catalog"
          className="text-rose-500 hover:text-rose-600 font-semibold"
        >
          ← Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад в каталог
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            {product.name}
          </h1>
          <p className="text-stone-500 text-base leading-relaxed mb-6">
            {product.description}
          </p>
          <div className="text-3xl font-bold text-rose-600 mb-4">
            {product.price.toLocaleString("ru-RU")} ₸
          </div>
          <p
            className={`text-sm mb-6 font-medium ${
              product.inStock ? "text-green-600" : "text-stone-400"
            }`}
          >
            {product.inStock ? "✓ Есть в наличии" : "✗ Нет в наличии"}
          </p>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              added
                ? "bg-green-500 text-white"
                : product.inStock
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Добавлено в корзину!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />В корзину
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    
  );
  <FrequentlyBought />
  
}

