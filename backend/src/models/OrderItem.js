const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  // Lưu lại giá tại thời điểm đặt hàng để tránh ảnh hưởng khi giá sản phẩm thay đổi
  price: { type: Number, required: true },
});

module.exports = mongoose.model("OrderItem", OrderItemSchema);
