import { Order } from "./Order";
import type { Product } from "./Product";

export interface OrderItem {
  _id: string;
  order: Order | string; // populate hay không tuỳ API
  product: Product | string;
  quantity: number;
  price: number;
}
