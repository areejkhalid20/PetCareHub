const express = require('express');
const router = express.Router();
const path = require('path');
const Product = require('../models/products');

// Serve static landing pages
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

router.get('/BuyPet', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'BuyPet.html'));
});

router.get('/Pharmacy', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Pharmacy.html'));
});

// Serve Pets Accessories page with all products listed
router.get('/PetsAccessories', async (req, res) => {
  try {
      const products = await Product.find({});
      res.render('PetsAccessories', { products: products });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Server error');
  }
});

// New Route: Serve individual product detail pages
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productDetail', { product: product });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
