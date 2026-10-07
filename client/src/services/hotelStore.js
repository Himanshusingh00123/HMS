/**
 * hotelStore.js
 * 
 * Simple, beginner-friendly local storage data store for the Hotel Management System.
 * Pre-populates realistic sample data for rooms, bookings, guests, payments, and settings,
 * allowing full CRUD operations with persistent changes in the browser.
 */

const STORAGE_KEYS = {
  ROOMS: 'hms_rooms_v1',
  BOOKINGS: 'hms_bookings_v1',
  GUESTS: 'hms_guests_v1',
  PAYMENTS: 'hms_payments_v1',
  SETTINGS: 'hms_settings_v1',
};

// Initial sample rooms
const INITIAL_ROOMS = [
  {
    id: 'RM-101',
    roomNumber: '101',
    type: 'Deluxe Suite',
    price: 180,
    status: 'Occupied',
    guest: 'Sophia Loren',
    capacity: 2,
    floor: 1,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Ocean View'],
  },
  {
    id: 'RM-102',
    roomNumber: '102',
    type: 'Standard Room',
    price: 95,
    status: 'Available',
    guest: null,
    capacity: 2,
    floor: 1,
    amenities: ['WiFi', 'AC', 'TV'],
  },
  {
    id: 'RM-103',
    roomNumber: '103',
    type: 'Executive Suite',
    price: 240,
    status: 'Cleaning',
    guest: null,
    capacity: 3,
    floor: 1,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Work Desk'],
  },
  {
    id: 'RM-201',
    roomNumber: '201',
    type: 'Presidential Suite',
    price: 450,
    status: 'Occupied',
    guest: 'David Miller',
    capacity: 4,
    floor: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Butler Service'],
  },
  {
    id: 'RM-202',
    roomNumber: '202',
    type: 'Deluxe Suite',
    price: 190,
    status: 'Available',
    guest: null,
    capacity: 2,
    floor: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'City View'],
  },
  {
    id: 'RM-203',
    roomNumber: '203',
    type: 'Standard Room',
    price: 90,
    status: 'Available',
    guest: null,
    capacity: 2,
    floor: 2,
    amenities: ['WiFi', 'AC', 'TV'],
  },
  {
    id: 'RM-204',
    roomNumber: '204',
    type: 'Family Suite',
    price: 220,
    status: 'Maintenance',
    guest: null,
    capacity: 5,
    floor: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Kitchenette', 'Extra Beds'],
  },
  {
    id: 'RM-301',
    roomNumber: '301',
    type: 'Executive Suite',
    price: 250,
    status: 'Occupied',
    guest: 'Emma Watson',
    capacity: 3,
    floor: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'],
  },
  {
    id: 'RM-302',
    roomNumber: '302',
    type: 'Deluxe Suite',
    price: 185,
    status: 'Available',
    guest: null,
    capacity: 2,
    floor: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Balcony'],
  },
  {
    id: 'RM-303',
    roomNumber: '303',
    type: 'Standard Room',
    price: 99,
    status: 'Available',
    guest: null,
    capacity: 2,
    floor: 3,
    amenities: ['WiFi', 'AC', 'TV'],
  },
  {
    id: 'RM-304',
    roomNumber: '304',
    type: 'Deluxe Suite',
    price: 195,
    status: 'Occupied',
    guest: 'Robert Chen',
    capacity: 2,
    floor: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'King Bed'],
  },
  {
    id: 'RM-401',
    roomNumber: '401',
    type: 'Penthouse Suite',
    price: 520,
    status: 'Available',
    guest: null,
    capacity: 4,
    floor: 4,
    amenities: ['WiFi', 'AC', 'TV', 'Jacuzzi', 'Private Terrace', 'Cocktail Bar'],
  },
];

