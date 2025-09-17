const express = require("express");
const {
  getAllMeals,
  getMealById,
  getMealPrice,
} = require("./mealController");

const router = express.Router();

router.get("/meals", getAllMeals);
router.get("/meals/:id", getMealById);
router.get("/meals/:id/price", getMealPrice);

module.exports = router;
