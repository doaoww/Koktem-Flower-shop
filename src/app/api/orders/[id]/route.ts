import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { shortId: id },
  });
  if (!order) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }
  return NextResponse.json(order);
}