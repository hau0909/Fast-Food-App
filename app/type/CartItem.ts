import type { Cart } from "./Cart";
import type { Product } from "./Product";

export interface CartItem {
  _id: string;
  cart: Cart | string; // populate từ cart_id
  product: Product | string; // populate từ product_id
  quantity: number;
}
