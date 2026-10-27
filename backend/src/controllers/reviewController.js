const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product"); // for populating product name

/**
 * Admin controllers section:
 * - view / approve / hide / delete reviews
 */

// Get reviews: xem đánh giá
const getReviews = async (req, res, next) => {
  try {
    // Optional query params: ?approved=true/false(lọc đánh giá đã duyệt/chưa duyệt)
    const filter = {};
    if (req.query.approved === "true") filter.is_approved = true;
    if (req.query.approved === "false") filter.is_approved = false;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate("user_id", "username email")
      .populate("product_id", "name");

    return res.json({ success: true, data: reviews });
  } catch (err) {
    return next(err);
  }
};

// Approve review: duyệt đánh giá
const approveReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { is_approved: true },
      { new: true }
    );
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    return res.json({ success: true, data: review });
  } catch (err) {
    return next(err);
  }
};

// Hide review: ẩn đánh giá
const hideReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { is_approved: false },
      { new: true }
    );
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    return res.json({ success: true, data: review });
  } catch (err) {
    return next(err);
  }
};

// Delete review: xóa đánh giá
const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    return res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    return next(err);
  }
};

/**
 * END Admin controllers section
 */

module.exports = {
  getReviews,
  approveReview,
  hideReview,
  deleteReview,
};
