const express = require("express");
const { verifyToken, isAdmin } = require('../middlewares/auth');
const router = express.Router();

const {
  listUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");


// ADMIN ROUTES - require admin role

// Users
router.get("/", verifyToken, isAdmin, listUsers);
router.patch("/:id/role", verifyToken, isAdmin, updateUserRole);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
