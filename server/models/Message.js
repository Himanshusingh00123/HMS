const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: '' },
  receiverName: { type: String, default: 'Admin' },
  message: { type: String, required: true },
  isFromGuest: { type: Boolean, default: true },
  read: { type: Boolean, default: false },
  conversationId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
