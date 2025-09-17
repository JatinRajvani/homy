const { getDB } = require("../../config/db");

// 📌 Get user's cart
exports.getCart = async (req, res) => {
  try {
    const db = getDB();
    const cart = await db.collection("cart").findOne({ userId: req.userId });
    res.json(cart || { cartItems: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// 📌 Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const db = getDB();
    const { productId, name, price, quantity } = req.body;

    await db.collection("cart").updateOne(
      { userId: req.userId },
      { $push: { cartItems: { productId, name, price, quantity } } },
      { upsert: true }
    );

    res.json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// 📌 Update cart item
exports.updateCart = async (req, res) => {
  try {
    const db = getDB();
    const { productId, quantity } = req.body;

    await db.collection("cart").updateOne(
      { userId: req.userId, "cartItems.productId": productId },
      { $set: { "cartItems.$.quantity": quantity } }
    );

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

// 📌 Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const db = getDB();
    const { productId } = req.body;

    await db.collection("cart").updateOne(
      { userId: req.userId },
      { $pull: { cartItems: { productId } } }
    );

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

// 📌 Sync local storage cart with DB
exports.syncCart = async (req, res) => {
  try {
    const db = getDB();
    const { cartItems } = req.body;

    await db.collection("cart").updateOne(
      { userId: req.userId },
      { $push: { cartItems: { $each: cartItems } } },
      { upsert: true }
    );

    res.json({ message: "Cart synced successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error syncing cart", error });
  }
};
