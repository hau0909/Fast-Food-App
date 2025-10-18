// Định nghĩa cấu trúc cho một sản phẩm trong danh sách top
export interface TopProductStat {
  product_id: string;
  name: string;
  total_sold: number;
}

// Định nghĩa cho toàn bộ dữ liệu thống kê
export interface DashboardStats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  top_products: TopProductStat[];
  report_date: string;
}
