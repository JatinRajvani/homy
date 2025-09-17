const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/authRoutes");
const cartRoutes = require("./modules/cart/cartRoutes");
const hostelRoutes = require("./modules/hostel/hostelRoutes");
const mealRoutes = require("./modules/meal/mealRoutes");
const app = express();

app.use(cors());

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api", cartRoutes);
app.use("/api", hostelRoutes);
app.use("/api", mealRoutes);
module.exports = app;
