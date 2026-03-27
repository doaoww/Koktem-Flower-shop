import { Flower2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-rose-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-sm">
        <div className="flex items-center gap-2 font-playfair text-lg font-bold text-rose-500">
          <Flower2 className="w-5 h-5" />
          Цветочный
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center text-stone-400">
          <span>📞 +7 (777) 000-00-00</span>
          <span>⏰ Пн–Вс, 08:00–22:00</span>
          <span>📍 Алматы</span>
        </div>
        <p>© 2025 Все права защищены</p>
      </div>
    </footer>
  );
}
