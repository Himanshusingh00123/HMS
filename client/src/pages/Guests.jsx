import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  BedDouble,
  Calendar,
  Edit2,
  Trash2,
  X,
  Globe,
} from 'lucide-react';

const emptyGuestForm = {
  name: '',
  phone: '',
  email: '',
  room: '',
  checkIn: new Date().toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
  status: 'Active',
  country: 'United States',
};

const Guests = () => {
  const { guests, addGuest, updateGuest, deleteGuest, rooms } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState(emptyGuestForm);

  const filteredGuests = guests.filter((g) => {
    return (
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFormData({
      ...emptyGuestForm,
      room: rooms[0]?.roomNumber || '101',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      phone: guest.phone,
      email: guest.email,
      room: guest.room,
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      status: guest.status || 'Active',
      country: guest.country || 'United States',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Name and phone are required');
      return;
    }

    if (editingGuest) {
      updateGuest(editingGuest.id, formData);
    } else {
      addGuest(formData);
    }

    setModalOpen(false);
  };

  const handleDelete = (guest) => {
    if (window.confirm(`Are you sure you want to delete ${guest.name}?`)) {
      deleteGuest(guest.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">
            Guest Directory
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Registered guests, contact information, and room stay duration
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 text-xs">
            <Search className="w-4 h-4 text-teal-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search name, phone, email, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-48 sm:w-64 text-xs font-semibold text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Add Guest Button */}
          <button onClick={handleOpenAdd} className="btn-gold py-2.5 px-5 shadow-gold">
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Guest Table Card */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Guest ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Room #</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-400">
                    No guests found matching search.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id}>
                    {/* Guest ID */}
                    <td className="font-mono font-bold text-xs text-teal-sidebar">{guest.id}</td>

                    {/* Name */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center font-black text-xs">
                          {guest.name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{guest.name}</span>
                          <span className="text-[11px] text-gray-400 block">{guest.country}</span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="text-xs font-semibold text-gray-700">{guest.phone}</td>

                    {/* Email */}
                    <td className="text-xs text-gray-600">{guest.email}</td>

                    {/* Room */}
                    <td>
                      <span className="inline-flex items-center gap-1 font-bold text-teal-sidebar text-xs bg-teal-sidebar/5 px-2.5 py-1 rounded-lg">
                        <BedDouble className="w-3.5 h-3.5 text-gold" />
                        Room {guest.room}
                      </span>
                    </td>

                    {/* Check-In */}
                    <td className="text-xs font-medium text-gray-700">{guest.checkIn}</td>

                    {/* Check-Out */}
                    <td className="text-xs font-medium text-gray-700">{guest.checkOut}</td>

                    {/* Status */}
                    <td>
                      {guest.status === 'Active' ? (
                        <span className="badge badge-green">In-House</span>
                      ) : guest.status === 'Upcoming' ? (
                        <span className="badge badge-blue">Upcoming</span>
                      ) : (
                        <span className="badge badge-gray">Checked-out</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gold hover:text-white transition-colors text-gray-600"
                          title="Edit Guest"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white transition-colors text-rose-600"
                          title="Delete Guest"
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

      {/* Add / Edit Guest Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-sidebar/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-teal-sidebar text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm tracking-wide">
                  {editingGuest ? 'EDIT GUEST DETAILS' : 'ADD NEW GUEST'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-teal-muted hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="guest@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Room Number
                  </label>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="input-field text-xs font-bold bg-white"
                  >
                    {rooms.map((r) => (
                      <option key={r.id || r.roomNumber} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nationality / Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="input-field text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="input-field text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="input-field text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-2.5 px-6 shadow-md">
                  {editingGuest ? 'Save Changes' : 'Register Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests;