// Initial sample bookings
const INITIAL_BOOKINGS = [
  {
    id: 'BK-1082',
    guestName: 'Sophia Loren',
    phone: '+1 (555) 234-5678',
    email: 'sophia.loren@gmail.com',
    roomNumber: '101',
    roomType: 'Deluxe Suite',
    checkIn: '2026-10-06',
    checkOut: '2026-10-10',
    guestsCount: 2,
    paymentStatus: 'Paid',
    status: 'Checked-in',
    totalAmount: 720,
    createdAt: '2026-10-04',
  },
  {
    id: 'BK-1083',
    guestName: 'David Miller',
    phone: '+1 (555) 987-6543',
    email: 'david.m@outlook.com',
    roomNumber: '201',
    roomType: 'Presidential Suite',
    checkIn: '2026-10-07',
    checkOut: '2026-10-12',
    guestsCount: 3,
    paymentStatus: 'Paid',
    status: 'Checked-in',
    totalAmount: 2250,
    createdAt: '2026-10-05',
  },
  {
    id: 'BK-1084',
    guestName: 'Emma Watson',
    phone: '+1 (555) 456-7890',
    email: 'emma.w@gmail.com',
    roomNumber: '301',
    roomType: 'Executive Suite',
    checkIn: '2026-10-07',
    checkOut: '2026-10-09',
    guestsCount: 2,
    paymentStatus: 'Paid',
    status: 'Checked-in',
    totalAmount: 500,
    createdAt: '2026-10-06',
  },
  {
    id: 'BK-1085',
    guestName: 'Robert Chen',
    phone: '+1 (555) 321-7654',
    email: 'robert.chen@techcorp.com',
    roomNumber: '304',
    roomType: 'Deluxe Suite',
    checkIn: '2026-10-07',
    checkOut: '2026-10-11',
    guestsCount: 2,
    paymentStatus: 'Partial',
    status: 'Confirmed',
    totalAmount: 780,
    createdAt: '2026-10-07',
  },
  {
    id: 'BK-1086',
    guestName: 'Clara Oswald',
    phone: '+1 (555) 678-1234',
    email: 'clara.o@traveler.org',
    roomNumber: '202',
    roomType: 'Deluxe Suite',
    checkIn: '2026-10-09',
    checkOut: '2026-10-13',
    guestsCount: 2,
    paymentStatus: 'Pending',
    status: 'Confirmed',
    totalAmount: 760,
    createdAt: '2026-10-07',
  },
  {
    id: 'BK-1087',
    guestName: 'Marcus Aurelius',
    phone: '+1 (555) 876-5432',
    email: 'marcus.a@rome.net',
    roomNumber: '401',
    roomType: 'Penthouse Suite',
    checkIn: '2026-10-12',
    checkOut: '2026-10-16',
    guestsCount: 4,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    totalAmount: 2080,
    createdAt: '2026-10-06',
  },
  {
    id: 'BK-1081',
    guestName: 'James Wilson',
    phone: '+1 (555) 112-2334',
    email: 'jwilson@acme.com',
    roomNumber: '103',
    roomType: 'Executive Suite',
    checkIn: '2026-10-02',
    checkOut: '2026-10-06',
    guestsCount: 1,
    paymentStatus: 'Paid',
    status: 'Checked-out',
    totalAmount: 960,
    createdAt: '2026-10-01',
  },
];

// Initial sample guests
const INITIAL_GUESTS = [
  {
    id: 'GST-001',
    name: 'Sophia Loren',
    phone: '+1 (555) 234-5678',
    email: 'sophia.loren@gmail.com',
    room: '101',
    checkIn: '2026-10-06',
    checkOut: '2026-10-10',
    status: 'Active',
    totalStays: 3,
    country: 'Italy',
  },
  {
    id: 'GST-002',
    name: 'David Miller',
    phone: '+1 (555) 987-6543',
    email: 'david.m@outlook.com',
    room: '201',
    checkIn: '2026-10-07',
    checkOut: '2026-10-12',
    status: 'Active',
    totalStays: 5,
    country: 'United States',
  },
  {
    id: 'GST-003',
    name: 'Emma Watson',
    phone: '+1 (555) 456-7890',
    email: 'emma.w@gmail.com',
    room: '301',
    checkIn: '2026-10-07',
    checkOut: '2026-10-09',
    status: 'Active',
    totalStays: 2,
    country: 'United Kingdom',
  },
  {
    id: 'GST-004',
    name: 'Robert Chen',
    phone: '+1 (555) 321-7654',
    email: 'robert.chen@techcorp.com',
    room: '304',
    checkIn: '2026-10-07',
    checkOut: '2026-10-11',
    status: 'Active',
    totalStays: 4,
    country: 'Canada',
  },
  {
    id: 'GST-005',
    name: 'Clara Oswald',
    phone: '+1 (555) 678-1234',
    email: 'clara.o@traveler.org',
    room: '202 (Upcoming)',
    checkIn: '2026-10-09',
    checkOut: '2026-10-13',
    status: 'Upcoming',
    totalStays: 1,
    country: 'United Kingdom',
  },
  {
    id: 'GST-006',
    name: 'James Wilson',
    phone: '+1 (555) 112-2334',
    email: 'jwilson@acme.com',
    room: '103',
    checkIn: '2026-10-02',
    checkOut: '2026-10-06',
    status: 'Checked-out',
    totalStays: 6,
    country: 'Australia',
  },
];

