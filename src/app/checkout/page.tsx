"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

interface FormData {
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  cardMessage: string;
  comment: string;
}

interface FormErrors {
  customerName?: string;
  phone?: string;
  address?: string;
  deliveryDate?: string;
  deliveryTime?: string;
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11 && (cleaned.startsWith("7") || cleaned.startsWith("8"));
}

function validateAddress(address: string): boolean {
  const parts = address.trim().split(",");
  return parts.length >= 3 && address.trim().length >= 15;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<FormData>({
    customerName: "",
    phone: "",
    address: "",
    deliveryDate: today, // ← сегодня по умолчанию
    deliveryTime: "",
    cardMessage: "",
    comment: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Автозаполнение из профиля
  useEffect(() => {
    if (!session) return;
    async function loadProfile() {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          customerName: data.name ?? prev.customerName,
          phone: data.phone ?? prev.phone,
          address: data.address ?? prev.address,
        }));
      }
    }
    loadProfile();
  }, [session]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Убираем ошибку при вводе
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      newErrors.customerName = "Введите ваше имя (минимум 2 символа)";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Введите корректный номер: +7 (777) 000-00-00 (11 цифр)";
    }

    if (!form.address.trim()) {
      newErrors.address = "Введите адрес доставки";
    } else if (!validateAddress(form.address)) {
      newErrors.address = "Укажите полный адрес: Город, улица, дом, квартира";
    }

    if (!form.deliveryDate) {
      newErrors.deliveryDate = "Выберите дату доставки";
    }

    if (!form.deliveryTime) {
      newErrors.deliveryTime = "Выберите время доставки";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (items.length === 0) {
      setError("Корзина пуста");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/order/${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка оформления заказа");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 text-stone-800 transition-colors ${
      errors[field]
        ? "border-red-300 focus:ring-red-200 bg-red-50"
        : "border-rose-100 focus:ring-rose-300 bg-white"
    }`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold text-stone-800 mb-8">
        Оформление заказа
      </h1>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-rose-50 space-y-5">

        {/* Имя */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Ваше имя *
          </label>
          <input
            name="customerName"
            type="text"
            placeholder="Имя Фамилия"
            value={form.customerName}
            onChange={handleChange}
            className={inputClass("customerName")}
          />
          {errors.customerName && (
            <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
          )}
        </div>

        {/* Телефон */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Телефон *
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="+7 (777) 000-00-00"
            value={form.phone}
            onChange={handleChange}
            className={inputClass("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
          <p className="text-stone-400 text-xs mt-1">
            Формат: +7 777 000 00 00 (казахстанский или российский номер)
          </p>
        </div>

        {/* Адрес */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Адрес доставки *
          </label>
          <input
            name="address"
            type="text"
            placeholder="Алматы, ул. Абая 10, кв. 5"
            value={form.address}
            onChange={handleChange}
            className={inputClass("address")}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
          <p className="text-stone-400 text-xs mt-1">
            Укажите: город, улицу, номер дома и квартиру
          </p>
        </div>

        {/* Дата и время */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1">
              Дата доставки *
            </label>
            <input
              name="deliveryDate"
              type="date"
              min={today}
              value={form.deliveryDate}
              onChange={handleChange}
              className={inputClass("deliveryDate")}
            />
            {errors.deliveryDate && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-600 mb-1">
              Время доставки *
            </label>
            <select
              name="deliveryTime"
              value={form.deliveryTime}
              onChange={handleChange}
              className={`${inputClass("deliveryTime")} cursor-pointer`}
            >
              <option value="">Выберите время</option>
              <option value="09:00-12:00">09:00 – 12:00</option>
              <option value="12:00-15:00">12:00 – 15:00</option>
              <option value="15:00-18:00">15:00 – 18:00</option>
              <option value="18:00-21:00">18:00 – 21:00</option>
            </select>
            {errors.deliveryTime && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryTime}</p>
            )}
          </div>
        </div>

        {/* Текст на открытке */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Текст на открытке
            <span className="text-stone-400 font-normal ml-2">(макс. 120 символов)</span>
          </label>
          <textarea
            name="cardMessage"
            placeholder="Поздравляю с днём рождения! Желаю..."
            value={form.cardMessage}
            onChange={(e) => {
              if (e.target.value.length <= 120) handleChange(e);
            }}
            rows={2}
            className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800 resize-none"
          />
          <p className={`text-xs mt-1 text-right ${
            form.cardMessage.length > 100 ? "text-rose-500 font-semibold" : "text-stone-400"
          }`}>
            {form.cardMessage.length}/120
          </p>
        </div>

        {/* Комментарий */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Комментарий
          </label>
          <textarea
            name="comment"
            placeholder="Пожелания к оформлению, домофон, этаж..."
            value={form.comment}
            onChange={handleChange}
            rows={2}
            className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800 resize-none"
          />
        </div>

        {/* Состав заказа */}
        <div className="bg-rose-50 rounded-xl p-4 text-sm text-stone-600 space-y-1">
          <p className="font-bold text-stone-700 mb-2">Состав заказа:</p>
          {items.length === 0 ? (
            <p className="text-stone-400">Корзина пуста</p>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name} × {quantity}</span>
                <span>{(product.price * quantity).toLocaleString("ru-RU")} ₸</span>
              </div>
            ))
          )}
          <div className="border-t border-rose-200 pt-2 flex justify-between font-bold text-stone-800">
            <span>Итого</span>
            <span className="text-rose-600">{total.toLocaleString("ru-RU")} ₸</span>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || items.length === 0}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Оформляем...</>
          ) : (
            "Подтвердить заказ"
          )}
        </button>
      </div>
    </div>
  );
}