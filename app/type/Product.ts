import type { Category } from "./Category";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  category: Category | string; // đã populate từ category_id
  is_available: boolean;
  createdAt?: string;
  updatedAt?: string;
}
