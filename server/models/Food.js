const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Pizza', 'Pasta', 'Desserts', 'Drinks', 'Burger', 'Main Course', 'Salad', 'Seafood'],
    required: true,
  },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
