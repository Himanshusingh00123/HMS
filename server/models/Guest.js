const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true },
  phone: { type: String, required: true },
  country: { type: String, default: 'USA' },
  avatar: { type: String, default: '' },
  notes: { type: String, default: '' },
  totalSpent: { type: Number, default: 0 },
  totalStays: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive', 'VIP'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
