const User = require("../models/User");

/**
 * Admin controllers section:
 * - view user list
 * - update user role
 */

// List users: xem danh sách người dùng
const listUsers = async (req, res, next) => {
  try {
    // exclude password field
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return res.json({ success: true, data: users });
  } catch (err) {
    return next(err);
  }
};

// Update user role: cập nhật vai trò người dùng (user/admin)
const updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, fields: "-password" }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

/**
 * END Admin controllers section
 */

module.exports = {
  listUsers,
  updateUserRole,
};
