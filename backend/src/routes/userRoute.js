const express = require("express");
const router = express.Router();

const {
  listUsers,
  updateUserRole,
} = require("../controllers/userController");


// ADMIN ROUTES(NOTE: Add admin auth middleware here when available, e.g. `isAdmin`)

// Users
router.get("/", listUsers);
router.patch("/:id/role", updateUserRole);

module.exports = router;