"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface FormData {
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
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

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<FormData>({
    customerName: "",
    phone: "",
    address: "",
    deliveryDate: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      !form.deliveryDate
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

      setSuccess(data.orderId);
      clearCart();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ошибка оформления заказа";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="font-playfair text-3xl font-bold text-stone-800 mb-2">
          Заказ оформлен!
        </h2>
        <p className="text-stone-500 mb-2">
          Номер заказа: <strong className="text-stone-700">#{success}</strong>
        </p>
        <p className="text-stone-500 mb-8">
          Мы свяжемся с вами для подтверждения.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-rose-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
        >
          На главную
        </button>
      </div>
    );
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
