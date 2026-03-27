// lib/products.ts
import productsData from "@/data/products.json";
import { Product, Category } from "@/types";

const products: Product[] = productsData as Product[];

export async function getProducts(category?: Category): Promise<Product[]> {
  // Имитация задержки запроса к БД
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return products.find((p) => p.id === id) ?? null;
}
