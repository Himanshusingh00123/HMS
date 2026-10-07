const Food = require('../models/Food');
const Order = require('../models/Order');

// Foods
const getFoods = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'All' ? { category } : {};
    const foods = await Food.find(query).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('guest', 'name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getFoods, createFood, updateFood, deleteFood, getOrders, createOrder, updateOrder };
