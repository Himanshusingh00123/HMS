const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

const getReservations = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    const reservations = await Reservation.find(query)
      .populate('guest', 'name email phone country avatar')
      .populate('room', 'roomNumber type price')
      .sort({ createdAt: -1 });

    let results = reservations;
    if (search) {
      const s = search.toLowerCase();
      results = reservations.filter(r =>
        r.guest?.name?.toLowerCase().includes(s) ||
        r.bookingId?.toLowerCase().includes(s) ||
        r.room?.roomNumber?.toLowerCase().includes(s)
      );
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('guest')
      .populate('room');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    // Mark room as occupied
    if (reservation.status === 'Checked-in') {
      await Room.findByIdAndUpdate(req.body.room, { status: 'Occupied' });
    }
    const populated = await Reservation.findById(reservation._id)
      .populate('guest', 'name email phone country')
      .populate('room', 'roomNumber type price');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('guest', 'name email phone country')
      .populate('room', 'roomNumber type price');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Update room status based on reservation status
    if (reservation.room) {
      if (reservation.status === 'Checked-in') {
        await Room.findByIdAndUpdate(reservation.room._id, { status: 'Occupied' });
      } else if (reservation.status === 'Checked-out') {
        await Room.findByIdAndUpdate(reservation.room._id, { status: 'Cleaning' });
      } else if (reservation.status === 'Cancelled') {
        await Room.findByIdAndUpdate(reservation.room._id, { status: 'Available' });
      }
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getReservations, getReservation, createReservation, updateReservation, deleteReservation };
