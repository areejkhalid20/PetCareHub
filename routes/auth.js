const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Function to validate email format
function isValidEmail(email) {
  // Regular expression for basic email format validation
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

// Route for user sign-up
router.post('/sign_up', async (req, res) => {
  const { email, password, confirmPassword, contact, gender } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  // Check if email format is valid
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    // Create new user
    const newUser = new User({ email, password, contact, gender });
    await newUser.save();

    // Redirect to sign-in page upon successful sign-up
    res.redirect('/sign_in');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Route for user sign-in
router.post('/sign_in', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in the database
    const user = await User.findOne({ email }).exec();

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    // User authenticated successfully
    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
