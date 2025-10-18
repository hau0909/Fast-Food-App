const express = require("express");
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
router.patch("/:id/approve", approveReview);
router.patch("/:id/hide", hideReview);
router.delete("/:id", deleteReview);

module.exports = router;
