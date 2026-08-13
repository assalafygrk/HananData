import { Users, CreditCard, TrendingUp, AlertTriangle, Wallet, Sparkles, Edit2, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogoLoader } from '../components/LogoLoader';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, revenueToday: 0, walletFloat: 0, poolBalance: 0, pendingAlerts: 0, failedAlerts: 0 });
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [upcomingFeatures, setUpcomingFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, txRes, upcomingRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/transactions'),
          api.get('/admin/upcoming-services')
        ]);
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (upcomingRes.data.success) {
          setUpcomingFeatures((upcomingRes.data.data || []).slice(0, 5));
        }
        if (txRes.data.success) {
          const allTx = txRes.data.data || [];
          setRecentTx(allTx.slice(0, 10)); // Just recent ones
          
          // Generate 7-day chart data
          const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
          });

          const volumeMap: Record<string, number> = {};
          last7Days.forEach(day => volumeMap[day] = 0);

          allTx.forEach((tx: any) => {
            if (tx.status === 'success') {
              const d = new Date(tx.createdAt);
              const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
              if (volumeMap[dayStr] !== undefined) {
                volumeMap[dayStr] += tx.amount || 0;
              }
            }
          });

          setChartData(last7Days.map(day => ({ name: day, volume: volumeMap[day] })));
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);
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
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={(stats?.totalUsers || 0).toLocaleString()} icon={Users} />
        <StatCard title="Transactions Today" value={(recentTx?.length || 0).toString()} icon={CreditCard} />
        <StatCard title="Revenue Today" value={`₦${(stats?.revenueToday || 0).toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Wallet Float" value={`₦${(stats?.walletFloat || 0).toLocaleString()}`} icon={Wallet} />
        <StatCard title="Total Pool" value={`₦${(stats?.poolBalance || 0).toLocaleString()}`} icon={Wallet} />
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
            <div 
              onClick={() => navigate('/transactions?status=failed')}
              className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-red-800">Failed Transactions</p>
                <p className="text-xs text-red-600 mt-1">Require manual intervention</p>
              </div>
              <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm font-bold">
                {stats?.failedAlerts || 0}
              </span>
            </div>
            <div 
              onClick={() => navigate('/transactions?status=pending')}
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending Transactions</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting confirmation</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-bold">
                {stats?.pendingAlerts || 0}
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
              {loading ? (
                <tr><td colSpan={5} className="py-4 px-6"><LogoLoader /></td></tr>
              ) : recentTx.map((tx) => (
                <tr 
                  key={tx._id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/transactions/${tx._id}`)}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{tx.refId}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {tx.userId ? (tx.userId.name || tx.userId.phone || 'Unknown') : 'System'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                      {tx.type} {tx.network && `- ${tx.network}`}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">₦{tx.amount?.toLocaleString()}</td>
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

      {/* Upcoming Features Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Upcoming Features Widget</h3>
          </div>
          <button onClick={() => navigate('/upcoming-features')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View All (Read/Edit/Delete)
          </button>
        </div>
        <div className="p-0">
          {upcomingFeatures.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No upcoming features found. Add some from the Upcoming Features page.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingFeatures.map(feat => (
                <li key={feat._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {feat.title}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{feat.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{feat.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/upcoming-features')} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit Feature">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => navigate('/upcoming-features')} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Feature">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
