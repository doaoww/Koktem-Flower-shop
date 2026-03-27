import Link from "next/link";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Clock, Heart } from "lucide-react";

export default async function HomePage() {
  const popular = await getProducts();
  const featured = popular.filter((p) => p.popular).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-white py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none text-[200px] leading-none text-rose-300 flex items-center justify-center font-playfair">
          🌸
        </div>
        <div className="relative max-w-2xl mx-auto">
          <p className="text-rose-400 font-semibold tracking-widest uppercase text-sm mb-3">
            Свежие цветы с доставкой
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-stone-800 leading-tight mb-6">
            Подарите радость
            <br />
            <span className="text-rose-500">живыми цветами</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8">
            Букеты, растения и подарочные наборы для любого повода. Доставим
            быстро и красиво.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-lg shadow-lg hover:shadow-rose-200"
          >
            Перейти в каталог <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Truck className="w-7 h-7 text-rose-400" />,
            title: "Быстрая доставка",
            text: "Доставим в течение 2 часов по городу",
          },
          {
            icon: <Heart className="w-7 h-7 text-rose-400" />,
            title: "Только свежие цветы",
            text: "Ежедневные поставки с лучших плантаций",
          },
          {
            icon: <Clock className="w-7 h-7 text-rose-400" />,
            title: "Работаем 7 дней",
            text: "С 8:00 до 22:00, без выходных",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-rose-50"
          >
            <div className="flex justify-center mb-3">{b.icon}</div>
            <h3 className="font-playfair font-semibold text-lg mb-1">
              {b.title}
            </h3>
            <p className="text-stone-500 text-sm">{b.text}</p>
          </div>
        ))}
      </section>

      {/* Popular products */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-playfair text-3xl font-bold text-stone-800">
            Хиты продаж
          </h2>
          <Link
            href="/catalog"
            className="text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
          >
            Смотреть все <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, index) => (
            <ProductCard key={p.id} product={p} priority={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
