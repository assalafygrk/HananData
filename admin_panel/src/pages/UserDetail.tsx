import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Wallet, AlertTriangle, ShieldCheck, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import api from '../api';

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState<{isOpen: boolean, type: 'credit' | 'debit' | null}>({ isOpen: false, type: null });
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentNote, setAdjustmentNote] = useState('');

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userRes, txRes] = await Promise.all([
        api.get(`/admin/users/${id}`),
        api.get(`/admin/transactions?user=${id}`)
      ]);
      if (userRes.data.success) setUser(userRes.data.data);
      if (txRes.data.success) setUserTransactions(txRes.data.data);
    } catch (error) {
      console.error('Error fetching user', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUserData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <div className="p-8 text-center text-gray-500">User not found</div>;

  const handleStatusToggle = () => {
    // TODO: add status toggle endpoint if needed.
    setUser((prev: any) => prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : null);
  };

  const handleWalletAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentNote || !adjustmentAmount) return;
    
    let amount = parseInt(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    try {
      const endpoint = actionModal.type === 'credit' ? `/admin/users/${id}/credit` : `/admin/users/${id}/debit`;
      const response = await api.post(endpoint, { amount, note: adjustmentNote });
      
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Transaction failed');
    }

    setActionModal({ isOpen: false, type: null });
    setAdjustmentAmount('');
    setAdjustmentNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-[#1B3A6B] mb-4">
              <UserCircle className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <div className="flex justify-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.status.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tier {user.kycTier}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Contact Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <button 
              onClick={handleStatusToggle}
              className={`w-full py-2.5 px-4 rounded-lg font-medium border ${
                user.status === 'active' 
                  ? 'border-red-200 text-red-700 hover:bg-red-50' 
                  : 'border-green-200 text-green-700 hover:bg-green-50'
              } transition-colors`}
            >
              {user.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
            </button>
          </div>
        </div>

        {/* Right Column - Wallet & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Card */}
          <div className="bg-[#1B3A6B] rounded-xl shadow-md p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <p className="text-blue-200 font-medium text-sm">Wallet Balance</p>
                <p className="text-3xl font-bold mt-1">₦{user.walletBalance.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActionModal({ isOpen: true, type: 'credit' })}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap border border-green-400"
              >
                <ArrowUpCircle className="w-4 h-4" /> Credit
              </button>
              <button 
                onClick={() => setActionModal({ isOpen: true, type: 'debit' })}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap border border-red-400"
              >
                <ArrowDownCircle className="w-4 h-4" /> Debit
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
              <button onClick={() => navigate(`/transactions?user=${user._id}`)} className="text-[#1B3A6B] text-sm font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-gray-100">
                  {userTransactions.length > 0 ? userTransactions.map(tx => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="py-3 px-6">
                        <div className="font-medium text-sm text-gray-900 capitalize">{tx.type} {tx.network && `(${tx.network})`}</div>
                        <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="py-3 px-6 font-medium text-sm text-gray-900">
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          tx.status === 'success' ? 'text-green-700 bg-green-100' :
                          tx.status === 'failed' ? 'text-red-700 bg-red-100' :
                          'text-yellow-700 bg-yellow-100'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">No transactions found for this user.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className={`text-lg font-bold flex items-center gap-2 capitalize ${actionModal.type === 'credit' ? 'text-green-700' : 'text-red-700'}`}>
                {actionModal.type === 'credit' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                {actionModal.type} User Wallet
              </h3>
            </div>
            <form onSubmit={handleWalletAdjustment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                  placeholder="e.g. 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason/Note (Required)
                </label>
                <textarea 
                  required
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none resize-none h-24"
                  placeholder={`Explain why you are ${actionModal.type}ing the wallet...`}
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setActionModal({ isOpen: false, type: null })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!adjustmentNote || !adjustmentAmount}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                    actionModal.type === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {actionModal.type}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
