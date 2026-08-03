import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import api from '../api';

export function Analytics() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: "0.0",
    chartData: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/admin/analytics/pnl?startDate=${startDate}&endDate=${endDate}`);
        if (res.data && res.data.success) {
          setStats({
            totalRevenue: res.data.data.grossRevenue || 0,
            totalCost: res.data.data.apiCosts || 0,
            totalProfit: res.data.data.netProfit || 0,
            profitMargin: res.data.data.margin ? res.data.data.margin.replace('%', '') : "0.0",
            chartData: res.data.data.chartData || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, [startDate, endDate]);

  const { totalRevenue, totalCost, totalProfit, profitMargin, chartData } = stats;

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

  const formatYAxis = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `₦${(tickItem / 1000).toFixed(1)}k`;
    }
    return `₦${tickItem}`;
  };

  const formatDateAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & P&L</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">From:</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-[#1B3A6B] outline-none bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">To:</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-[#1B3A6B] outline-none bg-white shadow-sm"
            />
          </div>
        </div>
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
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue vs API Cost</h3>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDateAxis} tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, undefined]} labelFormatter={formatDateAxis} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" name="API Cost" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data available for this timeframe</div>
            )}
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Net Profit Trend</h3>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDateAxis} tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
                  <RechartsTooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Profit']} labelFormatter={formatDateAxis} />
                  <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data available for this timeframe</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
