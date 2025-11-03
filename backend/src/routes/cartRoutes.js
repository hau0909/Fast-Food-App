const express = require("express");
const router = express.Router();

const {} = require("../controllers/productController");

const { verifyToken } = require("../middlewares/auth");
const {
  getUserCart,
  updateCartItemQuantity,
  deleteCartItem,
  addItemToCart,
} = require("../controllers/cartController");

router.get("/", verifyToken, getUserCart);

router.put("/items/:itemId", verifyToken, updateCartItemQuantity);

router.post("/items", verifyToken, addItemToCart);

router.delete("/items/:itemId", verifyToken, deleteCartItem);

module.exports = router;
