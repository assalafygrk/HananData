import { useState, useEffect } from 'react';
import { Save, Settings2, ShieldAlert, CreditCard, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { LogoLoader } from '../components/LogoLoader';

export function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [disableRegistration, setDisableRegistration] = useState(false);
  
  const [minFunding, setMinFunding] = useState('100');
  const [tier1Limit, setTier1Limit] = useState('10000');
  const [tier2Limit, setTier2Limit] = useState('50000');
  const [tier3Limit, setTier3Limit] = useState('500000');

  const [paymentPointApiKey, setPaymentPointApiKey] = useState('');
  const [paymentPointApiSecret, setPaymentPointApiSecret] = useState('');
  const [paymentPointBusinessId, setPaymentPointBusinessId] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setMaintenanceMode(s.maintenanceMode || false);
          setDisableRegistration(s.disableRegistration || false);
          setMinFunding(s.minFunding?.toString() || '100');
          setTier1Limit(s.tier1Limit?.toString() || '10000');
          setTier2Limit(s.tier2Limit?.toString() || '50000');
          setTier3Limit(s.tier3Limit?.toString() || '500000');
          setPaymentPointApiKey(s.paymentPointApiKey || '');
          setPaymentPointApiSecret(s.paymentPointApiSecret || '');
          setPaymentPointBusinessId(s.paymentPointBusinessId || '');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', {
        maintenanceMode,
        disableRegistration,
        minFunding: Number(minFunding),
        tier1Limit: Number(tier1Limit),
        tier2Limit: Number(tier2Limit),
        tier3Limit: Number(tier3Limit),
        paymentPointApiKey,
        paymentPointApiSecret,
        paymentPointBusinessId,
      });
      setIsSaved(true);
      toast.success('Settings saved successfully');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  };

  if (loading) return <LogoLoader />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <Settings2 className="w-5 h-5 text-[#1B3A6B]" />
            <h3 className="font-bold text-gray-900">General Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Maintenance Mode
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Disables user access to the platform. Only Super Admins can log in.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={maintenanceMode}
                  onChange={() => setMaintenanceMode(!maintenanceMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-orange-500" />
                  Disable New Registrations
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Temporarily stop new users from creating accounts on the platform.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={disableRegistration}
                  onChange={() => setDisableRegistration(!disableRegistration)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Limits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <CreditCard className="w-5 h-5 text-[#1B3A6B]" />
            <h3 className="font-bold text-gray-900">Financial Limits</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Minimum Wallet Funding (₦)</label>
              <input 
                type="number" 
                value={minFunding}
                onChange={(e) => setMinFunding(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Daily Transaction Limits (₦)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tier 1 Users</label>
                  <input 
                    type="number" 
                    value={tier1Limit}
                    onChange={(e) => setTier1Limit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tier 2 Users</label>
                  <input 
                    type="number" 
                    value={tier2Limit}
                    onChange={(e) => setTier2Limit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tier 3 Users</label>
                  <input 
                    type="number" 
                    value={tier3Limit}
                    onChange={(e) => setTier3Limit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PaymentPoint Virtual Account Gateway */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <CreditCard className="w-5 h-5 text-[#1B3A6B]" />
            <h3 className="font-bold text-gray-900">PaymentPoint Virtual Account Gateway</h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">
              Configure PaymentPoint credentials to automatically generate dedicated virtual bank accounts for users and receive instant webhook deposits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key *</label>
                <input
                  type="text"
                  value={paymentPointApiKey}
                  onChange={(e) => setPaymentPointApiKey(e.target.value)}
                  placeholder="e.g. pk_live_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Secret *</label>
                <input
                  type="password"
                  value={paymentPointApiSecret}
                  onChange={(e) => setPaymentPointApiSecret(e.target.value)}
                  placeholder="e.g. sk_live_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business ID *</label>
                <input
                  type="text"
                  value={paymentPointBusinessId}
                  onChange={(e) => setPaymentPointBusinessId(e.target.value)}
                  placeholder="e.g. 3AB2B22345EF407"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none text-sm font-mono"
                />
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800">
              <strong>Webhook URL:</strong> <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border">https://yourdomain.com/api/paymentpoint/webhook</code>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A6B] text-white font-medium rounded-lg hover:bg-[#2A5A9E] transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Settings Saved' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
