import { Users, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockTransactions } from '../mocks/data';

const chartData = [
  { name: 'Mon', volume: 4000 },
  { name: 'Tue', volume: 3000 },
  { name: 'Wed', volume: 2000 },
  { name: 'Thu', volume: 2780 },
  { name: 'Fri', volume: 1890 },
  { name: 'Sat', volume: 2390 },
  { name: 'Sun', volume: 3490 },
];

export function Dashboard() {
  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-[#1B3A6B]">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 font-medium">{trend}</span>
          <span className="text-gray-500 ml-2">vs last week</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          Last updated: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="12,345" icon={Users} trend="+5.2%" />
        <StatCard title="Transactions Today" value="1,234" icon={CreditCard} trend="+12.5%" />
        <StatCard title="Revenue Today" value="₦450,000" icon={TrendingUp} trend="+8.1%" />
        <StatCard title="Wallet Float" value="₦2,500,000" icon={CreditCard} />
      </div>

      {/* Alerts & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Pending Alerts
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="text-sm font-medium text-red-800">Failed Transactions</p>
                <p className="text-xs text-red-600 mt-1">Require manual intervention</p>
              </div>
              <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm font-bold">
                12
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending KYC</p>
                <p className="text-xs text-yellow-600 mt-1">Tier 3 upgrades waiting</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-bold">
                5
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">7-Day Transaction Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#1B3A6B" fill="#1B3A6B" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Ref</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{tx.reference}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{tx.userName}</td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                      {tx.type} {tx.network && `- ${tx.network}`}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">₦{tx.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'success' ? 'bg-green-100 text-green-800' :
                      tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
