import { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  CalendarCheck,
  Calendar,
  User,
  Phone,
  BedDouble,
  DollarSign,
  Users,
  CreditCard,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  LogOut,
  X,
  Filter,
} from 'lucide-react';

const Bookings = () => {
  const { rooms, bookings, addBooking, updateBookingStatus, deleteBooking } = useHotel();

  // Tomorrow & default dates
  const today = new Date().toISOString().split('T')[0];
  const defaultCheckOut = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const emptyForm = {
    guestName: '',
    phone: '',
    email: '',
    roomNumber: rooms[0]?.roomNumber || '101',
    roomType: rooms[0]?.type || 'Deluxe Suite',
    checkIn: today,
    checkOut: defaultCheckOut,
    guestsCount: 2,
    paymentStatus: 'Paid',
    totalAmount: 360,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showInlineForm, setShowInlineForm] = useState(false);

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
    if (!formData.phone.trim()) {
      alert('Please enter phone number');
      return;
    }

    addBooking({
      ...formData,
      status: 'Confirmed',
    });

    // Reset form
    setFormData({
      ...emptyForm,
      roomNumber: rooms[0]?.roomNumber || '101',
      roomType: rooms[0]?.type || 'Deluxe Suite',
    });
    setShowInlineForm(false);
  };

  const handleCancelForm = () => {
    setFormData(emptyForm);
    setShowInlineForm(false);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone && b.phone.includes(searchTerm));
    const matchesStatus =
      statusFilter === 'ALL' || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-in':
        return (
          <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-300">
            ● Checked-in
          </span>
        );
      case 'Confirmed':
        return (
          <span className="badge bg-blue-100 text-blue-800 border border-blue-300">
            ● Confirmed
          </span>
        );
      case 'Checked-out':
        return (
          <span className="badge bg-gray-100 text-gray-700 border border-gray-300">
            ● Checked-out
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge bg-rose-100 text-rose-800 border border-rose-300">
            ● Cancelled
          </span>
        );
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
      case 'Pending':
        return <span className="badge bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'Partial':
        return <span className="badge bg-blue-50 text-blue-700 border border-blue-200">Partial</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">
            Reservations &amp; Bookings
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Create new guest reservations and manage check-in/check-out lifecycle
          </p>
        </div>

        <button
          onClick={() => setShowInlineForm(!showInlineForm)}
          className="btn-gold py-2.5 px-5 shadow-gold"
        >
          {showInlineForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showInlineForm ? 'Close Form' : '+ New Booking Form'}</span>
        </button>
      </div>

      {/* Booking Form (Prominent Card as requested by prompt) */}
      {showInlineForm && (
        <div className="bg-white rounded-3xl p-6 shadow-card border border-gold/40 animate-fadeIn">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
            <div className="w-9 h-9 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
                Create Room Booking
              </h3>
              <p className="text-xs text-gray-400">Fill in guest details to confirm reservation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guest name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Guest Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Smith"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="input-field pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Room Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Room Number *
                </label>
                <select
                  value={formData.roomNumber}
                  onChange={handleRoomSelect}
                  className="input-field text-xs font-bold bg-white"
                >
                  {rooms.map((r) => (
                    <option key={r.id || r.roomNumber} value={r.roomNumber}>
                      Room {r.roomNumber} - {r.type} (${r.price}/night) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Room Type
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.roomType}
                  className="input-field text-xs bg-gray-50 text-gray-600 font-bold cursor-not-allowed"
                />
              </div>

              {/* Check-in date */}
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
                    className="input-field pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Check-out date */}
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
                    className="input-field pl-10 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Number of guests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Number of Guests
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                    className="input-field pl-10 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Payment status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="input-field text-xs font-bold bg-white"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              {/* Total amount */}
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
                    className="input-field pl-10 text-xs font-black text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Buttons: Book Room & Cancel */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold py-2.5 px-8 shadow-gold"
              >
                Book Room
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings List & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 space-y-4">
        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 text-xs max-w-sm flex-1">
            <Search className="w-4 h-4 text-teal-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by guest, booking ID, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-xs font-semibold text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
              STATUS:
            </span>
            {['ALL', 'CONFIRMED', 'CHECKED-IN', 'CHECKED-OUT', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? 'bg-teal-sidebar text-white shadow-xs'
                    : 'bg-[#EEF3F5] text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Bookings */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room #</th>
                <th>Room Type</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Guests</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-gray-400">
                    No bookings found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono font-bold text-xs text-teal-sidebar">{b.id}</td>
                    <td>
                      <div>
                        <span className="font-bold text-gray-900 block">{b.guestName}</span>
                        <span className="text-[11px] text-gray-400 block">{b.phone}</span>
                      </div>
                    </td>
                    <td className="font-black text-gray-800">Room {b.roomNumber}</td>
                    <td className="text-xs font-medium text-gray-600">{b.roomType}</td>
                    <td className="text-xs font-semibold text-gray-700">{b.checkIn}</td>
                    <td className="text-xs font-semibold text-gray-700">{b.checkOut}</td>
                    <td className="text-xs font-medium text-gray-600">{b.guestsCount}</td>
                    <td>{getPaymentBadge(b.paymentStatus)}</td>
                    <td className="font-black text-gray-900 text-sm">${b.totalAmount}</td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Change Status Dropdown */}
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                          className="bg-[#EEF3F5] hover:bg-gold hover:text-white text-gray-700 text-[11px] font-bold rounded-lg px-2 py-1 outline-none transition-colors cursor-pointer"
                        >
                          <option value="Confirmed" className="bg-white text-gray-900">
                            Confirmed
                          </option>
                          <option value="Checked-in" className="bg-white text-gray-900">
                            Check In
                          </option>
                          <option value="Checked-out" className="bg-white text-gray-900">
                            Check Out
                          </option>
                          <option value="Cancelled" className="bg-white text-gray-900">
                            Cancel
                          </option>
                        </select>

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete booking ${b.id}?`)) {
                              deleteBooking(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
