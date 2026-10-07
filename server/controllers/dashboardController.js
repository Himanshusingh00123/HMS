const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Reservation = require('../models/Reservation');
const Order = require('../models/Order');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Room stats
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const cleaningRooms = await Room.countDocuments({ status: 'Cleaning' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Maintenance' });
    const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Today's check-ins/outs
    const checkIns = await Reservation.countDocuments({
      checkIn: { $gte: today, $lt: tomorrow },
      status: { $in: ['Confirmed', 'Checked-in'] },
    });
    const checkOuts = await Reservation.countDocuments({
      checkOut: { $gte: today, $lt: tomorrow },
      status: { $in: ['Checked-in', 'Checked-out'] },
    });

    // Revenue (total amount from paid reservations)
    const revenueAgg = await Reservation.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    // Recent reservations
    const recentReservations = await Reservation.find()
      .populate('guest', 'name email avatar country')
      .populate('room', 'roomNumber type')
      .sort({ createdAt: -1 })
      .limit(8);

    // Room availability breakdown
    const roomAvailability = [
      { name: 'Available', value: availableRooms, color: '#22c55e' },
      { name: 'Occupied', value: occupiedRooms, color: '#4169D8' },
      { name: 'Cleaning', value: cleaningRooms, color: '#f59e0b' },
      { name: 'Maintenance', value: maintenanceRooms, color: '#ef4444' },
    ];

    // Booking stats for last 7 days
    const bookingStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);
      const count = await Reservation.countDocuments({
        createdAt: { $gte: d, $lt: nextD },
      });
      bookingStats.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        bookings: count,
      });
    }

    // Total guests
    const totalGuests = await Guest.countDocuments();

    res.json({
      occupancy,
      availableRooms,
      totalRooms,
      checkIns,
      checkOuts,
      revenue,
      totalGuests,
      roomAvailability,
      bookingStats,
      recentReservations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };
