import { Category } from "./Category";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null; // Có thể không có khuyến mãi
  image_url: string;
  // category_id có thể là string (ID) hoặc là một đối tượng Category đầy đủ khi populate
  category_id: string | Category;
  is_available: boolean;
  calories?: number; // Optional
  createdAt: string;
  updatedAt: string;
}
