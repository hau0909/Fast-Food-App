const express = require("express");
const path = require("path");
const connectDB = require("./src/config/db");
const cors = require("cors");
const categoryRoutes = require('./src/routes/categoryRoutes') 
const productRoutes = require('./src/routes/productRoutes')
const orderRoutes = require('./src/routes/orderRoutes')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET","POST","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};


async function start() {
  try {
    await connectDB();

    app.use(cors(corsOptions));

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Admin routes (mount)
    app.use("/api/admin/reviews", require("./src/routes/reviewRoute"));
    app.use("/api/admin/users", require("./src/routes/userRoute"));
    app.use('/api/admin/categories', categoryRoutes);
    app.use('/api/admin/products', productRoutes);
    app.use('/api/admin/orders', orderRoutes);

    //* User routes

    // product route
    app.use("/api/products", require("./src/routes/productRoutes"));

    //* Auth routes
    app.use("/api/auth", require("./src/routes/authRoutes"));

    // handle error middleware
    app.use(require("./src/middlewares/errorHandler"));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot start server, Error: ", error);
    process.exit(1);
  }
}

start();
