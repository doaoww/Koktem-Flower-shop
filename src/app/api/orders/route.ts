import { NextRequest, NextResponse } from "next/server";
import { sendOrderToTelegram } from "@/lib/telegram";
import { Order } from "@/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const order: Order = {
      id: randomUUID().slice(0, 8).toUpperCase(),
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      deliveryDate: body.deliveryDate,
      comment: body.comment ?? "",
      items: body.items,
      total: body.total,
      createdAt: new Date().toISOString(),
    };

    await sendOrderToTelegram(order);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch {
    return NextResponse.json(
      { error: "Ошибка оформления заказа" },
      { status: 500 }
    );
  }
}