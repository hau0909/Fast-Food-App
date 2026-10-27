const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/auth");

// Admin dashboard
const { generateReport,getDashboardReport } = require("../controllers/dashboardController");

// ADMIN ROUTES - require admin role
// GET today's report (or compute+save if missing)
router.get("/", verifyToken, isAdmin, getDashboardReport);

// POST /generate -> body: { date: 'YYYY-MM-DD' } or { all: true }
router.post('/generate', verifyToken, isAdmin, generateReport);

module.exports = router;
