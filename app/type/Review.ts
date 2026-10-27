import type { User } from "./User";
import type { Product } from "./Product";

export interface Review {
  _id: string;
  user: User;
  product: Product;
  rating: number;
  comment?: string;
  is_approved: boolean;
  createdAt?: string;
  updatedAt?: string;
}
