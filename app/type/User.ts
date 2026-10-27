export interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  avatar_url?: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}
