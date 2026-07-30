import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import api from '../api';

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.data.success) {
          setUsers(response.data.data.users);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.phone && u.phone.includes(searchTerm)) || 
                          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = filterTier === 'all' || u.kycTier?.toString() === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
            >
              <option value="all">All KYC Tiers</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">KYC Tier</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Wallet Balance</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-500">Loading users...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr 
                  key={user._id} 
                  onClick={() => navigate(`/users/${user._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div>{user.phone || 'N/A'}</div>
                    <div className="text-gray-400">{user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Tier {user.kycTier || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    ₦{user.walletBalance?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </div>
        
        {/* Pagination mock */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredUsers.length}</span> results
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
