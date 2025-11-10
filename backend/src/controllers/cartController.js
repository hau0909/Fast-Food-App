const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");

// [GET] /api/carts/:userId
const getUserCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user_id: userId }).populate({
      path: "user_id",
      select: "full_name email",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = await CartItem.find({ cart_id: cart._id })
      .populate("product_id")
      .lean();

    return res.json({
      _id: cart._id,
      user: cart.user_id,
      items: cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        product: item.product_id,
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] /api/carts/items/:itemId
const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId; // 1. Lấy ID của người dùng đã đăng nhập (từ token)

    // Kiểm tra đầu vào
    if (!quantity || Number(quantity) <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    // 2. Tìm giỏ hàng của chính người dùng này
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      // User này chưa có giỏ hàng, nên không thể có item nào để sửa
      return res.status(404).json({ message: "Cart not found" });
    }

    // 3. Tìm và cập nhật item VỚI ĐIỀU KIỆN item đó phải thuộc giỏ hàng của user
    const updatedItem = await CartItem.findOneAndUpdate(
      { _id: itemId, cart_id: cart._id }, // <-- Chìa khóa bảo mật nằm ở đây!
      { quantity: Number(quantity) },
      { new: true }
    ).populate("product_id");

    // Nếu không tìm thấy item nào khớp (vì itemId sai hoặc không thuộc giỏ của user)
    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Cart item not found in your cart" });
    }

    return res.json({
      message: "Item quantity updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    next(err);
  }
};

// [DELETE] /api/carts/items/:itemId
const deleteCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.userId; // 1. Lấy ID của người dùng đã đăng nhập

    // 2. Tìm giỏ hàng của chính người dùng này
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 3. Tìm và xóa item VỚI ĐIỀU KIỆN item đó phải thuộc giỏ hàng của user
    const deletedItem = await CartItem.findOneAndDelete({
      _id: itemId,
      cart_id: cart._id, // <-- Chìa khóa bảo mật nằm ở đây!
    });

    // Nếu không tìm thấy item nào khớp để xóa
    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Cart item not found in your cart" });
    }

    return res.json({ message: "Item removed from cart successfully" });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/carts/items
const addItemToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.userId;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!product_id || !quantity || Number(quantity) <= 0) {
      return res
        .status(400)
        .json({ message: "Product ID and a valid quantity are required" });
    }

    // 2. Tìm giỏ hàng của user. Nếu không có, tạo mới.
    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({ user_id: userId });
      await cart.save();
    }

    // 3. Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({
      cart_id: cart._id,
      product_id: product_id,
    });

    if (cartItem) {
      // Nếu đã tồn tại, chỉ cần cập nhật số lượng
      cartItem.quantity += Number(quantity);
    } else {
      // Nếu chưa tồn tại, tạo một CartItem mới
      cartItem = new CartItem({
        cart_id: cart._id,
        product_id: product_id,
        quantity: Number(quantity),
      });
    }

    // 4. Lưu lại item (dù là mới hay đã cập nhật)
    await cartItem.save();

    // Populate thông tin sản phẩm để trả về cho client
    await cartItem.populate("product_id");

    // 5. Trả về phản hồi thành công
    return res.status(200).json({
      message: "Item added to cart successfully",
      item: cartItem,
    });
  } catch (err) {
    next(err);
  }
};

// [DELETE] /api/carts/clear
const clearCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await CartItem.deleteMany({ cart_id: cart._id });

    return res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  clearCart,
  getUserCart,
  deleteCartItem,
  updateCartItemQuantity,
  addItemToCart,
};
