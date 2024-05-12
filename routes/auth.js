const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sessionSecret = generateSessionSecret();
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

const jwtSecretKey = generateJWTSecret(); 

app.use(express.json());

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
