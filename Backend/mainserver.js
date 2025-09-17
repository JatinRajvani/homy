const app = require("./app");
const { connectToMongoDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectToMongoDB(); // ✅ connect DB once
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
