import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  User,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, updateSettings, resetDemoData } = useHotel();
  const { user } = useAuth();

  const [form, setForm] = useState({
    hotelName: settings?.hotelName || 'OASIS RESORT & SPA',
    tagline: settings?.tagline || 'Luxury Living & Hospitality',
    adminName: settings?.adminName || 'Alex Johnson',
    adminEmail: settings?.adminEmail || 'alex.johnson@gmail.com',
    adminRole: settings?.adminRole || 'General Hotel Manager',
    phone: settings?.phone || '+1 (800) 555-0199',
    address: settings?.address || '742 Evergreen Terrace, Palm Springs, CA',
    currency: settings?.currency || '$',
    taxRate: settings?.taxRate || 12,
    checkInTime: settings?.checkInTime || '14:00',
    checkOutTime: settings?.checkOutTime || '11:00',
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleReset = () => {
    if (window.confirm('Reset all rooms, bookings, guests, and payments to initial demo data?')) {
      resetDemoData();
      toast.success('System reset to demo data successfully! 🔄');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">
            System &amp; Hotel Settings
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure hotel information, currency, business policies, and demo presets
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Details Card */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase text-gray-900">Hotel Profile</h3>
              <p className="text-[11px] text-gray-400">Public hotel name and branding</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Hotel Name
            </label>
            <input
              type="text"
              value={form.hotelName}
              onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
              className="input-field text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="input-field text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Currency Symbol
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="input-field pl-10 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Hotel Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-field pl-10 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Operational & Admin Card */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase text-gray-900">Admin &amp; Operations</h3>
              <p className="text-[11px] text-gray-400">Check-in policies &amp; administrator details</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Check-in Standard Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={form.checkInTime}
                  onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                  className="input-field pl-10 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Check-out Standard Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={form.checkOutTime}
                  onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                  className="input-field pl-10 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Administrator Name
            </label>
            <input
              type="text"
              value={form.adminName}
              onChange={(e) => setForm({ ...form, adminName: e.target.value })}
              className="input-field text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                className="input-field pl-10 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
              className="input-field text-xs font-bold"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-gold py-2.5 px-7 shadow-gold">
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
