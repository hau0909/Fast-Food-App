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
const { verifyToken, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// ADMIN ROUTES - require admin role
router.get(
  "/",
  verifyToken,
  isAdmin,
  filterMiddleware,
  sortMiddleware,
  pagingMiddleware,
  getAllProducts
);

router.route('/').get(verifyToken, isAdmin, getAllProducts);
router.route('/').post(verifyToken, isAdmin, upload.single("image"), createProduct);

router.get("/:id", verifyToken, isAdmin, getProductById);

router.route('/:id')
  .patch(verifyToken, isAdmin, upload.single("image"), updateProduct)
  .delete(verifyToken, isAdmin, deleteProduct);

module.exports = router;

