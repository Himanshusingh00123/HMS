import { createContext, useContext, useState, useEffect } from 'react';
import { hotelStore } from '../services/hotelStore';
import toast from 'react-hot-toast';

const HotelContext = createContext(null);

export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState(() => hotelStore.getRooms());
  const [bookings, setBookings] = useState(() => hotelStore.getBookings());
  const [guests, setGuests] = useState(() => hotelStore.getGuests());
  const [payments, setPayments] = useState(() => hotelStore.getPayments());
  const [settings, setSettings] = useState(() => hotelStore.getSettings());
  const [stats, setStats] = useState(() => hotelStore.getComputedStats());

  // Quick book modal state accessible from any page / header
  const [quickBookOpen, setQuickBookOpen] = useState(false);

  // Recompute stats whenever rooms, bookings, or payments change
  const refreshStats = () => {
    setStats(hotelStore.getComputedStats());
  };

  // Rooms CRUD
  const addRoom = (roomData) => {
    const newRoom = hotelStore.addRoom(roomData);
    const updated = hotelStore.getRooms();
    setRooms(updated);
    refreshStats();
    toast.success(`Room ${newRoom.roomNumber} added successfully! 🛏️`);
    return newRoom;
  };

  const updateRoom = (id, fields) => {
    const updated = hotelStore.updateRoom(id, fields);
    setRooms(hotelStore.getRooms());
    refreshStats();
    toast.success('Room updated successfully!');
    return updated;
  };

  const deleteRoom = (id) => {
    const remaining = hotelStore.deleteRoom(id);
    setRooms(remaining);
    refreshStats();
    toast.success('Room deleted successfully.');
    return remaining;
  };

  // Bookings CRUD
  const addBooking = (bookingData) => {
    const newBooking = hotelStore.addBooking(bookingData);
    setBookings(hotelStore.getBookings());
    setRooms(hotelStore.getRooms());
    setGuests(hotelStore.getGuests());
    setPayments(hotelStore.getPayments());
    refreshStats();
    toast.success(`Booking ${newBooking.id} created! 🎉`);
    return newBooking;
  };

  const updateBookingStatus = (id, newStatus) => {
    const updated = hotelStore.updateBookingStatus(id, newStatus);
    setBookings(hotelStore.getBookings());
    setRooms(hotelStore.getRooms());
    refreshStats();
    toast.success(`Booking status changed to "${newStatus}"`);
    return updated;
  };

  const deleteBooking = (id) => {
    const remaining = hotelStore.deleteBooking(id);
    setBookings(remaining);
    refreshStats();
    toast.success('Booking deleted.');
    return remaining;
  };

  // Guests CRUD
  const addGuest = (guestData) => {
    const newGuest = hotelStore.addGuest(guestData);
    setGuests(hotelStore.getGuests());
    toast.success(`Guest ${newGuest.name} registered! 👤`);
    return newGuest;
  };

  const updateGuest = (id, fields) => {
    const updated = hotelStore.updateGuest(id, fields);
    setGuests(hotelStore.getGuests());
    toast.success('Guest details updated.');
    return updated;
  };

  const deleteGuest = (id) => {
    const remaining = hotelStore.deleteGuest(id);
    setGuests(remaining);
    toast.success('Guest removed.');
    return remaining;
  };

  // Payments CRUD
  const addPayment = (paymentData) => {
    const newPayment = hotelStore.addPayment(paymentData);
    setPayments(hotelStore.getPayments());
    refreshStats();
    toast.success(`Payment of $${newPayment.amount} recorded! 💳`);
    return newPayment;
  };

  const updatePaymentStatus = (id, newStatus) => {
    const updated = hotelStore.updatePaymentStatus(id, newStatus);
    setPayments(hotelStore.getPayments());
    refreshStats();
    toast.success(`Payment updated to ${newStatus}.`);
    return updated;
  };

  // Settings
  const updateSettings = (newSettings) => {
    hotelStore.saveSettings(newSettings);
    setSettings(newSettings);
    toast.success('Settings updated!');
  };

  // Reset to Demo Data
  const resetDemoData = () => {
    hotelStore.resetDemoData();
    setRooms(hotelStore.getRooms());
    setBookings(hotelStore.getBookings());
    setGuests(hotelStore.getGuests());
    setPayments(hotelStore.getPayments());
    setSettings(hotelStore.getSettings());
    refreshStats();
    toast.success('Reset to demo data completed! ✨');
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        bookings,
        guests,
        payments,
        settings,
        stats,
        quickBookOpen,
        setQuickBookOpen,
        addRoom,
        updateRoom,
        deleteRoom,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addGuest,
        updateGuest,
        deleteGuest,
        addPayment,
        updatePaymentStatus,
        updateSettings,
        resetDemoData,
        refreshStats,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) throw new Error('useHotel must be used within HotelProvider');
  return context;
};
