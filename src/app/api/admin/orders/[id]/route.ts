import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Простая защита — секретный ключ в заголовке
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["PENDING", "PREPARING", "DELIVERING", "DELIVERED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { shortId: id },
    data: { status },
  });

  return NextResponse.json(order);
}