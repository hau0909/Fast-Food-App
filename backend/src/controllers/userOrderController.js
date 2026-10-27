const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

// [POST] /api/orders
const createOrder = async (req, res) => {
  try {
    const { delivery_address, phone_number, note, items, shipping_fee } =
      req.body;

    if (!req.userId)
      return res.status(400).json({ message: "Missing user ID from token" });

    if (!delivery_address || !phone_number)
      return res
        .status(400)
        .json({ message: "Delivery address and phone number are required" });

    if (!Array.isArray(items) || items.length === 0)
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });

    let totalProductPrice = 0;
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.price)
        return res.status(400).json({
          message: "Each item must include product_id, quantity, and price",
        });
      totalProductPrice += item.price * item.quantity;
    }

    const total_price = totalProductPrice + (shipping_fee || 0);

    const newOrder = await Order.create({
      user_id: req.userId,
      delivery_address,
      phone_number,
      note: note || "",
      total_price,
      shipping_fee: shipping_fee || 0,
      status: "pending",
      payment_status: "unpaid",
    });

    const orderItems = items.map((item) => ({
      order_id: newOrder._id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.insertMany(orderItems);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      items: orderItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// [GET] /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Error getting order" });
  }
};

// [GET] /api/orders
const getUserOrders = async (req, res) => {
  try {
    // Sắp xếp theo createdAt giảm dần (mới nhất lên đầu)
    const orders = await Order.find({ user_id: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found or access denied" });
    }

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id }).lean();
        return { ...order, items: items };
      })
    );

    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({ message: "Error getting user orders" });
  }
};

// [PUT] /api/orders/:id/
const cancelOrder = async (req, res) => {
  try {
    // Bước 1: Tìm đơn hàng của user dựa vào ID đơn hàng và ID user để đảm bảo bảo mật
    const order = await Order.findOne({
      _id: req.params.id,
      user_id: req.userId, // Sửa 'userId' thành 'user_id' cho khớp với Schema
    });

    // Bước 2: Kiểm tra xem đơn hàng có tồn tại không
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied" });
    }

    // Bước 3: Kiểm tra xem đơn hàng đã ở trạng thái không thể hủy (vd: đã hủy, đã hoàn thành)
    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Cannot cancel order with status: '${order.status}'`,
      });
    }

    // Bước 4: Cập nhật trạng thái
    order.status = "cancelled";

    // Bước 5: Lưu lại thay đổi vào database
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Error cancelling order" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  cancelOrder,
};
