import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  BedDouble,
  Printer,
  Calendar,
  Layers,
} from 'lucide-react';

// Monthly performance data for the simple student project chart
const MONTHLY_DATA = [
  { month: 'Jan', bookings: 24, revenue: 14500 },
  { month: 'Feb', bookings: 28, revenue: 16800 },
  { month: 'Mar', bookings: 32, revenue: 19200 },
  { month: 'Apr', bookings: 35, revenue: 21500 },
  { month: 'May', bookings: 42, revenue: 25800 },
  { month: 'Jun', bookings: 48, revenue: 29400 },
  { month: 'Jul', bookings: 54, revenue: 33200 },
  { month: 'Aug', bookings: 52, revenue: 32100 },
  { month: 'Sep', bookings: 45, revenue: 27900 },
  { month: 'Oct', bookings: 38, revenue: 23400 },
];

const Reports = () => {
  const { stats, bookings, payments, rooms } = useHotel();
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">
            Hotel Analytics &amp; Reports
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Key operational metrics, revenue performance, and occupancy rates
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn-gold py-2.5 px-5 shadow-gold flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Report</span>
        </button>
      </div>

      {/* 4 Required Metric Cards:
          - Total bookings
          - Total revenue
          - Occupancy rate
          - Available rooms */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Bookings
            </p>
            <h4 className="text-2xl font-black text-gray-900 mt-1">{bookings.length}</h4>
            <p className="text-[11px] text-teal-sidebar font-semibold mt-0.5">All time bookings</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <h4 className="text-2xl font-black text-emerald-600 mt-1">
              ${stats.totalRevenue.toLocaleString()}
            </h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Completed payments</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Occupancy Rate
            </p>
            <h4 className="text-2xl font-black text-gold mt-1">{stats.occupancyRate}%</h4>
            <p className="text-[11px] text-gold font-semibold mt-0.5">
              {stats.occupiedRooms} / {stats.totalRooms} rooms occupied
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Available Rooms
            </p>
            <h4 className="text-2xl font-black text-teal-sidebar mt-1">{stats.availableRooms}</h4>
            <p className="text-[11px] text-teal-sidebar font-semibold mt-0.5">Ready for booking</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-sidebar/10 flex items-center justify-center text-teal-sidebar">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Monthly Bookings & Revenue Chart (Simple bar or line chart as required) */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-gray-900 tracking-wide uppercase">
              Monthly Bookings &amp; Revenue Trends
            </h3>
            <p className="text-xs text-gray-400">
              Overview of revenue ($) and total booking reservations per month
            </p>
          </div>

          {/* Toggle between Bar and Line chart */}
          <div className="flex items-center bg-[#EEF3F5] rounded-full p-1 border border-gray-200">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                chartType === 'bar' ? 'bg-teal-sidebar text-white shadow-xs' : 'text-gray-500'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                chartType === 'line' ? 'bg-teal-sidebar text-white shadow-xs' : 'text-gray-500'
              }`}
            >
              Line Chart
            </button>
          </div>
        </div>

        {/* Responsive Chart Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B3636',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  name="Monthly Bookings"
                  fill="#C6922A"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  name="Revenue ($)"
                  fill="#1B3636"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B3636',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  name="Monthly Bookings"
                  stroke="#C6922A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#C6922A' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#1B3636"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1B3636' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Category Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 mb-4">
          Room Inventory Status Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#EEF3F5] rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Available</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              {stats.availableRooms}
            </span>
            <span className="text-xs text-gray-500">Ready to assign</span>
          </div>

          <div className="bg-[#EEF3F5] rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Occupied</span>
            <span className="text-2xl font-black text-gold block mt-1">
              {stats.occupiedRooms}
            </span>
            <span className="text-xs text-gray-500">Active stays</span>
          </div>

          <div className="bg-[#EEF3F5] rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Cleaning</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">
              {stats.cleaningRooms}
            </span>
            <span className="text-xs text-gray-500">Housekeeping</span>
          </div>

          <div className="bg-[#EEF3F5] rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Maintenance</span>
            <span className="text-2xl font-black text-rose-600 block mt-1">
              {stats.maintenanceRooms}
            </span>
            <span className="text-xs text-gray-500">Service work</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
