const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Middleware to verify admin role
// Must be used after verifyToken middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user from database to ensure role is current
    const user = await User.findById(req.userId).select("role");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    // Set userRole from database (more reliable than token)
    req.userRole = user.role;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Error verifying admin role" });
  }
};
