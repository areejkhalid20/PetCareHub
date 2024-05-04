const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'landing-page.html'));
});

router.get('/sign_in', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sign_in.html'));
});

router.get('/sign_up', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sign_up.html'));
});

router.get('/petFood', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'petFood.html'));
});


module.exports = router;
