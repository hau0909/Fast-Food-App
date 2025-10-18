const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await connectDB();

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot start server, Error: ", error);
    process.exit(1);
  }
}

start();
