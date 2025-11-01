const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const filterMiddleware = require("../middlewares/filterProduct");
const sortMiddleware = require("../middlewares/sortProduct");
const pagingMiddleware = require("../middlewares/pagingProduct");
const { verifyToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get(
  "/",
  verifyToken,
  filterMiddleware,
  sortMiddleware,
  pagingMiddleware,
  getAllProducts
);

router.route('/').get(verifyToken, getAllProducts);
router.route('/').post(verifyToken, upload.single("image"), createProduct);

router.get("/:id", verifyToken, getProductById);

router.route('/:id')
  .patch(verifyToken, upload.single("image"), updateProduct)
  .delete(verifyToken, deleteProduct);

module.exports = router;
