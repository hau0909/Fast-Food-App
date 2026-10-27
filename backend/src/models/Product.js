const mongoose = require("mongoose");
require("./Category");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount_price: { type: Number, default: null },
    image_url: { type: String, required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    is_available: { type: Boolean, default: true },
    calories: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
