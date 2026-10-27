import type { User } from "./User";

export interface Order {
  _id: string;
  user: User;
  delivery_address: string;
  phone_number: string;
  note?: string;
  total_price: number;
  shipping_fee: number;
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  payment_status: "unpaid" | "paid";
  createdAt: string;
  updatedAt?: string;
}
