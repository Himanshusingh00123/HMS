# 🏥 MedCare - Hospital Management System

A complete, beginner-friendly Hospital Management System built with the **MERN Stack**.

---

## 🚀 Features

- ✅ JWT Authentication (Admin & Doctor roles)
- ✅ Beautiful dashboard inspired by the reference design
- ✅ Patient Management (Create, Read, Update, Delete)
- ✅ Doctor Management (Card-based layout)
- ✅ Appointment Management with status updates
- ✅ Interactive Calendar with appointment indicators
- ✅ Reports with charts (Bar, Pie, Area)
- ✅ Settings (Profile, Hospital Info, Password)
- ✅ Real data from MongoDB (not hardcoded)
- ✅ Responsive design for mobile/tablet/desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Toast | React Hot Toast |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## 📁 Project Structure

```
HMS/
├── client/          # React Frontend
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Header.jsx
│       │   ├── StatCard.jsx
│       │   └── MiniCalendar.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Patients.jsx
│       │   ├── Doctors.jsx
│       │   ├── Appointments.jsx
│       │   ├── CalendarPage.jsx
│       │   ├── Reports.jsx
│       │   └── Settings.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       └── App.jsx
│
└── server/          # Express Backend
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Patient.js
    │   ├── Doctor.js
    │   └── Appointment.js
    ├── controllers/
    │   ├── authController.js
    │   ├── patientController.js
    │   ├── doctorController.js
    │   ├── appointmentController.js
    │   └── dashboardController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── patientRoutes.js
    │   ├── doctorRoutes.js
    │   ├── appointmentRoutes.js
    │   └── dashboardRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── seed.js
    └── server.js
```

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- [MongoDB](https://www.mongodb.com/) running locally OR a MongoDB Atlas connection string

---

### Step 1 — Clone / Open the Project

```
cd HMS
```

---

### Step 2 — Setup Backend

```bash
cd server
```

Create `.env` file (copy from `.env.example`):

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/hms
JWT_SECRET=hms_secret_jwt_key_2024
NODE_ENV=development
```

> ⚠️ Replace `MONGO_URI` with your MongoDB Atlas URI if not using local MongoDB.

Install dependencies:

```bash
npm install
```

Seed demo data:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

> ✅ Backend runs on: `http://localhost:5000`

---

### Step 3 — Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

> ✅ Frontend runs on: `http://localhost:5173`

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin123 |
| Doctor | doctor@gmail.com | doctor123 |

> You can also click the **"Admin Login"** or **"Doctor Login"** quick-fill buttons on the login page.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/patients` | List all patients |
| POST | `/api/patients` | Add patient |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |
| GET | `/api/doctors` | List all doctors |
| POST | `/api/doctors` | Add doctor |
| GET | `/api/appointments` | List appointments |
| GET | `/api/appointments/today` | Today's appointments |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |

---

## 🎨 Design

The UI is inspired by the provided medical dashboard reference image:

- 🔵 Blue vertical sidebar
- ⬜ White rounded cards  
- 🟣 Blue/indigo primary color palette
- 📊 Recharts for analytics
- 📅 Interactive calendar
- 👤 Doctor profile card
- 📱 Responsive layout

---

## 📄 License

This project is for educational/academic purposes.
