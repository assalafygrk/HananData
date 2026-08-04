import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import api from '../api';
import { LogoLoader } from '../components/LogoLoader';

export function TransactionManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        setLoading(true);
        const endpoint = initialUserId ? `/admin/transactions?user=${initialUserId}` : '/admin/transactions';
        const res = await api.get(endpoint);
        if (res.data.success) {
          setTransactions(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching transactions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [initialUserId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.refId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tx.userId?.name && tx.userId.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialUserId ? 'User Transactions' : 'Transaction Management'}
        </h2>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by ref or user name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 hidden sm:block" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
              >
                <option value="all">All Types</option>
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
                <option value="cable">Cable TV</option>
                <option value="electricity">Electricity</option>
                <option value="airtime-to-cash">Airtime to Cash</option>
                <option value="exam-pin">Exam PIN</option>
                <option value="wallet-funding">Wallet Funding</option>
              </select>
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Reference / Date</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Service</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-12"><LogoLoader /></td></tr>
              ) : filteredTx.map((tx) => (
                <tr 
                  key={tx._id} 
                  onClick={() => navigate(`/transactions/${tx._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{tx.refId}</div>
                    <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {tx.userId ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/users/${tx.userId._id}`); }}
                        className="font-medium text-[#1B3A6B] hover:underline"
                      >
                        {tx.userId.name || tx.userId.phone || 'Unknown User'}
                      </button>
                    ) : (
                      <span className="text-gray-500">System</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md inline-block">
                      {tx.type}
                    </span>
                    {tx.network && (
                      <div className="text-xs font-medium text-gray-500 mt-1">{tx.network}</div>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    ₦{tx.amount?.toLocaleString()}
                  </td>
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
          
          {!loading && filteredTx.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
