const mongoose = require('mongoose');

const pharmacyItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }  // URL to the image
});

const PharmacyItem = mongoose.model('PharmacyItem', pharmacyItemSchema);

module.exports = PharmacyItem;
