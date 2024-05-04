const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/sign_up', async (req, res) => {
  const { email, password, confirmPassword, contact, gender } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const newUser = new User({ email, password, contact, gender });
    await newUser.save();

    res.json({ success: true, message: 'Sign-up successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
