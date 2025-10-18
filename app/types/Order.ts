import { Product } from "./Product";

// Định nghĩa cho một món hàng trong đơn hàng
export interface OrderItem {
  _id: string;
  order_id: string;
  // product_id cũng sẽ được populate để hiển thị thông tin
  product_id: Product;
  quantity: number;
  price: number; // Giá tại thời điểm đặt hàng
}

// Định nghĩa cho đối tượng đơn hàng
export interface Order {
  _id: string;
  user_id: string;
  delivery_address: string;
  phone_number: string;
  note?: string;
  total_price: number;
  shipping_fee: number;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  payment_status: "unpaid" | "paid";
  createdAt: string;
  updatedAt: string;

  // Khi lấy chi tiết một đơn hàng, ta sẽ muốn có cả items
  items?: OrderItem[];
}
