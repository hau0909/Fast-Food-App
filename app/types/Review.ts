import { User } from "./User";

export interface Review {
  _id: string;
  // user_id và product_id thường là ID
  user_id: string | User; // Có thể populate để lấy tên và avatar người dùng
  product_id: string;
  rating: number; // 1 to 5
  comment?: string;
  is_approved: boolean;
  createdAt: string;
  updatedAt: string;
}
