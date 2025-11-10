const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

// Admin dashboard
const { generateReport,getDashboardReport } = require("../controllers/dashboardController");

// GET today's report (or compute+save if missing)
router.get("/", verifyToken, getDashboardReport);

// POST /generate -> body: { date: 'YYYY-MM-DD' } or { all: true }
router.post('/generate', verifyToken, generateReport);

module.exports = router;
