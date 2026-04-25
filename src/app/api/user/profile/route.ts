import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone: body.phone,
      address: body.address,
      name: body.name,
    },
  });
  return NextResponse.json(user);
}