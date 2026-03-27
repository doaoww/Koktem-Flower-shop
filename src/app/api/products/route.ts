import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { Category } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = (searchParams.get("category") ?? "all") as Category;
    const products = await getProducts(category);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Ошибка загрузки товаров" },
      { status: 500 }
    );
  }
}