const express = require("express");
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

const { listUsers, updateUserRole } = require("../controllers/userController");

// ADMIN ROUTES(NOTE: Add admin auth middleware here when available, e.g. `isAdmin`)

// Users
router.get("/",verifyToken, listUsers);
router.patch("/:id/role",verifyToken, updateUserRole);

module.exports = router;
