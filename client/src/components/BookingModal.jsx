import { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { X, Calendar, User, Phone, BedDouble, DollarSign, Users, CreditCard } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, initialRoom = null }) => {
  const { rooms, addBooking } = useHotel();

  // Tomorrow & day after default dates
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    roomNumber: initialRoom?.roomNumber || '',
    roomType: initialRoom?.type || 'Deluxe Suite',
    checkIn: today,
    checkOut: nextWeek,
    guestsCount: 2,
    paymentStatus: 'Paid',
    totalAmount: 360,
  });

  // Keep room info synchronized when initialRoom changes
  useEffect(() => {
    if (initialRoom) {
      setFormData((prev) => ({
        ...prev,
        roomNumber: initialRoom.roomNumber,
        roomType: initialRoom.type,
      }));
    } else if (rooms.length > 0 && !formData.roomNumber) {
      const avail = rooms.find((r) => r.status === 'Available') || rooms[0];
      setFormData((prev) => ({
        ...prev,
        roomNumber: avail.roomNumber,
        roomType: avail.type,
      }));
    }
  }, [initialRoom, rooms]);

  // Recalculate amount whenever room or dates change
  useEffect(() => {
    const selectedRoom = rooms.find((r) => r.roomNumber === formData.roomNumber);
    const pricePerNight = selectedRoom ? selectedRoom.price : 120;

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const nights = isNaN(diffTime) || diffTime <= 0 ? 1 : Math.round(diffTime);

    setFormData((prev) => ({
      ...prev,
      totalAmount: nights * pricePerNight,
    }));
  }, [formData.roomNumber, formData.checkIn, formData.checkOut, rooms]);

  if (!isOpen) return null;

  const handleRoomSelect = (e) => {
    const rNum = e.target.value;
    const found = rooms.find((r) => r.roomNumber === rNum);
    setFormData({
      ...formData,
      roomNumber: rNum,
      roomType: found ? found.type : formData.roomType,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      alert('Please enter guest name');
      return;
    }

    addBooking({
      ...formData,
      status: 'Confirmed',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-sidebar/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-teal-sidebar text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">NEW HOTEL RESERVATION</h3>
              <p className="text-[11px] text-teal-muted">Enter guest &amp; room reservation details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-teal-muted hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guest Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Guest Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Room Number *
              </label>
              <select
                value={formData.roomNumber}
                onChange={handleRoomSelect}
                className="input-field text-xs font-medium bg-white"
              >
                {rooms.map((r) => (
                  <option key={r.id || r.roomNumber} value={r.roomNumber}>
                    Room {r.roomNumber} - {r.type} (${r.price}/night - {r.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Room Type
              </label>
              <input
                type="text"
                readOnly
                value={formData.roomType}
                className="input-field text-xs bg-gray-50 text-gray-600 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Check-in Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Check-in Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Check-out Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Number of Guests */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Guests
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.guestsCount}
                  onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="input-field text-xs font-medium bg-white"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Total Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="input-field pl-10 text-xs font-bold text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Buttons: Book Room & Cancel */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold py-2.5 px-6 shadow-md"
            >
              Book Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
