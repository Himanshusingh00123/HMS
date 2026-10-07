const Guest = require('../models/Guest');

// GET all guests
const getGuests = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    const guests = await Guest.find(query).sort({ createdAt: -1 });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single guest
const getGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE guest
const createGuest = async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE guest
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE guest
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getGuests, getGuest, createGuest, updateGuest, deleteGuest };
