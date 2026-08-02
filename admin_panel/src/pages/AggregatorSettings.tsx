import { useState, useEffect } from 'react';
import { Save, Server, CreditCard, Plus, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export function AggregatorSettings() {
  const [providers, setProviders] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState<{isOpen: boolean, type: 'provider' | 'gateway' | null}>({isOpen: false, type: null});
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    apiKeyEncrypted: '',
    baseUrl: '',
    webhookUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get('/admin/providers');
        if (res.data.success) {
          setProviders(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching providers', error);
      }
    };
    fetchProviders();
  }, []);

  const handleSaveConfig = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');
    try {
      setIsSubmitting(true);
      const res = await api.post('/admin/providers', {
        ...formData,
        type: modal.type === 'provider' ? 'vtu' : 'payment-gateway'
      });
      if (res.data.success) {
        if (modal.type === 'provider') setProviders([...providers, res.data.data]);
        else setGateways([...gateways, res.data.data]);
        setModal({ isOpen: false, type: null });
        setFormData({ name: '', username: '', apiKeyEncrypted: '', baseUrl: '', webhookUrl: '' });
        toast.success('Configuration added successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProvider = (id: string) => setProviders(providers.filter(p => p._id !== id));
  const deleteGateway = (id: string) => setGateways(gateways.filter(g => g._id !== id));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Aggregators & Gateways</h2>
        <button 
          onClick={handleSaveConfig}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A6B] text-white font-medium rounded-lg hover:bg-[#2A5A9E] transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Master Config'}
        </button>
      </div>

      {/* VTU Providers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-[#1B3A6B]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">VTU Providers</h3>
              <p className="text-sm text-gray-500">Configure APIs for Airtime, Data, and Utility</p>
            </div>
          </div>
          <button 
            onClick={() => setModal({ isOpen: true, type: 'provider' })}
            className="flex items-center gap-2 text-sm font-medium text-[#1B3A6B] hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
          >
            <Plus className="w-4 h-4" /> Add Provider
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Provider Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Service Type</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Base URL</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {providers.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{p.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{p.type}</td>
                  <td className="py-4 px-6 text-sm font-mono text-gray-500">{p.baseUrl}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProvider(p._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateways */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Payment Gateways</h3>
              <p className="text-sm text-gray-500">Configure Wallet Funding and Card Payments</p>
            </div>
          </div>
          <button 
            onClick={() => setModal({ isOpen: true, type: 'gateway' })}
            className="flex items-center gap-2 text-sm font-medium text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
          >
            <Plus className="w-4 h-4" /> Add Gateway
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Gateway Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Fee %</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Webhook URL</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gateways.map((g) => (
                <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{g.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{g.feePercentage}%</td>
                  <td className="py-4 px-6 text-sm font-mono text-gray-500">{g.webhookUrl}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      g.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteGateway(g._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {gateways.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No Payment Gateways configured.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 capitalize">Add {modal.type}</h3>
              <button onClick={() => setModal({ isOpen: false, type: null })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                <input 
                  type="url" 
                  value={formData.baseUrl}
                  onChange={e => setFormData({...formData, baseUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                  placeholder="https://api.provider.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input 
                  type="password" 
                  value={formData.apiKeyEncrypted}
                  onChange={e => setFormData({...formData, apiKeyEncrypted: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username (Optional)</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.webhookUrl}
                  onChange={e => setFormData({...formData, webhookUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModal({ isOpen: false, type: null })} className="px-4 py-2 text-sm text-gray-700 border rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-[#1B3A6B] rounded-lg hover:bg-[#2A5A9E] disabled:opacity-50">
                  {isSubmitting ? 'Adding...' : 'Add Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
