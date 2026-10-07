import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconBg = 'bg-primary/10', iconColor = 'text-primary', change, changeLabel, suffix = '' }) => {
  const isPositive = typeof change === 'number' ? change > 0 : null;
  const isNeutral = change === null || change === undefined;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {!isNeutral && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{change}{typeof change === 'number' && change % 1 === 0 ? '' : ''}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}{suffix}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
