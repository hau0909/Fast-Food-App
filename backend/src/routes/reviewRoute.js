const express = require("express");
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

const {
  getReviews,
  approveReview,
  hideReview,
  deleteReview,
} = require("../controllers/reviewController");

// Reviews
// optional query: ?approved=true|false
router.get("/", getReviews);

// ADMIN ROUTES(NOTE: Add admin auth middleware here when available, e.g. `isAdmin`)
router.patch("/:id/approve",verifyToken, approveReview);
router.patch("/:id/hide",verifyToken, hideReview);
router.delete("/:id",verifyToken, deleteReview);

module.exports = router;
