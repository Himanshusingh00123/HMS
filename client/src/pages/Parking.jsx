import { useState, useEffect } from 'react';
import { getParking, createParking, updateParking, deleteParking, getGuests } from '../services/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import {
  Car, Search, Plus, Filter, CheckCircle2,
  AlertCircle, Clock, Trash2, Edit2, LogOut,
  ShieldCheck, ArrowUpDown, RefreshCw
} from 'lucide-react';

const VEHICLE_TYPES = ['Car', 'SUV', 'Motorcycle', 'Van'];

const Parking = () => {
  const [spaces, setSpaces] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [newSpaceModalOpen, setNewSpaceModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [assignForm, setAssignForm] = useState({
    guestName: '',
    vehicleNumber: '',
    vehicleType: 'Car',
    status: 'Occupied',
    entryTime: new Date().toISOString().slice(0, 16),
  });

  const [newSpaceName, setNewSpaceName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [parkingRes, guestsRes] = await Promise.all([
        getParking(),
        getGuests().catch(() => ({ data: [] })),
      ]);
      setSpaces(parkingRes.data || []);
      setGuests(guestsRes.data || []);
    } catch (err) {
      toast.error('Failed to load parking spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = (space) => {
    setSelectedSpace(space);
    setAssignForm({
      guestName: space.guestName || '',
      vehicleNumber: space.vehicleNumber || '',
      vehicleType: space.vehicleType || 'Car',
      status: space.status === 'Available' ? 'Occupied' : space.status,
      entryTime: space.entryTime ? new Date(space.entryTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    });
    setAssignModalOpen(true);
  };

  const handleSaveAssign = async (e) => {
    e.preventDefault();
    if (!selectedSpace) return;
    setSubmitting(true);
    try {
      const payload = {
        guestName: assignForm.guestName,
        vehicleNumber: assignForm.vehicleNumber,
        vehicleType: assignForm.vehicleType,
        status: assignForm.status,
        entryTime: assignForm.entryTime ? new Date(assignForm.entryTime) : new Date(),
      };
      await updateParking(selectedSpace._id, payload);
      toast.success(`Space ${selectedSpace.space} updated successfully`);
      setAssignModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to update parking space');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReleaseSpace = async (space) => {
    if (!window.confirm(`Release parking space ${space.space}? This will mark it as Available.`)) return;
    try {
      await updateParking(space._id, {
        status: 'Available',
        guestName: '',
        vehicleNumber: '',
        vehicleType: 'Car',
        exitTime: new Date(),
      });
      toast.success(`Space ${space.space} is now Available`);
      fetchData();
    } catch (err) {
      toast.error('Failed to release space');
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    setSubmitting(true);
    try {
      await createParking({
        space: newSpaceName.trim().toUpperCase(),
        status: 'Available',
      });
      toast.success(`Space ${newSpaceName.trim().toUpperCase()} added`);
      setNewSpaceModalOpen(false);
      setNewSpaceName('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add space');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSpace = async (space) => {
    if (!window.confirm(`Delete parking bay ${space.space}?`)) return;
    try {
      await deleteParking(space._id);
      toast.success(`Space ${space.space} deleted`);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete space');
    }
  };

  // Filter & Search
  const filteredSpaces = spaces.filter((item) => {
    const matchesFilter = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      item.space.toLowerCase().includes(search.toLowerCase()) ||
      (item.guestName && item.guestName.toLowerCase().includes(search.toLowerCase())) ||
      (item.vehicleNumber && item.vehicleNumber.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalSpaces = spaces.length;
  const occupiedCount = spaces.filter((s) => s.status === 'Occupied').length;
  const availableCount = spaces.filter((s) => s.status === 'Available').length;
  const reservedCount = spaces.filter((s) => s.status === 'Reserved').length;
  const occupancyRate = totalSpaces ? Math.round((occupiedCount / totalSpaces) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Parking Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor hotel parking bays, assigned guest vehicles, and valet operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewSpaceModalOpen(true)}
            className="btn-secondary text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Bay
          </button>
          <button
            onClick={() => handleOpenAssign(spaces.find((s) => s.status === 'Available') || spaces[0])}
            disabled={spaces.length === 0}
            className="btn-primary text-sm shadow-sm shadow-primary/20"
          >
            <Car className="w-4 h-4" />
            Assign Vehicle
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Bays</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalSpaces}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Capacity</p>
          </div>
        </div>

        <div className="card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{availableCount}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Ready for guests</p>
          </div>
        </div>

        <div className="card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#4169D8] flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Occupied</p>
            <p className="text-2xl font-bold text-[#4169D8] mt-0.5">{occupiedCount}</p>
            <p className="text-[11px] text-blue-600/80 mt-0.5">{occupancyRate}% Occupancy</p>
          </div>
        </div>

        <div className="card border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reserved</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{reservedCount}</p>
            <p className="text-[11px] text-amber-600/80 mt-0.5">VIP &amp; Arrivals</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border border-gray-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Pills */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl gap-1 w-full md:w-auto overflow-x-auto">
            {['All', 'Available', 'Occupied', 'Reserved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search space, plate, guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid' ? 'bg-white text-primary shadow-sm font-semibold' : 'text-gray-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-white text-primary shadow-sm font-semibold' : 'text-gray-500'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={fetchData}
            title="Refresh"
            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredSpaces.length === 0 ? (
        <div className="card text-center py-16 border border-dashed border-gray-200">
          <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-700">No parking spaces match your filter</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add new parking bays.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Parking Bay Interactive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredSpaces.map((space) => {
            const isAvailable = space.status === 'Available';
            const isOccupied = space.status === 'Occupied';
            const isReserved = space.status === 'Reserved';

            return (
              <div
                key={space._id}
                className={`card border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                  isAvailable
                    ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                    : isOccupied
                    ? 'border-blue-200 bg-white hover:border-blue-400'
                    : 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                }`}
              >
                {/* Space Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-900 text-white font-mono text-xs font-bold rounded-lg tracking-wider">
                      {space.space}
                    </span>
                    <StatusBadge status={space.status} />
                  </div>

                  {/* Vehicle & Guest Details */}
                  {isAvailable ? (
                    <div className="py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-emerald-700">Empty Bay</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Ready for check-in</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#4169D8] flex items-center justify-center flex-shrink-0">
                          <Car className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate font-mono">
                            {space.vehicleNumber || 'No Plate'}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {space.vehicleType || 'Car'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-2.5 text-xs border border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase font-semibold">Guest</p>
                        <p className="font-semibold text-gray-800 truncate">
                          {space.guestName || 'Registered Guest'}
                        </p>
                        {space.entryTime && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              Parked: {new Date(space.entryTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between gap-1">
                  {isAvailable ? (
                    <button
                      onClick={() => handleOpenAssign(space)}
                      className="w-full py-1.5 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Assign
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenAssign(space)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Space"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReleaseSpace(space)}
                        className="flex-1 py-1 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                        title="Release Bay"
                      >
                        <LogOut className="w-3 h-3" />
                        Release
                      </button>
                      <button
                        onClick={() => handleDeleteSpace(space)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Bay"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="card p-0 overflow-hidden border border-gray-100">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bay No.</th>
                  <th>Status</th>
                  <th>Vehicle Plate</th>
                  <th>Type</th>
                  <th>Guest Name</th>
                  <th>Parked Since</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpaces.map((space) => (
                  <tr key={space._id}>
                    <td>
                      <span className="font-mono font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                        {space.space}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={space.status} />
                    </td>
                    <td className="font-mono text-xs font-semibold text-gray-800">
                      {space.vehicleNumber || '—'}
                    </td>
                    <td>{space.vehicleType || '—'}</td>
                    <td className="font-medium text-gray-800">
                      {space.guestName || (space.status === 'Available' ? 'Available' : 'Unspecified')}
                    </td>
                    <td className="text-xs text-gray-500">
                      {space.entryTime
                        ? new Date(space.entryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenAssign(space)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {space.status !== 'Available' && (
                          <button
                            onClick={() => handleReleaseSpace(space)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium"
                          >
                            Release
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSpace(space)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
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

      {/* Assign / Edit Parking Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={selectedSpace ? `Parking Bay ${selectedSpace.space}` : 'Assign Parking'}
      >
        <form onSubmit={handleSaveAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={assignForm.status}
              onChange={(e) => setAssignForm({ ...assignForm, status: e.target.value })}
              className="input-field"
            >
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Available">Available (Empty)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Guest Name</label>
            <div className="relative">
              <input
                type="text"
                list="guest-names"
                placeholder="Select or enter guest name"
                value={assignForm.guestName}
                onChange={(e) => setAssignForm({ ...assignForm, guestName: e.target.value })}
                className="input-field"
              />
              <datalist id="guest-names">
                {guests.map((g) => (
                  <option key={g._id} value={g.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle License Plate</label>
              <input
                type="text"
                placeholder="e.g. NY-ABC-1234"
                value={assignForm.vehicleNumber}
                onChange={(e) => setAssignForm({ ...assignForm, vehicleNumber: e.target.value.toUpperCase() })}
                className="input-field font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={assignForm.vehicleType}
                onChange={(e) => setAssignForm({ ...assignForm, vehicleType: e.target.value })}
                className="input-field"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Entry Timestamp</label>
            <input
              type="datetime-local"
              value={assignForm.entryTime}
              onChange={(e) => setAssignForm({ ...assignForm, entryTime: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm shadow-sm"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Bay Modal */}
      <Modal
        isOpen={newSpaceModalOpen}
        onClose={() => setNewSpaceModalOpen(false)}
        title="Add Parking Bay"
      >
        <form onSubmit={handleCreateSpace} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Bay Identifier Code</label>
            <input
              type="text"
              placeholder="e.g. P-11, B-04, VIP-1"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              className="input-field font-mono uppercase"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">Unique parking space identifier number or code.</p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setNewSpaceModalOpen(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm"
            >
              {submitting ? 'Adding...' : 'Create Space'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Parking;
