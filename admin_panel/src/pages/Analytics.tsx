import { useState } from 'react';
import { TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';

export function Analytics() {
  const [timeframe, setTimeframe] = useState('7days');
  const [data] = useState<any[]>([]);

  const totalRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalCost = data.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalProfit = data.reduce((acc, curr) => acc + (curr.profit || 0), 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";

  const StatCard = ({ title, value, subValue, icon: Icon, colorClass }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subValue}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & P&L</h2>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-[#1B3A6B] outline-none bg-white shadow-sm"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₦${totalRevenue.toLocaleString()}`} 
          subValue="Gross income from sales"
          icon={DollarSign} 
          colorClass="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="API Cost" 
          value={`₦${totalCost.toLocaleString()}`} 
          subValue="Paid to aggregators"
          icon={Activity} 
          colorClass="bg-orange-50 text-orange-600" 
        />
        <StatCard 
          title="Net Profit" 
          value={`₦${totalProfit.toLocaleString()}`} 
          subValue="Revenue - API Cost"
          icon={TrendingUp} 
          colorClass="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Avg Profit Margin" 
          value={`${profitMargin}%`} 
          subValue="Across all categories"
          icon={PieChart} 
          colorClass="bg-purple-50 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Cost Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="py-12 text-center text-gray-500">
             Charts will be available once the backend implements analytics routes.
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Net Profit Trend</h3>
          <div className="py-12 text-center text-gray-500">
             Charts will be available once the backend implements analytics routes.
          </div>
        </div>
      </div>
    </div>
  );
}
