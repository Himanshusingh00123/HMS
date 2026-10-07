const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite', 'Single', 'Double', 'Family'],
    required: true,
  },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  amenities: [{ type: String }],
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  floor: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
