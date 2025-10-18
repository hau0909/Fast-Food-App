const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    // Mỗi user chỉ có 1 giỏ hàng
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
