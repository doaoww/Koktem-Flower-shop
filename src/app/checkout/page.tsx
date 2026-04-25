"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  min?: string;
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
    deliveryDate: "",
    deliveryTime: "",
    cardMessage: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Автозаполнение данных из профиля
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (
      !form.customerName ||
      !form.phone ||
      !form.address ||
      !form.deliveryDate ||
      !form.deliveryTime
    ) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
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

      // Очищаем корзину и перенаправляем на страницу заказа
      clearCart();
      router.push(`/order/${data.orderId}`);
      
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ошибка оформления заказа";
      setError(message);
      setLoading(false);
    }
  }

  const fields: Field[] = [
    {
      name: "customerName",
      label: "Ваше имя *",
      type: "text",
      placeholder: "Имя Фамилия",
    },
    {
      name: "phone",
      label: "Телефон *",
      type: "tel",
      placeholder: "+7 (777) 000-00-00",
    },
    {
      name: "address",
      label: "Адрес доставки *",
      type: "text",
      placeholder: "Город, улица, дом",
    },
    {
      name: "deliveryDate",
      label: "Дата доставки *",
      type: "date",
      placeholder: "",
      min: today,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold text-stone-800 mb-8">
        Оформление заказа
      </h1>

      {session && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700">
          ✓ Данные автоматически загружены из вашего профиля
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-rose-50 space-y-5">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-stone-600 mb-1">
              {f.label}
            </label>
            <input
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              min={f.min ?? ""}
              value={form[f.name as keyof FormData]}
              onChange={handleChange}
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Комментарий
          </label>
          <textarea
            name="comment"
            placeholder="Пожелания к букету, удобное время..."
            value={form.comment}
            onChange={handleChange}
            rows={3}
            className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800 resize-none"
          />
        </div>

        {/* Время доставки */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Время доставки *
          </label>
          <select
            name="deliveryTime"
            value={form.deliveryTime}
            onChange={(e) => setForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
            className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800 bg-white"
          >
            <option value="">Выберите время</option>
            <option value="09:00-12:00">09:00 – 12:00</option>
            <option value="12:00-15:00">12:00 – 15:00</option>
            <option value="15:00-18:00">15:00 – 18:00</option>
            <option value="18:00-21:00">18:00 – 21:00</option>
          </select>
        </div>

        {/* Текст на открытке */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-1">
            Текст на открытке
            <span className="text-stone-400 font-normal ml-2">
              (макс. 120 символов)
            </span>
          </label>
          <textarea
            name="cardMessage"
            placeholder="Поздравляю с днём рождения! Желаю..."
            value={form.cardMessage}
            onChange={(e) => {
              if (e.target.value.length <= 120) {
                setForm(prev => ({ ...prev, cardMessage: e.target.value }));
              }
            }}
            rows={3}
            className="w-full border border-rose-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-300 text-stone-800 resize-none"
          />
          <p className={`text-xs mt-1 text-right ${
            form.cardMessage.length > 100 ? "text-rose-500" : "text-stone-400"
          }`}>
            {form.cardMessage.length}/120
          </p>
        </div>

        <div className="bg-rose-50 rounded-xl p-4 text-sm text-stone-600 space-y-1">
          <p className="font-bold text-stone-700 mb-2">Состав заказа:</p>
          {items.length === 0 ? (
            <p className="text-stone-400">Корзина пуста</p>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between">
                <span>
                  {product.name} × {quantity}
                </span>
                <span>
                  {(product.price * quantity).toLocaleString("ru-RU")} ₸
                </span>
              </div>
            ))
          )}
          <div className="border-t border-rose-200 pt-2 flex justify-between font-bold text-stone-800">
            <span>Итого</span>
            <span className="text-rose-600">
              {total.toLocaleString("ru-RU")} ₸
            </span>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || items.length === 0}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Оформляем...
            </>
          ) : (
            "Подтвердить заказ"
          )}
        </button>
      </div>
    </div>
  );
}