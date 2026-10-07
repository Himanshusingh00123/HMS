import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const MiniCalendar = ({ appointments = [] }) => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  // Get days with appointments
  const apptDays = appointments.reduce((acc, appt) => {
    const d = new Date(appt.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      acc.add(d.getDate());
    }
    return acc;
  }, new Set());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-800">
          {MONTHS[month].slice(0, 3)} {year}
        </span>
        <div className="flex gap-1">
          <button onClick={prev} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasAppt = day && apptDays.has(day);

          return (
            <div key={idx} className="flex items-center justify-center">
              {day ? (
                <div className="relative flex flex-col items-center">
                  <div className={`
                    w-7 h-7 flex items-center justify-center text-xs rounded-full cursor-pointer font-medium transition-all
                    ${isToday ? 'bg-primary text-white font-bold' : 'hover:bg-primary/10 text-gray-700'}
                  `}>
                    {day}
                  </div>
                  {hasAppt && (
                    <div className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? 'bg-white' : 'bg-primary'}`} />
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
