import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  BedDouble,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  DollarSign,
  Layers,
  X,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

const ROOM_TYPES = [
  'Standard Room',
  'Deluxe Suite',
  'Executive Suite',
  'Family Suite',
  'Presidential Suite',
  'Penthouse Suite',
];

const ROOM_STATUSES = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];

const emptyRoomForm = {
  roomNumber: '',
  type: 'Deluxe Suite',
  price: 150,
  status: 'Available',
  guest: '',
  capacity: 2,
  floor: 1,
};

const Rooms = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(emptyRoomForm);

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.guest && r.guest.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'ALL' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === 'ALL' || r.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData(emptyRoomForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      status: room.status,
      guest: room.guest || '',
      capacity: room.capacity || 2,
      floor: room.floor || 1,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.roomNumber.trim()) {
      alert('Please enter room number');
      return;
    }

    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      // Check for duplicate room number
      if (rooms.some((r) => r.roomNumber === formData.roomNumber)) {
        alert(`Room number ${formData.roomNumber} already exists!`);
        return;
      }
      addRoom(formData);
    }

    setModalOpen(false);
  };

  const handleDelete = (room) => {
    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
      deleteRoom(room.id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-green">● Available</span>;
      case 'Occupied':
        return <span className="badge badge-gold">● Occupied</span>;
      case 'Cleaning':
        return <span className="badge bg-amber-100 text-amber-800 border border-amber-300">● Cleaning</span>;
      case 'Maintenance':
        return <span className="badge badge-red">● Maintenance</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">
              Room Management
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage room inventory, pricing, status, and occupancy
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#EEF3F5] rounded-full p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-teal-sidebar text-white shadow-xs' : 'text-gray-500'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-teal-sidebar text-white shadow-xs' : 'text-gray-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Golden Add Room Button */}
            <button onClick={handleOpenAdd} className="btn-gold py-2.5 px-5 shadow-gold">
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 text-xs">
            <Search className="w-4 h-4 text-teal-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search room number, type, or guest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-xs font-semibold text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 text-xs">
            <BedDouble className="w-4 h-4 text-gold flex-shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent outline-none w-full text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <option value="ALL">All Room Types</option>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 text-xs">
            <Layers className="w-4 h-4 text-teal-muted flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none w-full text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {ROOM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room List: Cards View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl p-5 shadow-card hover:shadow-card-hover border border-gray-100 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Room Number & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar font-black text-sm">
                      {room.roomNumber}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        Floor {room.floor}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                        {room.type}
                      </h4>
                    </div>
                  </div>
                  <div>{getStatusBadge(room.status)}</div>
                </div>

                {/* Details */}
                <div className="space-y-2 py-3 border-y border-gray-100 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Price / Night:</span>
                    <span className="font-extrabold text-gray-900 text-sm">
                      ${room.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Current Guest:</span>
                    <span className="font-bold text-teal-sidebar">
                      {room.guest || '— Vacant —'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="font-medium text-gray-800">{room.capacity} Guests</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="flex items-center gap-2 pt-4 mt-1">
                <button
                  onClick={() => handleOpenEdit(room)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#EEF3F5] hover:bg-gold hover:text-white text-gray-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(room)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                  title="Delete Room"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Type</th>
                  <th>Price / Night</th>
                  <th>Status</th>
                  <th>Current Guest</th>
                  <th>Capacity</th>
                  <th>Floor</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td className="font-black text-gray-900 text-sm">Room {room.roomNumber}</td>
                    <td className="font-semibold text-gray-800">{room.type}</td>
                    <td className="font-bold text-gray-900">${room.price}</td>
                    <td>{getStatusBadge(room.status)}</td>
                    <td className="font-medium text-teal-sidebar">{room.guest || '— Vacant —'}</td>
                    <td>{room.capacity} Guests</td>
                    <td>Floor {room.floor}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(room)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gold hover:text-white transition-colors text-gray-600"
                          title="Edit Room"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white transition-colors text-rose-600"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-sidebar/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-teal-sidebar text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                  <BedDouble className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm tracking-wide">
                  {editingRoom ? `EDIT ROOM ${editingRoom.roomNumber}` : 'ADD NEW ROOM'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-teal-muted hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 105"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="input-field text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Price / Night ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Room Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field text-xs font-medium bg-white"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field text-xs font-medium bg-white"
                  >
                    {ROOM_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Floor
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="input-field text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Current Guest (if occupied)
                </label>
                <input
                  type="text"
                  placeholder="Guest name"
                  value={formData.guest}
                  onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                  className="input-field text-xs font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 shadow-md">
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
