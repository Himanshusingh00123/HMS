import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HotelProvider, useHotel } from './context/HotelContext';

// Layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BookingModal from './components/BookingModal';

// Hotel Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Guests from './pages/Guests';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Inner Protected Layout with Full-Screen Dashboard Layout
const MainAppContainer = () => {
  const { user, loading } = useAuth();
  const { quickBookOpen, setQuickBookOpen } = useHotel();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#E5ECEF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-sidebar" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="h-screen w-screen flex bg-[#E5ECEF] overflow-hidden">
      {/* Left Dark Teal Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Full-Screen Dashboard Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#E5ECEF]">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Booking Modal */}
      <BookingModal isOpen={quickBookOpen} onClose={() => setQuickBookOpen(false)} />
    </div>
  );
};

// Public route wrapper
const PublicRoute = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <HotelProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                background: '#1B3636',
                color: '#fff',
              },
              success: { duration: 3000 },
              error: { duration: 4000 },
            }}
          />
          <Routes>
            {/* Public */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Hotel Management Routes */}
            <Route element={<MainAppContainer />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/reservations" element={<Bookings />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </HotelProvider>
    </AuthProvider>
  );
}

export default App;
