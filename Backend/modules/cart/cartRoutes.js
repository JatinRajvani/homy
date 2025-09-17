const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  syncCart,
} = require("./cartController");
const authenticateUser = require("../../middlewares/authMiddleware");

// Routes
router.get("/cart", authenticateUser, getCart);
router.post("/cart/add", authenticateUser, addToCart);
router.put("/cart/update", authenticateUser, updateCart);
router.delete("/cart/remove", authenticateUser, removeFromCart);
router.post("/cart/sync", authenticateUser, syncCart);

module.exports = router;

