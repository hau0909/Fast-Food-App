const express = require("express");
const { verifyToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

const {
  getReviews,
  approveReview,
  hideReview,
  deleteReview,
} = require("../controllers/reviewController");

// Reviews
// optional query: ?approved=true|false
router.get("/", verifyToken, isAdmin, getReviews);

// ADMIN ROUTES - require admin role
router.patch("/:id/approve", verifyToken, isAdmin, approveReview);
router.patch("/:id/hide", verifyToken, isAdmin, hideReview);
router.delete("/:id", verifyToken, isAdmin, deleteReview);

module.exports = router;
