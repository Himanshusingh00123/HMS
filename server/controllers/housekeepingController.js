const Housekeeping = require('../models/Housekeeping');

const getHousekeeping = async (req, res) => {
  try {
    const tasks = await Housekeeping.find().populate('room', 'roomNumber type floor').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHousekeeping = async (req, res) => {
  try {
    const task = await Housekeeping.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('room', 'roomNumber type floor');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createHousekeeping = async (req, res) => {
  try {
    const task = await Housekeeping.create(req.body);
    const populated = await Housekeeping.findById(task._id).populate('room', 'roomNumber type floor');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getHousekeeping, updateHousekeeping, createHousekeeping };
