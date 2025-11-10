const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userOrderController");
const { verifyToken } = require("../middlewares/auth");

router
  .route("/")
  .get(verifyToken, ctrl.getUserOrders)
  .post(verifyToken, ctrl.createOrder);

router
  .route("/:id")
  .get(verifyToken, ctrl.getOrderById)
  .put(verifyToken, ctrl.cancelOrder);

module.exports = router;
