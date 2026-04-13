"use client";

import { useEffect, useState } from "react";
import { Product, Category, CATEGORY_LABELS, Occasion, OCCASION_LABELS } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("all");
  const [occasion, setOccasion] = useState<Occasion>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?category=${category}`);
        if (!res.ok) throw new Error("Ошибка загрузки");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch {
        setError("Не удалось загрузить товары. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesOccasion =
      occasion === "all" || (p.occasion ?? []).includes(occasion);
    return matchesSearch && matchesOccasion;
  });

  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
  const occasions = Object.entries(OCCASION_LABELS) as [Occasion, string][];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold text-stone-800 mb-8">
        Каталог
      </h1>

      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-rose-200 rounded-xl px-4 py-2.5 mb-6 outline-none focus:ring-2 focus:ring-rose-300 bg-white text-stone-700"
      />

      {/* Фильтр по категории */}
      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
        Категория
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(([val, label]) => (
          <button
            key={val}
            onClick={() => setCategory(val)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              category === val
                ? "bg-rose-500 text-white"
                : "bg-white text-stone-600 hover:bg-rose-50 border border-rose-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Фильтр по поводу */}
      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
        Повод
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {occasions.map(([val, label]) => (
          <button
            key={val}
            onClick={() => setOccasion(val)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              occasion === val
                ? "bg-pink-400 text-white"
                : "bg-white text-stone-600 hover:bg-pink-50 border border-pink-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : filtered.length > 0 ? (
          filtered.map((p, index) => (
            <div
              key={p.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={p} priority={index === 0} />
            </div>
          ))
        ) : (
          <p className="text-stone-500 col-span-full text-center py-16">
            Ничего не найдено
          </p>
        )}
      </div>
    </div>
  );
}