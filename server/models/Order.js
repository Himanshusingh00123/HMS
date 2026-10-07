const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  guestName: { type: String, default: 'Walk-in' },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['New', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'New',
  },
  roomNumber: { type: String, default: '' },
}, { timestamps: true });

orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD${Math.floor(10000 + Math.random() * 90000)}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
