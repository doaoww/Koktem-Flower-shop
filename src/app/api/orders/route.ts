import { NextRequest, NextResponse } from "next/server";
import { sendOrderToTelegram } from "@/lib/telegram";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shortId = randomUUID().slice(0, 8).toUpperCase();

    const order = await prisma.order.create({
      data: {
        shortId,
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        deliveryDate: body.deliveryDate,
        deliveryTime: body.deliveryTime ?? "",
        cardMessage: body.cardMessage ?? "",
        comment: body.comment ?? "",
        items: body.items,
        total: body.total,
        status: "PENDING",
      },
    });

    await sendOrderToTelegram({
  id: shortId,
  customerName: order.customerName,
  phone: order.phone,
  address: order.address,
  deliveryDate: order.deliveryDate,
  comment: order.comment ?? undefined,  // преобразуем null в undefined для опционального поля
  items: body.items,
  total: order.total,
  createdAt: order.createdAt.toISOString(), // преобразуем Date в строку
});

    return NextResponse.json({ success: true, orderId: shortId });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Ошибка оформления заказа" },
      { status: 500 }
    );
  }
}