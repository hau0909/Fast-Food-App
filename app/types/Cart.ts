import { Product } from "./Product";

// Định nghĩa cho một món hàng trong giỏ
export interface CartItem {
  _id: string;
  cart_id: string;
  // Khi lấy thông tin giỏ hàng, product_id thường sẽ được populate
  product_id: Product;
  quantity: number;
}

// Định nghĩa cho đối tượng giỏ hàng hoàn chỉnh
export interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[]; // API trả về sẽ thường có cấu trúc này
  createdAt: string;
  updatedAt: string;
}
