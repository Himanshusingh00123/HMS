import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  CreditCard,
  Search,
  Plus,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  X,
  TrendingUp,
  FileText,
} from 'lucide-react';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI / Online', 'Cash', 'Bank Transfer'];
const PAYMENT_STATUSES = ['Completed', 'Pending', 'Refunded'];

const emptyPaymentForm = {
  guest: '',
  bookingId: '',
  amount: 250,
  method: 'Credit Card',
  date: new Date().toISOString().split('T')[0],
  status: 'Completed',
};

const Payments = () => {
  const { payments, bookings, addPayment, updatePaymentStatus } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyPaymentForm);

  // Compute stats
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const completedAmount = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    const defaultBooking = bookings[0];
    setFormData({
      ...emptyPaymentForm,
      guest: defaultBooking?.guestName || '',
      bookingId: defaultBooking?.id || 'BK-1082',
      amount: defaultBooking?.totalAmount || 250,
    });
    setModalOpen(true);
  };

  const handleBookingSelect = (e) => {
    const bId = e.target.value;
    const found = bookings.find((b) => b.id === bId);
    if (found) {
      setFormData({
        ...formData,
        bookingId: found.id,
        guest: found.guestName,
        amount: found.totalAmount,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guest.trim()) {
      alert('Guest name is required');
      return;
    }

    addPayment(formData);
    setModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-green">Completed</span>;
      case 'Pending':
        return <span className="badge badge-gold">Pending</span>;
      case 'Refunded':
        return <span className="badge badge-red">Refunded</span>;
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
            Payments &amp; Billing
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Track guest room invoices, transaction methods, and settlement status
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-gold py-2.5 px-5 shadow-gold">
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Invoiced
            </p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">${totalAmount.toLocaleString()}</h4>
            <p className="text-[11px] text-teal-sidebar font-semibold mt-0.5">All transactions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Settled / Completed
            </p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">
              ${completedAmount.toLocaleString()}
            </h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Paid in full</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pending Collections
            </p>
            <h4 className="text-2xl font-black text-gold mt-1">${pendingAmount.toLocaleString()}</h4>
            <p className="text-[11px] text-gold font-semibold mt-0.5">Awaiting settlement</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payments Table Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 space-y-4">
        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 text-xs max-w-sm flex-1">
            <Search className="w-4 h-4 text-teal-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search payment ID, guest, or booking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-xs font-semibold text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              STATUS:
            </span>
            {['ALL', 'COMPLETED', 'PENDING', 'REFUNDED'].map((st) => (
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

        {/* Table: Payment ID, Guest, Booking ID, Amount, Payment method, Date, Status */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Guest</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id}>
                    {/* Payment ID */}
                    <td className="font-mono font-bold text-xs text-teal-sidebar">{p.id}</td>

                    {/* Guest */}
                    <td className="font-bold text-gray-900">{p.guest}</td>

                    {/* Booking ID */}
                    <td>
                      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {p.bookingId}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="font-black text-gray-900 text-sm">${p.amount}</td>

                    {/* Payment method */}
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <CreditCard className="w-3.5 h-3.5 text-gold" />
                        {p.method}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="text-xs font-medium text-gray-600">{p.date}</td>

                    {/* Status */}
                    <td>{getStatusBadge(p.status)}</td>

                    {/* Action */}
                    <td className="text-right">
                      <select
                        value={p.status}
                        onChange={(e) => updatePaymentStatus(p.id, e.target.value)}
                        className="bg-[#EEF3F5] hover:bg-gold hover:text-white text-gray-700 text-[11px] font-bold rounded-lg px-2.5 py-1 outline-none transition-colors cursor-pointer"
                      >
                        <option value="Completed" className="bg-white text-gray-900">
                          Completed
                        </option>
                        <option value="Pending" className="bg-white text-gray-900">
                          Pending
                        </option>
                        <option value="Refunded" className="bg-white text-gray-900">
                          Refunded
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-sidebar/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-teal-sidebar text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm tracking-wide">RECORD TRANSACTION</h3>
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
                  Associated Booking
                </label>
                <select
                  value={formData.bookingId}
                  onChange={handleBookingSelect}
                  className="input-field text-xs font-semibold bg-white"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} - {b.guestName} (${b.totalAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guest}
                  onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                  className="input-field text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field text-xs font-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="input-field text-xs font-semibold bg-white"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field text-xs font-semibold bg-white"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
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
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
