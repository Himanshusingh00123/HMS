const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  totalAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Online'],
    default: 'Credit Card',
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Checked-in', 'Checked-out', 'Cancelled'],
    default: 'Pending',
  },
  specialRequest: { type: String, default: '' },
}, { timestamps: true });

// Auto-generate booking ID
reservationSchema.pre('save', async function () {
  if (!this.bookingId) {
    this.bookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
