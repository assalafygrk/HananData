import { useState } from 'react';
import { mockProviders, mockGateways } from '../mocks/data';
import { Provider, PaymentGateway } from '../mocks/types';
import { Save, Server, CreditCard, Plus, Trash2, Edit2, Activity, X } from 'lucide-react';

export function AggregatorSettings() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState<{isOpen: boolean, type: 'provider' | 'gateway' | null}>({isOpen: false, type: null});

  const handleSaveConfig = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const deleteProvider = (id: string) => setProviders(providers.filter(p => p.id !== id));
  const deleteGateway = (id: string) => setGateways(gateways.filter(g => g.id !== id));

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
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
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
                      <button onClick={() => deleteProvider(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
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
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
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
                      <button onClick={() => deleteGateway(g.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
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

      {/* Generic Add Modal (UI only) */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 capitalize">Add {modal.type}</h3>
              <button onClick={() => setModal({ isOpen: false, type: null })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">This is a mock UI. In a real scenario, you would fill out the API keys and endpoints here.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Secret</label>
                <input type="password" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button onClick={() => setModal({ isOpen: false, type: null })} className="px-4 py-2 text-sm text-gray-700 border rounded-lg">Cancel</button>
                <button onClick={() => setModal({ isOpen: false, type: null })} className="px-4 py-2 text-sm text-white bg-[#1B3A6B] rounded-lg hover:bg-[#2A5A9E]">Add Configuration</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
