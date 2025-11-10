const DashboardStats = require("../models/DashboardStats");
const User = require("../models/User");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

// normalize a Date to UTC start-of-day (00:00:00)
const startOfDay = (d) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

// POST /api/admin/dashboard/generate
// body: { date: 'YYYY-MM-DD' } or { all: true }
// Generates report for a date or for all dates present in orders.
const generateReport = async (req, res, next) => {
  try {
    const requesterId = req.userId;
    if (!requesterId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const requester = await User.findById(requesterId).select('role');
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { date, all } = req.body || {};

    if (all) {
      // get unique dates from orders (YYYY-MM-DD)
      const datesAgg = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const dateKeys = datesAgg.map((d) => d._id);
      const results = [];
      // compute sequentially to avoid overwhelming DB
      for (const d of dateKeys) {
        const saved = await computeAndSaveReport(new Date(d));
        results.push({ date: d, id: saved._id });
      }
      return res.json({ success: true, count: results.length, results });
    }

    if (date) {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) return res.status(400).json({ success: false, message: 'Invalid date' });
      const saved = await computeAndSaveReport(parsed);
      return res.json({ success: true, data: saved });
    }

    return res.status(400).json({ success: false, message: 'Provide { date } or { all: true } in body' });
  } catch (err) {
    return next(err);
  }
};

// exports are declared at the end of the file after all functions are defined

// computeAndSaveReport(reportDate)
// Compute and upsert daily totals for the UTC day: total_users, total_orders,
// total_revenue (paid only) and top_products (paid only by default).
const computeAndSaveReport = async (reportDate = new Date()) => {
  const date = typeof reportDate === 'string' ? new Date(reportDate) : reportDate;
  const start = startOfDay(date);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  // total orders for the day
  const total_orders = await Order.countDocuments({ createdAt: { $gte: start, $lt: end } });

  // distinct users who placed orders that day
  const userIds = await Order.distinct('user_id', { createdAt: { $gte: start, $lt: end } });
  const total_users = userIds ? userIds.length : 0;

  // total revenue from paid orders that day
  const revenueAgg = await Order.aggregate([
    { $match: { payment_status: 'paid', createdAt: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: '$total_price' } } },
  ]);
  const total_revenue = revenueAgg.length ? revenueAgg[0].total : 0;

  // top products sold that day (from OrderItem, joined to Order to filter by date & payment)
  const topProductsAgg = await OrderItem.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'order_id',
        foreignField: '_id',
        as: 'order',
      },
    },
    { $unwind: '$order' },
    { $match: { 'order.createdAt': { $gte: start, $lt: end }, 'order.payment_status': 'paid' } },
    { $group: { _id: '$product_id', total_sold: { $sum: '$quantity' } } },
    { $sort: { total_sold: -1 } },
    { $limit: 5 },
  ]);

  const top_products = await Promise.all(
    topProductsAgg.map(async (p) => {
      const prod = await Product.findById(p._id, 'name');
      return { product_id: p._id, name: prod ? prod.name : 'Unknown', total_sold: p.total_sold };
    })
  );

  const doc = {
    total_users,
    total_orders,
    total_revenue,
    top_products,
    report_date: start,
  };

  // Upsert by normalized day
  try {
    const saved = await DashboardStats.findOneAndUpdate(
      { report_date: start },
      { $set: doc },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return saved;
  } catch (err) {
    // handle race duplicate-key by returning existing doc
    if (err && err.code === 11000) {
      return await DashboardStats.findOne({ report_date: start });
    }
    throw err;
  }
};

// GET /api/admin/dashboard
// Return today's report (upsert if missing). Admin only. Use ?force=true to recompute.
const getDashboardReport = async (req, res, next) => {
  try {
    // verifyToken middleware should set req.userId
    const requesterId = req.userId;
    if (!requesterId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // confirm requester is admin (fetch from DB to be safe)
    const requester = await User.findById(requesterId).select("role");
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // target the previous UTC day (yesterday)
    const yesterdayStart = startOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const yesterdayEnd = new Date(yesterdayStart.getTime() + 24 * 60 * 60 * 1000);

    const existing = await DashboardStats.findOne({ report_date: { $gte: yesterdayStart, $lt: yesterdayEnd } });

    // allow forcing a fresh compute via query ?force=true
    const force = req.query && req.query.force === 'true';
    if (existing && !force) return res.json({ success: true, data: existing });

    // Compute and persist yesterday's report now (missing or forced)
    const saved = await computeAndSaveReport(yesterdayStart);
    return res.json({ success: true, data: saved });
  } catch (err) {
    return next(err);
  }
};


module.exports = {
  getDashboardReport,
  computeAndSaveReport,
  generateReport,
};
