const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');

// Generate session secret and JWT secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
const jwtSecretKey = crypto.randomBytes(32).toString('hex');

// Middleware for session management
router.use(require('express-session')({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } //10 min session in milisec
}));

// Route for user sign-up
router.post('/sign_up', async (req, res) => {
  const { email, password, confirmPassword, contact, gender } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, contact, gender });
    await newUser.save();
    res.redirect('/sign_in');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/sign_in', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, jwtSecretKey, { expiresIn: '10m' });
    req.session.token = token;
    res.json({ success: true, message: 'Login successful!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;