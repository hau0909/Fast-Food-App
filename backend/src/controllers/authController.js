const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// [POST] /api/register
const register = async (req, res, next) => {
  try {
    const { email, password, address, phoneNumber, fullName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email is alredy use");
      error.status = 401;
      throw error;
    }

    const newUser = await User.create({
      username: "~",
      email: email,
      password: hashedPassword,
      address: address,
      phone_number: phoneNumber,
      full_name: fullName,
      role: "user",
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      user_id: user._id,
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
