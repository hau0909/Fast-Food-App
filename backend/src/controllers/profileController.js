const User = require("../models/User");

// Get user by ID: xem chi tiết người dùng
const getUserById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId, "-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // chỉ cho phép cập nhật 3 field cụ thể
    const { full_name, phone_number, address } = req.body;

    const userUpdated = await User.findByIdAndUpdate(
      req.userId, // lấy từ middleware auth
      { full_name, phone_number, address },
      {
        new: true,
        runValidators: true,
        fields: "-password", // loại bỏ password khỏi kết quả trả về
      }
    );

    if (!userUpdated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUserById,
  updateUserProfile,
};
