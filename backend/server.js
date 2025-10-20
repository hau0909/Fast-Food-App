const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await connectDB();

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    // Admin routes (mount)
    app.use("/api/admin/reviews", require("./src/routes/reviewRoute"));
    app.use("/api/admin/users", require("./src/routes/userRoute"));


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot start server, Error: ", error);
    process.exit(1);
  }
}

start();
