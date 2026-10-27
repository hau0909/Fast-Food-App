import { CartItem } from "./CartItem";
import { User } from "./User";

export interface Cart {
  _id: string;
  user: User; // đã populate user_id
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
