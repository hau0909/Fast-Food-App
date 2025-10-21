const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const filterMiddleware = require("../middlewares/filterProduct");
const sortMiddleware = require("../middlewares/sortProduct");
const pagingMiddleware = require("../middlewares/pagingProduct");

router.get(
  "/",
  filterMiddleware,
  sortMiddleware,
  pagingMiddleware,
  getAllProducts
);

router.get("/:id", getProductById);

module.exports = router;
