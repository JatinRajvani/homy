const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config({path:'./auth.env'});

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGODB;
const client = new MongoClient(mongoURI);
let db;

async function connectDB() {
   await client.connect();
   db = client.db("hostel_service"); // Change to your database name
   console.log("MongoDB Connected");
}

connectDB();
const secretKey = process.env.JWT_SECRET// Replace with environment variable in production
console.log("JWT Secret Key in Cart API:", secretKey);

// Middleware to verify JWT and extract userId
const authenticateUser = (req, res, next) => {
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) return res.status(401).json({ message: "Unauthorized" });

   jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      req.userId = decoded.userId; // Attach userId to request
      next();
   });
};

// API to get user's cart
app.get("/api/cart", authenticateUser, async (req, res) => {
   try {
      const cart = await db.collection("cart").findOne({ userId: req.userId });
      res.json(cart || { cartItems: [] }); // Return empty cart if none found
   } catch (error) {
      res.status(500).json({ message: "Error fetching cart", error });
   }
});

// API to add an item to the cart
app.post("/api/cart/add", authenticateUser, async (req, res) => {
   try {
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
});

// API to update item quantity in cart
app.put("/api/cart/update", authenticateUser, async (req, res) => {
   try {
      const { productId, quantity } = req.body;
      await db.collection("cart").updateOne(
         { userId: req.userId, "cartItems.productId": productId },
         { $set: { "cartItems.$.quantity": quantity } }
      );
      res.json({ message: "Cart updated successfully" });
   } catch (error) {
      res.status(500).json({ message: "Error updating cart", error });
   }
});

// API to remove an item from cart
app.delete("/api/cart/remove", authenticateUser, async (req, res) => {
   try {
      const { productId } = req.body;
      await db.collection("cart").updateOne(
         { userId: req.userId },
         { $pull: { cartItems: { productId } } }
      );
      res.json({ message: "Item removed from cart" });
   } catch (error) {
      res.status(500).json({ message: "Error removing item", error });
   }
});

// Sync Local Storage cart with database
app.post("/api/cart/sync", authenticateUser, async (req, res) => {
   try {
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
});

// Start server
app.listen(3500, () => console.log("Server running on port 3500"));
