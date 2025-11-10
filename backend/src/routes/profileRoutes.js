const express = require("express");
const router = express.Router();

const {
  getUserById,
  updateUserProfile,
} = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, getUserById);
router.put("/", verifyToken, updateUserProfile);

module.exports = router;
