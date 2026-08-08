import { useState, useEffect } from 'react';
import { Users, Gift, Save, CheckCircle2 } from 'lucide-react';
import api from '../api';

export function ReferralManagement() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await api.get('/admin/referrals');
        if (res.data.success) {
          setReferrals(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);



  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Referral System</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                Referral Settings
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2">How it works</h4>
                <ul className="text-sm text-purple-800 space-y-3 list-disc pl-4">
                  <li>User shares their unique referral code.</li>
                  <li>New user registers using the referral code.</li>
                  <li>Whenever the new user completes <span className="font-semibold">any transaction over ₦100</span>, the referrer receives an instant bonus.</li>
                  <li>The referrer receives <span className="font-semibold">₦1 bonus per qualifying transaction</span>.</li>
                  <li>This applies to all future transactions the referred user makes!</li>
                </ul>
                <div className="mt-4 text-xs text-purple-600 bg-purple-100/50 p-3 rounded-lg border border-purple-200">
                  <p><strong>Note:</strong> The referral logic is currently managed automatically by the core system and cannot be altered here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                Recent Referral Activity
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500">Date</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500">Referrer</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500">Referred User</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500">Bonus Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">Loading referrals...</td>
                    </tr>
                  ) : referrals.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No referral activity found.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((ref: any) => (
                      <tr key={ref.id || ref._id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(ref.date || ref.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-[#1B3A6B] hover:underline cursor-pointer">
                            {ref.referrer?.name || ref.referrerName || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {ref.referredUser?.name || ref.referredUserName || 'Unknown'}
                        </td>
                        <td className="py-4 px-6">
                          {ref.status === 'paid' || ref.status === 'successful' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3" /> Paid (₦{ref.bonusEarned || ref.amount})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Funding
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
