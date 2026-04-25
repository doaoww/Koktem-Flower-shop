"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Clock } from "lucide-react";

const STATUSES = [
  { key: "PENDING",    label: "Заказ принят",      icon: Clock,        color: "text-yellow-500" },
  { key: "PREPARING",  label: "Собираем букет",     icon: Package,      color: "text-blue-500"   },
  { key: "DELIVERING", label: "Курьер в пути",      icon: Truck,        color: "text-orange-500" },
  { key: "DELIVERED",  label: "Доставлено!",        icon: CheckCircle2, color: "text-green-500"  },
];

export default function OrderStatusPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchOrder() {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) setOrder(await res.json());
      setLoading(false);
    }
    fetchOrder();
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mx-auto" />
    </div>
  );

  if (!order) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-stone-500">Заказ не найден</p>
    </div>
  );

  const currentIndex = STATUSES.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-2">
        Заказ #{order.shortId}
      </h1>
      <p className="text-stone-500 mb-8">
        {order.customerName} · {order.phone}
      </p>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 mb-6">
        <div className="space-y-4">
          {STATUSES.map((s, i) => {
            const Icon = s.icon;
            const done = i <= currentIndex;
            const active = i === currentIndex;
            return (
              <div key={s.key} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  done ? "bg-rose-100" : "bg-stone-100"
                }`}>
                  <Icon className={`w-5 h-5 ${done ? s.color : "text-stone-300"}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${active ? "text-stone-800" : done ? "text-stone-600" : "text-stone-300"}`}>
                    {s.label}
                  </p>
                  {active && (
                    <p className="text-xs text-rose-400 mt-0.5">Текущий статус</p>
                  )}
                </div>
                {done && !active && (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
        <h2 className="font-semibold text-stone-700 mb-3">Детали заказа</h2>
        <div className="space-y-1 text-sm text-stone-600">
          <p>📍 {order.address}</p>
          <p>📅 {order.deliveryDate} {order.deliveryTime && `· ${order.deliveryTime}`}</p>
          <p className="font-bold text-rose-600 text-base mt-2">
            Итого: {Number(order.total).toLocaleString("ru-RU")} ₸
          </p>
        </div>
      </div>
    </div>
  );
}