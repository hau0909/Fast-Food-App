export interface TopProduct {
  product: string; // hoặc Product nếu populate
  name: string;
  total_sold: number;
}

export interface DashboardStats {
  _id: string;
  total_users: number;
  total_orders: number;
  total_revenue: number;
  top_products: TopProduct[];
  report_date: string;
}
