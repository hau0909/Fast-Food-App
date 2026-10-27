const express = require("express");
const { register, login } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyToken, (req, res) => {
  res.json({ valid: true, userId: req.userId, role: req.userRole });
});

module.exports = router;
