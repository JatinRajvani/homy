const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://jatinrajwani19:Jkagency2024@cluster0.bwp2q.mongodb.net/";
const dbName = "hostel_service";

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(cors());

app.use(express.json());

let db, hostel;
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function initializeDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db(dbName);
        hostel = db.collection("hostel");
        app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

initializeDatabase();

app.get('/hostels', async (req, res) => {
    try {
        const allHostels = await hostel.find().toArray();
        res.status(200).json(allHostels);
    } catch (err) {
        res.status(500).send("Error fetching hostels: " + err.message);
    }
});

app.get('/hostels/:area', async (req, res) => {
    try {
        const area = req.params.area.toLowerCase();
        const hostelData = await hostel.findOne({ area });
        if (!hostelData) return res.status(404).json({ message: "No hostels found in this area." });
        res.status(200).json(hostelData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get('/hostels/:area/:name', async (req, res) => {
    try {
        const { area, name } = req.params;
        const hostelData = await hostel.findOne({ area: area.toLowerCase(), "Places.name": { $regex: new RegExp(`^${name}$`, "i") } });
        if (!hostelData) return res.status(404).json({ message: "No hostel found with the given name in this area." });
        const hostelDetail = hostelData.Places.find(place => place.name.toLowerCase() === name.toLowerCase());
        res.status(200).json(hostelDetail);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

  

























