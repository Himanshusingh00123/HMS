const statusConfig = {
  // Reservation statuses
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Checked-in': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'Checked-out': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  // Room statuses
  Available: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Occupied: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Cleaning: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Maintenance: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  // Order statuses
  New: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Preparing: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Ready: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Delivered: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  // Housekeeping
  Clean: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Dirty: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  Inspected: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  // Guest
  Active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Inactive: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  VIP: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  // Parking
  Reserved: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  // Payment
  Paid: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Partial: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Refunded: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' },
  // Priority
  Low: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  Medium: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  High: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' },
  Urgent: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

const StatusBadge = ({ status, showDot = true }) => {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />}
      {status}
    </span>
  );
};

export default StatusBadge;
