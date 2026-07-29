import { useState } from 'react';
import { mockReferrals } from '../mocks/data';
import { Users, Gift, Save, CheckCircle2 } from 'lucide-react';

export function ReferralManagement() {
  const [bonusAmount, setBonusAmount] = useState('500');
  const [minFunding, setMinFunding] = useState('2000');
  const [isActive, setIsActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
            
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Amount (₦)</label>
                <p className="text-xs text-gray-500 mb-2">Amount credited to the referrer</p>
                <input 
                  type="number" 
                  required
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  disabled={!isActive}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min. First Funding (₦)</label>
                <p className="text-xs text-gray-500 mb-2">Amount referred user must fund before bonus is released</p>
                <input 
                  type="number" 
                  required
                  value={minFunding}
                  onChange={(e) => setMinFunding(e.target.value)}
                  disabled={!isActive}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={!isActive}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaved ? 'Settings Saved' : 'Save Configurations'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-2">How it works</h4>
            <ul className="text-sm text-purple-800 space-y-2 list-disc pl-4">
              <li>User shares their unique referral code.</li>
              <li>New user registers with code.</li>
              <li>New user funds wallet with at least ₦{minFunding}.</li>
              <li>Referrer instantly receives ₦{bonusAmount} bonus.</li>
            </ul>
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
                  {mockReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(ref.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[#1B3A6B] hover:underline cursor-pointer">
                          {ref.referrerName}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {ref.referredUserName}
                      </td>
                      <td className="py-4 px-6">
                        {ref.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3" /> Paid (₦{ref.bonusEarned})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Funding
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {mockReferrals.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No referral activity found.
                      </td>
                    </tr>
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
