import { Bell, Search, Menu, ChevronDown, LogOut, Settings, Calendar, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { setQuickBookOpen, settings } = useHotel();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-[68px] bg-white/70 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-4 md:px-7 gap-4 flex-shrink-0 z-20">
      {/* Left: Mobile Toggle & Welcome / Hotel Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-teal-sidebar hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
            {settings?.hotelName || 'OASIS RESORT & SPA'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>{todayStr}</span>
          </div>
        </div>
      </div>

      {/* Center: Search pill */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-[#EEF3F5] rounded-full px-4 py-2 border border-transparent focus-within:border-gold/40 focus-within:bg-white transition-all shadow-xs">
        <Search className="w-4 h-4 text-teal-muted flex-shrink-0" />
        <input
          type="text"
          placeholder="Search rooms, bookings, or guest names..."
          className="bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none flex-1 min-w-0 font-medium"
        />
      </div>

      {/* Right Actions: Quick Book Button, Notification, Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuickBookOpen(true)}
          className="btn-gold hidden sm:flex text-xs py-2 px-4 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Booking</span>
        </button>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2.5 rounded-full bg-[#EEF3F5] hover:bg-gray-200/80 text-gray-600 transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-[#EEF3F5] hover:bg-gray-200/80 transition-all border border-gray-200/60"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&q=80"
              alt="Admin"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-gold"
            />
            <span className="text-xs font-bold text-gray-800 hidden sm:inline-block">
              {user?.name?.split(' ')[0] || 'Alex'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-xs font-bold text-gray-900">{user?.name || 'Alex Johnson'}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email || 'admin@oasis.com'}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/settings');
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-gold" />
                Hotel Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
