const Parking = require('../models/Parking');

const getParking = async (req, res) => {
  try {
    const spaces = await Parking.find().populate('guest', 'name').sort({ space: 1 });
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createParking = async (req, res) => {
  try {
    const parking = await Parking.create(req.body);
    res.status(201).json(parking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('guest', 'name');
    if (!parking) return res.status(404).json({ message: 'Parking space not found' });
    res.json(parking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);
    if (!parking) return res.status(404).json({ message: 'Parking space not found' });
    res.json({ message: 'Parking space deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getParking, createParking, updateParking, deleteParking };
