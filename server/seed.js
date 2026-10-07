const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Guest = require('./models/Guest');
const Room = require('./models/Room');
const Reservation = require('./models/Reservation');
const Food = require('./models/Food');
const Order = require('./models/Order');
const Housekeeping = require('./models/Housekeeping');
const Parking = require('./models/Parking');
const Message = require('./models/Message');

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
];

const FOOD_IMAGES = {
  Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
  Pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop',
  Desserts: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&h=200&fit=crop',
  Drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
  Burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
  'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
  Salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
  Seafood: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=200&fit=crop',
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Guest.deleteMany({}),
      Room.deleteMany({}),
      Reservation.deleteMany({}),
      Food.deleteMany({}),
      Order.deleteMany({}),
      Housekeeping.deleteMany({}),
      Parking.deleteMany({}),
      Message.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Users
    await User.create([
      { name: 'John Abraham', email: 'admin@oasis.com', password: 'admin123', role: 'admin', phone: '+1-555-0001' },
      { name: 'Sarah Staff', email: 'staff@oasis.com', password: 'staff123', role: 'staff', phone: '+1-555-0002' },
    ]);
    console.log('👤 Users created');

    // Guests
    const guests = await Guest.create([
      { name: 'Alice Johnson', email: 'alice.j@email.com', phone: '+1-555-1001', country: 'USA', status: 'VIP', totalSpent: 4200, totalStays: 5 },
      { name: 'Michael Brown', email: 'michael.b@email.com', phone: '+1-555-1002', country: 'UK', status: 'Active', totalSpent: 1800, totalStays: 2 },
      { name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1-555-1003', country: 'Canada', status: 'Active', totalSpent: 960, totalStays: 1 },
      { name: 'John Doe', email: 'john.doe@email.com', phone: '+1-555-1004', country: 'USA', status: 'Active', totalSpent: 540, totalStays: 1 },
      { name: 'Jane Smith', email: 'jane.s@email.com', phone: '+1-555-1005', country: 'Australia', status: 'VIP', totalSpent: 6500, totalStays: 8 },
      { name: 'David Wilson', email: 'david.w@email.com', phone: '+1-555-1006', country: 'Germany', status: 'Active', totalSpent: 720, totalStays: 1 },
      { name: 'Lisa Martinez', email: 'lisa.m@email.com', phone: '+1-555-1007', country: 'France', status: 'Active', totalSpent: 1200, totalStays: 2 },
      { name: 'Robert Chen', email: 'robert.c@email.com', phone: '+1-555-1008', country: 'China', status: 'Active', totalSpent: 2400, totalStays: 3 },
      { name: 'Sarah Patel', email: 'sarah.p@email.com', phone: '+1-555-1009', country: 'India', status: 'Active', totalSpent: 840, totalStays: 1 },
      { name: 'Tom Anderson', email: 'tom.a@email.com', phone: '+1-555-1010', country: 'USA', status: 'Inactive', totalSpent: 360, totalStays: 1 },
      { name: 'Maria Garcia', email: 'maria.g@email.com', phone: '+1-555-1011', country: 'Spain', status: 'Active', totalSpent: 1560, totalStays: 2 },
      { name: 'James Taylor', email: 'james.t@email.com', phone: '+1-555-1012', country: 'UK', status: 'VIP', totalSpent: 9200, totalStays: 12 },
    ]);
    console.log('👥 Guests created');

    // Rooms
    const rooms = await Room.create([
      { roomNumber: '101', type: 'Standard', price: 89, capacity: 2, floor: 1, amenities: ['WiFi', 'AC', 'TV'], image: ROOM_IMAGES[0], status: 'Available', description: 'Comfortable standard room with city view.' },
      { roomNumber: '102', type: 'Standard', price: 89, capacity: 2, floor: 1, amenities: ['WiFi', 'AC', 'TV'], image: ROOM_IMAGES[0], status: 'Cleaning' },
      { roomNumber: '103', type: 'Single', price: 69, capacity: 1, floor: 1, amenities: ['WiFi', 'AC', 'TV'], image: ROOM_IMAGES[1], status: 'Available' },
      { roomNumber: '201', type: 'Deluxe', price: 149, capacity: 2, floor: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], image: ROOM_IMAGES[1], status: 'Occupied', description: 'Deluxe room with panoramic views and premium amenities.' },
      { roomNumber: '202', type: 'Deluxe', price: 149, capacity: 2, floor: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], image: ROOM_IMAGES[2], status: 'Available' },
      { roomNumber: '203', type: 'Double', price: 119, capacity: 4, floor: 2, amenities: ['WiFi', 'AC', 'TV', 'Bathtub'], image: ROOM_IMAGES[2], status: 'Occupied' },
      { roomNumber: '204', type: 'Deluxe', price: 180, capacity: 2, floor: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], image: ROOM_IMAGES[3], status: 'Available', description: 'Premium deluxe room with jacuzzi and city skyline view.' },
      { roomNumber: '301', type: 'Suite', price: 299, capacity: 4, floor: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Kitchen'], image: ROOM_IMAGES[3], status: 'Occupied', description: 'Luxury suite with living area and private balcony.' },
      { roomNumber: '302', type: 'Suite', price: 349, capacity: 4, floor: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Kitchen', 'Balcony'], image: ROOM_IMAGES[4], status: 'Available' },
      { roomNumber: '303', type: 'Family', price: 229, capacity: 6, floor: 3, amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Extra Beds'], image: ROOM_IMAGES[5], status: 'Available', description: 'Spacious family room with 3 bedrooms.' },
      { roomNumber: '401', type: 'Suite', price: 449, capacity: 2, floor: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Kitchen', 'Balcony', 'Butler'], image: ROOM_IMAGES[4], status: 'Maintenance' },
      { roomNumber: '402', type: 'Deluxe', price: 169, capacity: 2, floor: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], image: ROOM_IMAGES[5], status: 'Available' },
      { roomNumber: '403', type: 'Standard', price: 95, capacity: 2, floor: 4, amenities: ['WiFi', 'AC', 'TV'], image: ROOM_IMAGES[0], status: 'Occupied' },
      { roomNumber: '501', type: 'Family', price: 249, capacity: 6, floor: 5, amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Extra Beds', 'Balcony'], image: ROOM_IMAGES[5], status: 'Available' },
      { roomNumber: '502', type: 'Suite', price: 399, capacity: 2, floor: 5, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony'], image: ROOM_IMAGES[3], status: 'Available' },
    ]);
    console.log('🏨 Rooms created');

    // Reservations
    const today = new Date();
    const addDays = (d, n) => { const nd = new Date(d); nd.setDate(nd.getDate() + n); return nd; };

    const reservations = await Reservation.create([
      { guest: guests[0]._id, room: rooms[3]._id, checkIn: addDays(today, -2), checkOut: addDays(today, 2), guests: 2, totalAmount: 596, paymentStatus: 'Paid', status: 'Checked-in', specialRequest: 'Late check-out please' },
      { guest: guests[1]._id, room: rooms[5]._id, checkIn: addDays(today, -1), checkOut: addDays(today, 3), guests: 4, totalAmount: 476, paymentStatus: 'Paid', status: 'Checked-in' },
      { guest: guests[2]._id, room: rooms[7]._id, checkIn: addDays(today, -3), checkOut: addDays(today, 1), guests: 3, totalAmount: 897, paymentStatus: 'Paid', status: 'Checked-in' },
      { guest: guests[3]._id, room: rooms[6]._id, checkIn: today, checkOut: addDays(today, 3), guests: 2, totalAmount: 540, paymentStatus: 'Pending', status: 'Confirmed' },
      { guest: guests[4]._id, room: rooms[8]._id, checkIn: addDays(today, 2), checkOut: addDays(today, 7), guests: 2, totalAmount: 1745, paymentStatus: 'Paid', status: 'Confirmed' },
      { guest: guests[5]._id, room: rooms[1]._id, checkIn: addDays(today, -5), checkOut: addDays(today, -2), guests: 2, totalAmount: 267, paymentStatus: 'Paid', status: 'Checked-out' },
      { guest: guests[6]._id, room: rooms[0]._id, checkIn: addDays(today, 1), checkOut: addDays(today, 4), guests: 2, totalAmount: 267, paymentStatus: 'Pending', status: 'Pending' },
      { guest: guests[7]._id, room: rooms[9]._id, checkIn: addDays(today, -1), checkOut: addDays(today, 4), guests: 5, totalAmount: 1145, paymentStatus: 'Paid', status: 'Checked-in' },
      { guest: guests[8]._id, room: rooms[11]._id, checkIn: addDays(today, 3), checkOut: addDays(today, 6), guests: 2, totalAmount: 507, paymentStatus: 'Pending', status: 'Confirmed' },
      { guest: guests[9]._id, room: rooms[2]._id, checkIn: addDays(today, -7), checkOut: addDays(today, -4), guests: 1, totalAmount: 207, paymentStatus: 'Paid', status: 'Checked-out' },
      { guest: guests[10]._id, room: rooms[12]._id, checkIn: today, checkOut: addDays(today, 2), guests: 2, totalAmount: 190, paymentStatus: 'Pending', status: 'Confirmed' },
      { guest: guests[11]._id, room: rooms[14]._id, checkIn: addDays(today, 5), checkOut: addDays(today, 10), guests: 2, totalAmount: 1995, paymentStatus: 'Paid', status: 'Confirmed' },
    ]);
    console.log('📅 Reservations created');

    // Foods
    const foods = await Food.create([
      { name: 'Margherita Pizza', category: 'Pizza', price: 15.95, rating: 4.8, image: FOOD_IMAGES.Pizza, description: 'Classic pizza with fresh tomato sauce and mozzarella' },
      { name: 'BBQ Chicken Pizza', category: 'Pizza', price: 18.95, rating: 4.6, image: FOOD_IMAGES.Pizza, description: 'Smoky BBQ chicken with caramelized onions' },
      { name: 'Carbonara Pasta', category: 'Pasta', price: 16.95, rating: 4.7, image: FOOD_IMAGES.Pasta, description: 'Creamy pasta with pancetta and parmesan' },
      { name: 'Vegetarian Pasta', category: 'Pasta', price: 14.95, rating: 4.5, image: FOOD_IMAGES.Pasta, description: 'Fresh garden vegetables in olive oil and herbs' },
      { name: 'Chocolate Lava Cake', category: 'Desserts', price: 9.95, rating: 4.9, image: FOOD_IMAGES.Desserts, description: 'Warm chocolate cake with molten center' },
      { name: 'Tiramisu', category: 'Desserts', price: 8.95, rating: 4.8, image: FOOD_IMAGES.Desserts, description: 'Traditional Italian mascarpone dessert' },
      { name: 'Fresh Lemonade', category: 'Drinks', price: 5.95, rating: 4.6, image: FOOD_IMAGES.Drinks, description: 'Freshly squeezed with mint' },
      { name: 'Tropical Smoothie', category: 'Drinks', price: 7.95, rating: 4.7, image: FOOD_IMAGES.Drinks, description: 'Mango, pineapple and coconut blend' },
      { name: 'Classic Beef Burger', category: 'Burger', price: 16.95, rating: 4.7, image: FOOD_IMAGES.Burger, description: 'Juicy beef patty with lettuce, tomato and special sauce' },
      { name: 'Grilled Salmon', category: 'Main Course', price: 28.95, rating: 4.8, image: FOOD_IMAGES['Main Course'], description: 'Atlantic salmon with lemon butter sauce' },
      { name: 'Beef Tenderloin', category: 'Main Course', price: 34.95, rating: 4.9, image: FOOD_IMAGES['Main Course'], description: 'Premium cut with mushroom sauce and truffle fries' },
      { name: 'Classic Caesar Salad', category: 'Salad', price: 12.95, rating: 4.6, image: FOOD_IMAGES.Salad, description: 'Romaine, croutons, parmesan and caesar dressing' },
      { name: 'Lobster Bisque', category: 'Seafood', price: 22.95, rating: 4.8, image: FOOD_IMAGES.Seafood, description: 'Creamy lobster soup with fresh herbs' },
    ]);
    console.log('🍽️  Foods created');

    // Orders
    await Order.create([
      { guestName: 'Alice Johnson', items: [{ name: 'Grilled Salmon', price: 28.95, quantity: 1 }, { name: 'Fresh Lemonade', price: 5.95, quantity: 2 }], totalAmount: 40.85, status: 'Delivered', roomNumber: '201' },
      { guestName: 'Michael Brown', items: [{ name: 'Beef Tenderloin', price: 34.95, quantity: 2 }], totalAmount: 69.90, status: 'Preparing', roomNumber: '203' },
      { guestName: 'Emily Davis', items: [{ name: 'Margherita Pizza', price: 15.95, quantity: 1 }, { name: 'Tiramisu', price: 8.95, quantity: 1 }], totalAmount: 24.90, status: 'Ready', roomNumber: '301' },
      { guestName: 'Robert Chen', items: [{ name: 'Classic Beef Burger', price: 16.95, quantity: 2 }, { name: 'Tropical Smoothie', price: 7.95, quantity: 2 }], totalAmount: 49.80, status: 'New', roomNumber: '303' },
      { guestName: 'Jane Smith', items: [{ name: 'Lobster Bisque', price: 22.95, quantity: 1 }], totalAmount: 22.95, status: 'Delivered', roomNumber: '302' },
    ]);
    console.log('📦 Orders created');

    // Housekeeping
    await Housekeeping.create([
      { room: rooms[1]._id, assignedTo: 'Maria Lopez', status: 'Dirty', priority: 'High', lastCleaned: addDays(today, -1) },
      { room: rooms[3]._id, assignedTo: 'James Cook', status: 'Cleaning', priority: 'Medium', lastCleaned: addDays(today, -2) },
      { room: rooms[5]._id, assignedTo: 'Anna White', status: 'Inspected', priority: 'Low', lastCleaned: today },
      { room: rooms[7]._id, assignedTo: 'Carlos Rodriguez', status: 'Clean', priority: 'Low', lastCleaned: today },
      { room: rooms[10]._id, assignedTo: 'Unassigned', status: 'Maintenance', priority: 'Urgent', notes: 'AC unit malfunction' },
      { room: rooms[0]._id, assignedTo: 'Maria Lopez', status: 'Clean', priority: 'Low', lastCleaned: today },
      { room: rooms[2]._id, assignedTo: 'Anna White', status: 'Dirty', priority: 'Medium', lastCleaned: addDays(today, -3) },
      { room: rooms[4]._id, assignedTo: 'James Cook', status: 'Cleaning', priority: 'High' },
    ]);
    console.log('🧹 Housekeeping tasks created');

    // Parking
    await Parking.create([
      { space: 'P-01', status: 'Available' },
      { space: 'P-02', guestName: 'Alice Johnson', vehicleNumber: 'NY-ABC-1234', vehicleType: 'Car', entryTime: addDays(today, -2), status: 'Occupied' },
      { space: 'P-03', guestName: 'Michael Brown', vehicleNumber: 'LA-XYZ-5678', vehicleType: 'SUV', entryTime: addDays(today, -1), status: 'Occupied' },
      { space: 'P-04', status: 'Available' },
      { space: 'P-05', guestName: 'Emily Davis', vehicleNumber: 'TX-DEF-9012', vehicleType: 'Car', entryTime: today, status: 'Occupied' },
      { space: 'P-06', status: 'Reserved' },
      { space: 'P-07', guestName: 'Robert Chen', vehicleNumber: 'FL-GHI-3456', vehicleType: 'Car', entryTime: addDays(today, -1), status: 'Occupied' },
      { space: 'P-08', status: 'Available' },
      { space: 'P-09', status: 'Available' },
      { space: 'P-10', guestName: 'Jane Smith', vehicleNumber: 'CA-JKL-7890', vehicleType: 'Van', entryTime: addDays(today, -3), status: 'Occupied' },
    ]);
    console.log('🚗 Parking created');

    // Messages
    const conversations = [
      { id: 'conv-alice', name: 'Alice Johnson', avatar: '' },
      { id: 'conv-michael', name: 'Michael Brown', avatar: '' },
      { id: 'conv-emily', name: 'Emily Davis', avatar: '' },
      { id: 'conv-john', name: 'John Doe', avatar: '' },
      { id: 'conv-jane', name: 'Jane Smith', avatar: '' },
    ];

    const msgData = [
      { conv: 0, isGuest: true, msg: "Hi, I'd like to request a late check-out if possible?" },
      { conv: 0, isGuest: false, msg: "Of course! We can extend your check-out to 2 PM at no extra charge." },
      { conv: 0, isGuest: true, msg: "That's wonderful, thank you so much!" },
      { conv: 1, isGuest: true, msg: "Can I get extra towels and pillows for room 203?" },
      { conv: 1, isGuest: false, msg: "Absolutely! We'll send housekeeping right away." },
      { conv: 2, isGuest: true, msg: "Is the pool open today? What are the hours?" },
      { conv: 2, isGuest: false, msg: "Yes! The pool is open from 7 AM to 10 PM daily." },
      { conv: 2, isGuest: true, msg: "Great, thank you!" },
      { conv: 3, isGuest: true, msg: "I have a special dietary requirement. Can the restaurant accommodate?" },
      { conv: 3, isGuest: false, msg: "Yes, our chef can accommodate most dietary requirements. Please let us know your needs." },
      { conv: 4, isGuest: true, msg: "Could you arrange airport transfers for tomorrow morning?" },
      { conv: 4, isGuest: false, msg: "Of course! What time is your flight? We'll arrange a car for you." },
    ];

    await Message.create(
      msgData.map((m, i) => ({
        senderName: m.isGuest ? conversations[m.conv].name : 'Hotel Admin',
        receiverName: m.isGuest ? 'Hotel Admin' : conversations[m.conv].name,
        message: m.msg,
        isFromGuest: m.isGuest,
        conversationId: conversations[m.conv].id,
        read: !m.isGuest,
        createdAt: addDays(today, -Math.floor(i / 3)),
      }))
    );
    console.log('💬 Messages created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔐 Demo Credentials:');
    console.log('Admin → admin@oasis.com  / admin123');
    console.log('Staff → staff@oasis.com  / staff123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
