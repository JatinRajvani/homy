const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config({path:'./auth.env'});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());


// MongoDB Connection
const mongoURI = process.env.MONGODB;
const dbName = 'hostel_service';
let db;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
      const client = new MongoClient(mongoURI);
      await client.connect();
      console.log('Authentication is Connected to MongoDB');
      db = client.db(dbName);
      
      // Create indexes for unique fields
      await db.collection('users').createIndex({ username: 1 }, { unique: true });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  }


  // Initialize MongoDB connection
connectToMongoDB();

// Environment variables (use dotenv in production)
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN =process.env.JWT_EXPIRES_IN || '7d';
console.log("JWT Secret Key is new:", JWT_SECRET);




// Register route
app.post('/api/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({
        $or: [{ email }, { username }]
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with that email or username already exists' 
        });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };
      
      // Insert user into database
      await db.collection('users').insertOne(newUser);
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Specific error handling for duplicate key errors
      if (error.code === 11000) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  });


  // Login route
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // Ensure MongoDB is connected
      if (!db) {
        return res.status(500).json({ message: 'Database connection error' });
      }
  
      // Find user in database
      const user = await db.collection('users').findOne({ username });
      console.log('🔍 User found:', user);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Validate password
      console.log('🔑 Entered password:', password);
      console.log('🔑 Stored hashed password:', user.password);
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT token
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          username: user.username,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } // ✅ Fixed syntax error
      );
  
      console.log('🛡️ JWT Secret:', JWT_SECRET);
      console.log('🔐 Token Generated:', token);
    
  
      // Send token as HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
      });
  
      // Send response
      res.json({
        message: '✅ Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
  
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

  // Authentication middleware
const authenticateToken = (req, res, next) => {
    // Get token from cookies or Authorization header
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Add user data to request
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };





  // Protected route example
  app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        console.log('🔍 Extracted User ID:', req.user.userId);

        // Convert userId to ObjectId
        const userId = new ObjectId(req.user.userId);

        // Find user in the database, excluding password
        const user = await db.collection('users').findOne(
            { _id: userId },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('❌ Profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



  // Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { username, bio, removeField } = req.body;

        // Fields to update
        const updates = {};
        if (username) updates.username = username;
        if (bio) updates.bio = bio;

        // Fields to delete
        const deletions = {};
        if (removeField) deletions[removeField] = "";

        // MongoDB update query
        const updateQuery = {};
        if (Object.keys(updates).length > 0) updateQuery.$set = updates;
        if (Object.keys(deletions).length > 0) updateQuery.$unset = deletions; // Delete fields

        // Ensure there's something to update
        if (Object.keys(updateQuery).length === 0) {
            return res.status(400).json({ message: "No valid fields to update or delete" });
        }

        // Update user in database
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.userId) },
            updateQuery
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("❌ Profile update error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Auth0 Login Route
// **Login Route**
app.post("/api/auth/login", async (req, res) => {
  const { username, email, picture, sub } = req.body;

  try {
    const existingUser = await db.collection('users').findOne({ sub });

    if (!existingUser) {
      const newUser = { 
        username, email, picture, sub };
      await db.collection('users').insertOne(newUser);
      return res.json({ message: "User stored successfully", user: newUser });
    }

    res.json({ message: "User already exists", user: existingUser });
  } catch (error) {
    console.error("Database error:", error); // Log error
    res.status(500).json({ message: "Error saving user", error: error.message });
  }
});

  

  app.post('/api/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out successfully' });
  });


  const PORT = process.env.PORT || 5500;
  app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
});