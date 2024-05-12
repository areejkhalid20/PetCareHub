const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const app = express();

// Generate session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');

// Generate JWT secret
const jwtSecretKey = crypto.randomBytes(32).toString('hex');

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Express session setup
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

// JSON body parser
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Sign-up endpoint
app.post('/sign_up', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully.' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Sign-in endpoint
app.post('/sign_in', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, jwtSecretKey, { expiresIn: '1h' });
    req.session.token = token;

    res.json({ success: true, message: 'Login successful!', token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Protected endpoint
app.get('/protected', (req, res) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in.' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    res.json({ success: true, message: 'Protected content', user: decoded });
  });
});

// Connect to MongoDB and start server

module.exports = router;
