import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  BedDouble,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Wrench,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import BookingModal from '../components/BookingModal';

const Dashboard = () => {
  const { rooms, bookings, stats, updateBookingStatus, setQuickBookOpen } = useHotel();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [localModalOpen, setLocalModalOpen] = useState(false);

  // Quick price slider state (inspired by the golden slider in reference image)
  const [priceRange, setPriceRange] = useState(450);

  // Filtered recent bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || b.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      roomTypeFilter === 'ALL' || b.roomType.toLowerCase().includes(roomTypeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-in':
        return (
          <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
            Checked-in
          </span>
        );
      case 'Confirmed':
        return (
          <span className="badge bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
            Confirmed
          </span>
        );
      case 'Checked-out':
        return (
          <span className="badge bg-gray-100 text-gray-700 border border-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1" />
            Checked-out
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" />
            Cancelled
          </span>
        );
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP QUICK SEARCH & BOOKING BAR (Directly inspired by reference image top bar) */}
      <div className="bg-white rounded-3xl p-4 md:p-5 shadow-card border border-gray-100/90">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
          {/* Room Type Selector */}
          <div className="flex items-center gap-2.5 bg-[#EEF3F5] rounded-full px-4 py-2.5 text-xs text-gray-700 font-medium">
            <BedDouble className="w-4 h-4 text-gold flex-shrink-0" />
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="bg-transparent outline-none w-full text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <option value="ALL">ALL ROOM TYPES</option>
              <option value="Deluxe">DELUXE SUITES</option>
              <option value="Standard">STANDARD ROOMS</option>
              <option value="Executive">EXECUTIVE SUITES</option>
              <option value="Presidential">PRESIDENTIAL</option>
            </select>
          </div>

          {/* Check-in Date */}
          <div className="flex items-center gap-2.5 bg-[#EEF3F5] rounded-full px-4 py-2.5 text-xs text-gray-700 font-medium">
            <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="truncate">CHECK-IN: TODAY</span>
          </div>

          {/* Quick Search Guest / Booking */}
          <div className="flex items-center gap-2.5 bg-[#EEF3F5] rounded-full px-4 py-2.5 text-xs text-gray-700 font-medium">
            <Search className="w-4 h-4 text-teal-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="GUEST OR ROOM #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-xs placeholder-gray-400 font-semibold"
            >
            </input>
          </div>

          {/* Golden Action Button */}
          <button
            onClick={() => setLocalModalOpen(true)}
            className="btn-gold py-2.5 w-full shadow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>+ QUICK BOOK</span>
          </button>
        </div>

        {/* Filter Pills row below */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
              STATUS:
            </span>
            {['ALL', 'CONFIRMED', 'CHECKED-IN', 'CHECKED-OUT'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  statusFilter === st
                    ? 'bg-teal-sidebar text-white shadow-xs'
                    : 'bg-[#EEF3F5] text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-teal-sidebar/70">
            SHOWING {filteredBookings.length} OF {bookings.length} BOOKINGS
          </div>
        </div>
      </div>

      {/* 2. STATS ROW (Total Rooms, Available Rooms, Occupied Rooms, Today's Bookings) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Rooms
            </p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">{stats.totalRooms}</h4>
            <p className="text-[11px] text-teal-sidebar font-semibold mt-0.5">Full Capacity</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Available Rooms
            </p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">{stats.availableRooms}</h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Ready for check-in</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Occupied Rooms
            </p>
            <h4 className="text-2xl font-black text-gold mt-1">{stats.occupiedRooms}</h4>
            <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
              {stats.occupancyRate}% Occupancy
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Today's Bookings
            </p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">{stats.todayBookings}</h4>
            <p className="text-[11px] text-teal-sidebar font-semibold mt-0.5">Active arrivals</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD SPLIT: Recent Bookings Table / Cards (Left) & Room Availability Dark Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Bookings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-wide uppercase">
                Recent Bookings ({filteredBookings.length})
              </h3>
              <p className="text-xs text-gray-400">Live guest bookings &amp; room assignments</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocalModalOpen(true)}
                className="btn-gold py-1.5 px-3.5 text-xs shadow-xs"
              >
                + Add Booking
              </button>
            </div>
          </div>

          {/* Bookings Cards / Table - Boarding Pass Style inspired by reference image */}
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
                <BedDouble className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold">No bookings match your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                    setRoomTypeFilter('ALL');
                  }}
                  className="mt-3 text-xs text-gold font-bold underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover border border-gray-100 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                >
                  {/* Left: Room Badge & Guest details */}
                  <div className="flex items-center gap-3.5 min-w-[200px]">
                    <div className="w-11 h-11 rounded-2xl bg-[#EEF3F5] border border-gray-200 flex items-center justify-center text-teal-sidebar flex-shrink-0">
                      <BedDouble className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900">{b.guestName}</h4>
                        <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          {b.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        Room <strong className="text-teal-sidebar">{b.roomNumber}</strong> • {b.roomType}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Check-in / Check-out schedule */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50/80 rounded-xl px-3.5 py-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Check-In</span>
                      <span className="font-semibold text-gray-800">{b.checkIn}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Check-Out</span>
                      <span className="font-semibold text-gray-800">{b.checkOut}</span>
                    </div>
                  </div>

                  {/* Right: Status, Amount & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3.5">
                    <div className="text-right">
                      <span className="block text-sm font-black text-gray-900">${b.totalAmount}</span>
                      {getStatusBadge(b.status)}
                    </div>

                    {/* Quick Status Action dropdown */}
                    <div className="relative group">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                        className="bg-gold hover:bg-gold-hover text-white text-[11px] font-bold rounded-full px-3 py-1.5 outline-none cursor-pointer shadow-xs transition-colors"
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
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (4 cols): ROOM AVAILABILITY WIDGET (Matching the dark teal card in reference image!) */}
        <div className="lg:col-span-4">
          <div className="bg-teal-sidebar rounded-3xl p-5 md:p-6 text-white shadow-xl flex flex-col justify-between border border-teal-border/40">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-teal-border/40">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                    ROOM INVENTORY
                  </span>
                  <h3 className="text-base font-extrabold tracking-wide">ROOM AVAILABILITY</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-dark flex items-center justify-center text-gold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Status Breakdown (Available, Occupied, Cleaning, Maintenance) */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="bg-teal-dark/70 rounded-2xl p-3 border border-teal-border/30">
                  <span className="text-[10px] uppercase font-bold text-teal-muted block">Available</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    {stats.availableRooms}
                  </span>
                  <span className="text-[10px] text-teal-muted font-medium">Ready to sell</span>
                </div>

                <div className="bg-teal-dark/70 rounded-2xl p-3 border border-teal-border/30">
                  <span className="text-[10px] uppercase font-bold text-teal-muted block">Occupied</span>
                  <span className="text-xl font-black text-gold mt-1 block">
                    {stats.occupiedRooms}
                  </span>
                  <span className="text-[10px] text-teal-muted font-medium">Guests staying</span>
                </div>

                <div className="bg-teal-dark/70 rounded-2xl p-3 border border-teal-border/30">
                  <span className="text-[10px] uppercase font-bold text-teal-muted block">Cleaning</span>
                  <span className="text-xl font-black text-amber-300 mt-1 block">
                    {stats.cleaningRooms}
                  </span>
                  <span className="text-[10px] text-teal-muted font-medium">Housekeeping</span>
                </div>

                <div className="bg-teal-dark/70 rounded-2xl p-3 border border-teal-border/30">
                  <span className="text-[10px] uppercase font-bold text-teal-muted block">Maintenance</span>
                  <span className="text-xl font-black text-rose-400 mt-1 block">
                    {stats.maintenanceRooms}
                  </span>
                  <span className="text-[10px] text-teal-muted font-medium">Under repair</span>
                </div>
              </div>

              {/* Interactive Visual Network Graphic (Dotted Room Map with golden arc from reference image) */}
              <div className="relative rounded-2xl bg-teal-dark/80 p-4 border border-teal-border/40 overflow-hidden mb-5">
                <div className="flex items-center justify-between text-xs font-bold text-teal-muted mb-2">
                  <span>HOTEL FLOOR STATUS</span>
                  <span className="text-gold font-mono">{stats.occupancyRate}% OCCUPIED</span>
                </div>

                <svg
                  className="w-full h-24 text-teal-border/50"
                  viewBox="0 0 200 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Dot Grid */}
                  <pattern
                    id="floor-pattern"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="rgba(140, 165, 162, 0.4)" />
                  </pattern>
                  <rect width="200" height="90" fill="url(#floor-pattern)" />

                  {/* Arcs and Nodes */}
                  <path
                    d="M 25 70 Q 100 15 175 70"
                    stroke="#C6922A"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  <circle cx="25" cy="70" r="5" fill="#10b981" />
                  <circle cx="100" cy="42" r="5" fill="#C6922A" />
                  <circle cx="175" cy="70" r="5" fill="#f59e0b" />

                  {/* Central Hotel Icon */}
                  <text x="92" y="32" fill="#D4A038" fontSize="10" fontWeight="bold">
                    🏨
                  </text>
                </svg>

                <div className="flex items-center justify-between text-[10px] text-teal-muted pt-2 border-t border-teal-border/30">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Free
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gold" /> Occupied
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Service
                  </span>
                </div>
              </div>

              {/* Status Filter Toggle Pills (like Non-Stop / One-Stop in reference image) */}
              <div className="flex items-center justify-between gap-1.5 p-1 rounded-full bg-teal-dark border border-teal-border/40 mb-5">
                {['ALL', 'AVAILABLE', 'CLEANING'].map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setStatusFilter(pill === 'ALL' ? 'ALL' : pill.toLowerCase())}
                    className={`flex-1 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                      (statusFilter === 'ALL' && pill === 'ALL') ||
                      statusFilter.toUpperCase() === pill
                        ? 'bg-gold text-white shadow-xs'
                        : 'text-teal-muted hover:text-white'
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Price Filter Slider (Matching the Golden Price Slider in reference image!) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[10px] uppercase text-teal-muted tracking-wider">
                    ROOM PRICE RANGE
                  </span>
                  <span className="text-gold font-mono">${priceRange} / night</span>
                </div>

                <input
                  type="range"
                  min="90"
                  max="520"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] text-teal-muted font-mono">
                  <span className="bg-teal-dark px-2 py-0.5 rounded text-gold font-bold">$90</span>
                  <span className="bg-teal-dark px-2 py-0.5 rounded text-gold font-bold">$520</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              onClick={() => setLocalModalOpen(true)}
              className="mt-6 w-full btn-gold py-2.5 shadow-gold"
            >
              + ASSIGN ROOM NOW
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingModal isOpen={localModalOpen} onClose={() => setLocalModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
