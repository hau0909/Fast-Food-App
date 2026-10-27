import { Order } from "./Order";

export interface OrderItem {
  _id: string;
  order_id: string; // populate hay không tuỳ API
  product_id: string;
  quantity: number;
  price: number;
}
