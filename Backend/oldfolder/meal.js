const express=require('express');
const app=express();
const cors=require("cors");
const PORT=5000;

const {MongoClient}=require("mongodb");// Use To connect With Database

const uri="mongodb+srv://jatinrajwani19:Jkagency2024@cluster0.bwp2q.mongodb.net";
const client= new MongoClient(uri,{ useUnifiedTopology: true });

const dbName = "hostel_service";
let db,collection;
async function connectDB() {
    try{
        await client.connect();//Conect To MongoDb
        db = client.db(dbName);
        collection=db.collection("meal");
        console.log('connect to mongodb');
    }catch(error){
        console.log('Error connect to mongodb',error);// For Finding the error 
    }
    
}
connectDB();


app.use(cors());// For Enabling cors For all Requests


// Middleware to parse JSON
app.use(express.json());


// app.use(
//     cors({
//       origin: "http://localhost:3000",  Allow requests only from this origin
//       methods: ["GET", "POST", "PUT", "DELETE"],  Allowed request methods
//       allowedHeaders: ["Content-Type", "Authorization"],  Allowed headers
//     })
//   );



//Api Routing to fetch the hostel.
app.get('/meals', async (req, res) => {
    try {
        const meals = await collection.find().toArray();

        // Calculate the average rating for each meal
        const mealsWithRatings = meals.map((meal) => {
            const avgRating = meal.ratings && meal.ratings.length > 0 
                ? meal.ratings.reduce((a, b) => a + b, 0) / meal.ratings.length 
                : 0;

            return { ...meal, avgRating: avgRating.toFixed(1) }; // Limit decimal places
        });

        res.json(mealsWithRatings); // Sending updated data
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


// app.get('/meals/:id',async(req,res)=>{
//     try{
//         const name=req.params.id;
//         console.log(name)
//         const meals=await collection.findOne({name});
//         res.status(200).json(meals);
//     }catch(error){
//         res.status(500).json({error:"internal server not working"});
//     }
    
// })


const { ObjectId } = require("mongodb"); // Ensure ObjectId is imported

app.get("/meals/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        // Fetch meal by ID
        const meal = await collection.findOne({ _id: new ObjectId(id) });

        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }

        // Ensure ratings array exists
        if (meal.ratings && Array.isArray(meal.ratings) && meal.ratings.length > 0) {
            // Calculate average rating
            const averageRating =
                meal.ratings.reduce((sum, rating) => sum + rating, 0) / meal.ratings.length;

            // Add the average rating to the response
            meal.averageRating = parseFloat(averageRating.toFixed(2)); // Keep 2 decimal places
        } else {
            meal.averageRating = 0; // Default value if no ratings exist
        }

        res.status(200).json(meal);
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// For finding the price base on the weight

app.get("/meals/:id/price", async (req, res) => {
    try {
        const { id } = req.params;
        const { weight = "500gm" } = req.query; // Default weight 500gm

        console.log("📌 Fetching Price for Meal:", id, "Weight:", weight);

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        // Find meal in the database
        const meal = await collection.findOne({ _id: new ObjectId(id) });

        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }

        // Ensure prices exist
        if (!meal.prices || typeof meal.prices !== "object") {
            return res.status(500).json({ error: "Meal price data is missing" });
        }

        // Get price for the selected weight
        const price = meal.prices[weight];

        if (price === undefined) {
            return res.status(400).json({ error: "Invalid weight selected" });
        }

        res.json({ price, weight });
    } catch (error) {
        console.error("❌ Error Fetching Price:", error);
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
});


