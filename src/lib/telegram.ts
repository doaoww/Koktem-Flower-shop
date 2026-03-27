// lib/telegram.ts
import { Order } from "@/types";

export async function sendOrderToTelegram(order: Order): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram env vars not set, skipping notification");
    return;
  }

  const itemsList = order.items
    .map((i) => `  • ${i.product.name} × ${i.quantity} — ${(i.product.price * i.quantity).toLocaleString("ru-RU")} ₸`)
    .join("\n");

  const message = `
🌸 *НОВЫЙ ЗАКАЗ #${order.id}*

👤 *Клиент:* ${order.customerName}
📞 *Телефон:* ${order.phone}
📍 *Адрес:* ${order.address}
📅 *Дата доставки:* ${order.deliveryDate}
${order.comment ? `💬 *Комментарий:* ${order.comment}` : ""}

🛒 *Состав заказа:*
${itemsList}

💰 *Итого: ${order.total.toLocaleString("ru-RU")} ₸*
🕐 *Время заказа:* ${new Date(order.createdAt).toLocaleString("ru-RU")}
  `.trim();

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Telegram send failed:", err);
  }
}