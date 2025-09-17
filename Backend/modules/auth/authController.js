const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { connectToMongoDB } = require('../../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = connectToMongoDB();

    const existingUser = await db.collection('users').findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, email, password: hashedPassword, createdAt: new Date() };
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = getDB();

    const user = await db.collection('users').findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.json({ message: '✅ Login successful', token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: '🚪 Logged out successfully' });
};

// Social Auth (e.g., Auth0)
exports.socialLogin = async (req, res) => {
  const { username, email, picture, sub } = req.body;
  const db = getDB();

  try {
    const existingUser = await db.collection('users').findOne({ sub });

    if (!existingUser) {
      const newUser = { username, email, picture, sub };
      await db.collection('users').insertOne(newUser);
      return res.json({ message: 'User stored successfully', user: newUser });
    }

    res.json({ message: 'User already exists', user: existingUser });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
};
