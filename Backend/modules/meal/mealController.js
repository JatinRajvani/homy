const { ObjectId } = require("mongodb");
const { getDB } = require("../../config/db"); // Import your db connection helper

// ✅ Get all meals with average ratings
const getAllMeals = async (req, res) => {
  try {
    const collection = getDB().collection("meal");
    const meals = await collection.find().toArray();

    const mealsWithRatings = meals.map((meal) => {
      const avgRating =
        meal.ratings && meal.ratings.length > 0
          ? meal.ratings.reduce((a, b) => a + b, 0) / meal.ratings.length
          : 0;

      return { ...meal, avgRating: avgRating.toFixed(1) };
    });

    res.json(mealsWithRatings);
  } catch (error) {
    console.error("❌ Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get a single meal by ID
const getMealById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const collection = getDB().collection("meal");
    const meal = await collection.findOne({ _id: new ObjectId(id) });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    if (meal.ratings && Array.isArray(meal.ratings) && meal.ratings.length > 0) {
      const avgRating =
        meal.ratings.reduce((sum, rating) => sum + rating, 0) /
        meal.ratings.length;
      meal.averageRating = parseFloat(avgRating.toFixed(2));
    } else {
      meal.averageRating = 0;
    }

    res.status(200).json(meal);
  } catch (error) {
    console.error("❌ Error fetching meal by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get meal price by ID and weight
const getMealPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight = "500gm" } = req.query;
    console.log(weight)

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const collection = getDB().collection("meal");
    const meal = await collection.findOne({ _id: new ObjectId(id) });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    if (!meal.prices || typeof meal.prices !== "object") {
      return res.status(500).json({ error: "Meal price data is missing" });
    }

    const price = meal.prices[weight];

    if (price === undefined) {
      return res.status(400).json({ error: "Invalid weight selected" });
    }

    res.json({ price, weight });
  } catch (error) {
    console.error("❌ Error fetching meal price:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllMeals,
  getMealById,
  getMealPrice,
};
