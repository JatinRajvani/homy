const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/authRoutes");
const cartRoutes = require("./modules/cart/cartRoutes");
const app = express();

app.use(cors());

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api", cartRoutes);

module.exports = app;
