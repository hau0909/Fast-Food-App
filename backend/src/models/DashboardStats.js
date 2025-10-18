const mongoose = require("mongoose");

const TopProductSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  total_sold: { type: Number, required: true },
});

const DashboardStatsSchema = new mongoose.Schema({
  total_users: { type: Number, required: true, default: 0 },
  total_orders: { type: Number, required: true, default: 0 },
  total_revenue: { type: Number, required: true, default: 0 },
  top_products: [TopProductSchema],
  report_date: { type: Date, required: true, unique: true }, // Đảm bảo mỗi ngày chỉ có 1 báo cáo
});

module.exports = mongoose.model("DashboardStats", DashboardStatsSchema);
