const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;
    if (conversationId) {
      const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
      return res.json(messages);
    }
    // Get conversations (unique senders)
    const conversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$message' },
          senderName: { $first: '$senderName' },
          senderAvatar: { $first: '$senderAvatar' },
          createdAt: { $first: '$createdAt' },
          unread: { $sum: { $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$isFromGuest', true] }] }, 1, 0] } },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    // Mark conversation as read
    if (!req.body.isFromGuest) {
      await Message.updateMany(
        { conversationId: req.body.conversationId, isFromGuest: true, read: false },
        { read: true }
      );
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMessages, createMessage };
