import { User } from "./User";

export interface Cart {
  _id: string;
  user: User; // đã populate user_id
  createdAt?: string;
  updatedAt?: string;
}
