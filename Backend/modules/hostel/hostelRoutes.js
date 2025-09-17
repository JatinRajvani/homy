// routes/hostelRoutes.js
const express = require("express");
const {  getAllHostels,
  getHostelsByArea,
  getHostelByName,} = require("./hostelControllers");

const router = express.Router();

// Routes
router.get("/hostel", getAllHostels);
router.get("/hostel/area/:area", getHostelsByArea);
router.get("/hostel/name/:hostelname", getHostelByName);

module.exports = router;