// Initial sample payments
const INITIAL_PAYMENTS = [
  {
    id: 'PAY-701',
    guest: 'Sophia Loren',
    bookingId: 'BK-1082',
    amount: 720,
    method: 'Credit Card',
    date: '2026-10-06',
    status: 'Completed',
  },
  {
    id: 'PAY-702',
    guest: 'David Miller',
    bookingId: 'BK-1083',
    amount: 2250,
    method: 'Credit Card',
    date: '2026-10-07',
    status: 'Completed',
  },
  {
    id: 'PAY-703',
    guest: 'Emma Watson',
    bookingId: 'BK-1084',
    amount: 500,
    method: 'UPI / Online',
    date: '2026-10-07',
    status: 'Completed',
  },
  {
    id: 'PAY-704',
    guest: 'Robert Chen',
    bookingId: 'BK-1085',
    amount: 400,
    method: 'Debit Card',
    date: '2026-10-07',
    status: 'Completed',
  },
  {
    id: 'PAY-705',
    guest: 'Clara Oswald',
    bookingId: 'BK-1086',
    amount: 760,
    method: 'Credit Card',
    date: '2026-10-07',
    status: 'Pending',
  },
  {
    id: 'PAY-706',
    guest: 'Marcus Aurelius',
    bookingId: 'BK-1087',
    amount: 2080,
    method: 'Cash',
    date: '2026-10-06',
    status: 'Completed',
  },
  {
    id: 'PAY-700',
    guest: 'James Wilson',
    bookingId: 'BK-1081',
    amount: 960,
    method: 'Credit Card',
    date: '2026-10-02',
    status: 'Completed',
  },
];

// Initial hotel settings
const INITIAL_SETTINGS = {
  hotelName: 'OASIS RESORT & SPA',
  tagline: 'Luxury Living & Hospitality',
  adminName: 'Alex Johnson',
  adminEmail: 'alex.johnson@gmail.com',
  adminRole: 'General Hotel Manager',
  phone: '+1 (800) 555-0199',
  address: '742 Evergreen Terrace, Palm Springs, CA',
  currency: '$',
  taxRate: 12,
  checkInTime: '14:00',
  checkOutTime: '11:00',
};

// Helper to safely load data
const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
};

