const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const filterMiddleware = require("../middlewares/filterProduct");
const sortMiddleware = require("../middlewares/sortProduct");
const pagingMiddleware = require("../middlewares/pagingProduct");
const { verifyToken } = require("../middlewares/auth");

// USER ROUTES - only require authentication (no admin role needed)
router.get(
  "/",
  verifyToken,
  filterMiddleware,
  sortMiddleware,
  pagingMiddleware,
  getAllProducts
);

router.get("/:id", verifyToken, getProductById);

module.exports = router;
