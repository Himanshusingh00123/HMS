const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  space: { type: String, required: true, unique: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  guestName: { type: String, default: '' },
  vehicleNumber: { type: String, default: '' },
  vehicleType: { type: String, enum: ['Car', 'Motorcycle', 'SUV', 'Van'], default: 'Car' },
  entryTime: { type: Date },
  exitTime: { type: Date },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Reserved'],
    default: 'Available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Parking', parkingSchema);