export const hotelStore = {
  // Get all rooms
  getRooms() {
    return getStored(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  },

  // Save rooms
  saveRooms(rooms) {
    setStored(STORAGE_KEYS.ROOMS, rooms);
    return rooms;
  },

  // Add room
  addRoom(roomData) {
    const rooms = this.getRooms();
    const newRoom = {
      ...roomData,
      id: `RM-${roomData.roomNumber || Date.now()}`,
      status: roomData.status || 'Available',
      guest: roomData.status === 'Occupied' ? roomData.guest : null,
      amenities: roomData.amenities || ['WiFi', 'AC'],
      price: Number(roomData.price) || 100,
      capacity: Number(roomData.capacity) || 2,
      floor: Number(roomData.floor) || 1,
    };
    const updated = [newRoom, ...rooms];
    this.saveRooms(updated);
    return newRoom;
  },

  // Update room
  updateRoom(id, updatedFields) {
    const rooms = this.getRooms();
    const updated = rooms.map((r) =>
      r.id === id || r.roomNumber === id ? { ...r, ...updatedFields } : r
    );
    this.saveRooms(updated);
    return updated.find((r) => r.id === id || r.roomNumber === id);
  },

  // Delete room
  deleteRoom(id) {
    const rooms = this.getRooms();
    const filtered = rooms.filter((r) => r.id !== id && r.roomNumber !== id);
    this.saveRooms(filtered);
    return filtered;
  },

  // Get Bookings
  getBookings() {
    return getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  // Save Bookings
  saveBookings(bookings) {
    setStored(STORAGE_KEYS.BOOKINGS, bookings);
    return bookings;
  },

  // Add Booking
  addBooking(bookingData) {
    const bookings = this.getBookings();
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id,
      ...bookingData,
      totalAmount: Number(bookingData.totalAmount) || 0,
      guestsCount: Number(bookingData.guestsCount) || 1,
      status: bookingData.status || 'Confirmed',
      paymentStatus: bookingData.paymentStatus || 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newBooking, ...bookings];
    this.saveBookings(updated);

    // If booked, mark the room as occupied and assign guest name
    if (bookingData.roomNumber) {
      this.updateRoom(bookingData.roomNumber, {
        status: newBooking.status === 'Checked-in' ? 'Occupied' : 'Occupied',
        guest: newBooking.guestName,
      });
    }

    // Automatically register or update the guest in guest list
    this.addOrUpdateGuestFromBooking(newBooking);

    // If payment was recorded as Paid, add to payments list
    if (newBooking.paymentStatus === 'Paid') {
      this.addPayment({
        guest: newBooking.guestName,
        bookingId: newBooking.id,
        amount: newBooking.totalAmount,
        method: 'Credit Card',
        status: 'Completed',
      });
    }

    return newBooking;
  },

  // Update booking status
  updateBookingStatus(id, newStatus) {
    const bookings = this.getBookings();
    const updated = bookings.map((b) => {
      if (b.id === id) {
        const item = { ...b, status: newStatus };
        // If checked-out, free up the room
        if (newStatus === 'Checked-out') {
          this.updateRoom(b.roomNumber, { status: 'Cleaning', guest: null });
        } else if (newStatus === 'Cancelled') {
          this.updateRoom(b.roomNumber, { status: 'Available', guest: null });
        } else if (newStatus === 'Checked-in') {
          this.updateRoom(b.roomNumber, { status: 'Occupied', guest: b.guestName });
        }
        return item;
      }
      return b;
    });
    this.saveBookings(updated);
    return updated.find((b) => b.id === id);
  },

  // Delete Booking
  deleteBooking(id) {
    const bookings = this.getBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    this.saveBookings(filtered);
    return filtered;
  },

  // Get Guests
  getGuests() {
    return getStored(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
  },

  // Save Guests
  saveGuests(guests) {
    setStored(STORAGE_KEYS.GUESTS, guests);
    return guests;
  },

  // Add Guest
  addGuest(guestData) {
    const guests = this.getGuests();
    const id = `GST-${String(guests.length + 1).padStart(3, '0')}`;
    const newGuest = {
      id,
      ...guestData,
      totalStays: 1,
      status: guestData.status || 'Active',
    };
    const updated = [newGuest, ...guests];
    this.saveGuests(updated);
    return newGuest;
  },

  addOrUpdateGuestFromBooking(booking) {
    const guests = this.getGuests();
    const existingIndex = guests.findIndex(
      (g) => g.email === booking.email || g.name?.toLowerCase() === booking.guestName?.toLowerCase()
    );
    if (existingIndex >= 0) {
      guests[existingIndex].room = booking.roomNumber;
      guests[existingIndex].checkIn = booking.checkIn;
      guests[existingIndex].checkOut = booking.checkOut;
      guests[existingIndex].totalStays = (guests[existingIndex].totalStays || 1) + 1;
      guests[existingIndex].status = 'Active';
      this.saveGuests(guests);
    } else {
      this.addGuest({
        name: booking.guestName,
        phone: booking.phone,
        email: booking.email || `${booking.guestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        room: booking.roomNumber,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: 'Active',
        country: 'Domestic',
      });
    }
  },

  // Update Guest
  updateGuest(id, updatedFields) {
    const guests = this.getGuests();
    const updated = guests.map((g) => (g.id === id ? { ...g, ...updatedFields } : g));
    this.saveGuests(updated);
    return updated.find((g) => g.id === id);
  },

  // Delete Guest
  deleteGuest(id) {
    const guests = this.getGuests();
    const filtered = guests.filter((g) => g.id !== id);
    this.saveGuests(filtered);
    return filtered;
  },

  // Get Payments
  getPayments() {
    return getStored(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  // Save Payments
  savePayments(payments) {
    setStored(STORAGE_KEYS.PAYMENTS, payments);
    return payments;
  },

  // Add Payment
  addPayment(paymentData) {
    const payments = this.getPayments();
    const id = `PAY-${Math.floor(700 + Math.random() * 900)}`;
    const newPayment = {
      id,
      ...paymentData,
      amount: Number(paymentData.amount) || 0,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      status: paymentData.status || 'Completed',
    };
    const updated = [newPayment, ...payments];
    this.savePayments(updated);
    return newPayment;
  },

  // Update Payment Status
  updatePaymentStatus(id, newStatus) {
    const payments = this.getPayments();
    const updated = payments.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    this.savePayments(updated);
    return updated.find((p) => p.id === id);
  },

  // Get Settings
  getSettings() {
    return getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  // Save Settings
  saveSettings(settings) {
    setStored(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // Compute live statistics for Dashboard & Reports
  getComputedStats() {
    const rooms = this.getRooms();
    const bookings = this.getBookings();
    const payments = this.getPayments();

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => r.status === 'Available').length;
    const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
    const cleaningRooms = rooms.filter((r) => r.status === 'Cleaning').length;
    const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;

    const todayDate = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter((b) => b.createdAt === todayDate || b.checkIn === todayDate).length || 4;

    const totalRevenue = payments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      todayBookings,
      totalRevenue,
      occupancyRate,
    };
  },

  // Reset to initial demo data
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  },
};
