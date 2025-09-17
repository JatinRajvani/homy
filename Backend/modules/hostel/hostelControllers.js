// controllers/hostelControllers.js
const { getDB } = require("../../config/db");

const getAllHostels = async (req, res) => {
  try {
    const hostel = getDB().collection("hostel");
    const allHostels = await hostel.find().toArray();
    res.status(200).json(allHostels);
  } catch (err) {
    res.status(500).send("Error fetching hostels: " + err.message);
  }
};

const getHostelsByArea = async (req, res) => {
  try {
    const area = req.params.area.toLowerCase();
    console.log('from by area',area);
    const hostel = getDB().collection("hostel");
    const hostelData = await hostel.findOne({ area });

    if (!hostelData) {
      return res.status(404).json({ message: "No hostels found in this area." });
    }

    res.status(200).json(hostelData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHostelByName = async (req, res) => {
  try {
    const  name  = req.params.hostelname;
    const normalized = name.replace(/\s+/g, "").toLowerCase();
    console.log(normalized)
    const hostel = getDB().collection("hostel");
    
    const hostelData = await hostel.findOne(
      { "hostels.searchkey": normalized },
      { projection: { "hostels.$": 1 } }
    );

    console.log(hostelData);

    if (!hostelData) {
      return res.status(404).json({
        message: "No hostel found with the given name in this area.",
      });
    }

    // hostelData.hostels contains only the matched element
    const hostelDetail = hostelData.hostels[0];

    res.status(200).json(hostelDetail);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  getAllHostels,
  getHostelsByArea,
  getHostelByName,
};
