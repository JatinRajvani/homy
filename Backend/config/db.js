const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./auth.env" });

const mongoURI = process.env.MONGODB;
const dbName = "hostel_service";
let db;

const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectToMongoDB, getDB };
