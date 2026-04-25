export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "bouquets" | "single" | "plants" | "gift";
  occasion: Occasion[];
  inStock: boolean;
  popular: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  comment?: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

export type Category = "all" | "bouquets" | "single" | "plants" | "gift";

export const CATEGORY_LABELS: Record<string, string> = {
  all: "Все",
  bouquets: "Букеты",
  single: "Цветы поштучно",
  plants: "Растения",
  gift: "Подарки",
};

export type Occasion = "all" | "birthday" | "date" | "sorry" | "mom" | "wedding";

export const OCCASION_LABELS: Record<Occasion, string> = {
  all: "Все поводы",
  birthday: "День рождения",
  date: "Свидание",
  sorry: "Извини",
  mom: "Маме",
  wedding: "Свадьба",
};