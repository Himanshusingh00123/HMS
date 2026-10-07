import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  X,
  Compass,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
  { to: '/rooms', icon: BedDouble, label: 'ROOMS' },
  { to: '/bookings', icon: CalendarCheck, label: 'BOOKINGS' },
  { to: '/guests', icon: Users, label: 'GUESTS' },
  { to: '/payments', icon: CreditCard, label: 'PAYMENTS' },
  { to: '/reports', icon: BarChart3, label: 'REPORTS' },
  { to: '/settings', icon: Settings, label: 'SETTINGS' },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const { settings } = useHotel();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onToggle}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-[240px] md:w-[250px]
          bg-teal-sidebar text-white flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          border-r border-teal-border/40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Hotel Brand Header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-teal-border/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider uppercase text-white block">
                  {settings?.hotelName?.split(' ')[0] || 'OASIS'}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gold font-bold block">
                  Hotel &amp; Suites
                </span>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="lg:hidden text-teal-muted hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Section */}
          <div className="px-6 py-5 flex flex-col items-center text-center border-b border-teal-border/30">
            <div className="relative mb-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&q=80"
                alt="Admin"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-gold shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-teal-sidebar" />
            </div>

            <h3 className="font-bold text-xs uppercase tracking-wider text-white">
              {user?.name || 'ALEX JOHNSON'}
            </h3>
            <p className="text-[11px] text-teal-muted mt-0.5 truncate max-w-[190px]">
              {user?.email || 'alex.johnson@gmail.com'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="py-4 px-3 space-y-1.5 flex-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-wider uppercase transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-white text-teal-sidebar shadow-md'
                      : 'text-teal-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-gold' : 'text-gold/80 group-hover:text-gold'
                      }`}
                    />
                    <span className="flex-1 truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-wider uppercase text-teal-muted hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200 mt-2 text-left"
            >
              <LogOut className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>LOGOUT</span>
            </button>
          </nav>
        </div>

        {/* Bottom Active Staff & Network Map Decor */}
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-teal-dark/60 border border-teal-border/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
              Active Staff
            </span>
            <span className="text-[9px] text-teal-muted">Floor Duty</span>
          </div>

          {/* Overlapping Staff Avatars with +12 */}
          <div className="flex items-center -space-x-2 mb-3">
            <img
              className="w-7 h-7 rounded-full border border-teal-sidebar object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80"
              alt="Staff 1"
            />
            <img
              className="w-7 h-7 rounded-full border border-teal-sidebar object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
              alt="Staff 2"
            />
            <img
              className="w-7 h-7 rounded-full border border-teal-sidebar object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80"
              alt="Staff 3"
            />
            <div className="w-7 h-7 rounded-full bg-gold text-white font-bold text-[9px] flex items-center justify-center border border-teal-sidebar shadow-xs">
              +12
            </div>
          </div>

          {/* Dotted Hotel Floor/Network Graphic with Gold Arcs */}
          <div className="relative h-12 w-full overflow-hidden rounded-xl bg-teal-sidebar/70 p-1 flex items-center justify-center">
            {/* SVG Dot Map and Arc decoration */}
            <svg
              className="w-full h-full text-teal-border/60"
              viewBox="0 0 160 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dotted background pattern */}
              <pattern id="dot-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.8" fill="rgba(140, 165, 162, 0.35)" />
              </pattern>
              <rect width="160" height="50" fill="url(#dot-pattern)" />

              {/* Arcs connecting nodes */}
              <path
                d="M 25 35 Q 80 5 135 35"
                stroke="#C6922A"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                fill="none"
              />
              <circle cx="25" cy="35" r="3" fill="#C6922A" />
              <circle cx="135" cy="35" r="3" fill="#C6922A" />
              <circle cx="80" cy="18" r="2.5" fill="#D4A038" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] text-teal-muted font-mono tracking-wider">
                100% OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
