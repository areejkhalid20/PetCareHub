const express = require('express');
const router = express.Router();
const User = require('../models/user');

// email verification
router.post('/sign_up', async (req, res) => {
  const { email, password, confirmPassword, contact, gender } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    // Create new user
    const newUser = new User({ email, password, contact, gender });
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
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    
    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
