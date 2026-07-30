import { useState, useEffect } from 'react';
import { Save, AlertTriangle, Edit2, X } from 'lucide-react';
import api from '../api';

export function PricingManagement() {
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('data');
  const [loading, setLoading] = useState(true);
  
  const [editModal, setEditModal] = useState<{ isOpen: boolean; data: any | null }>({
    isOpen: false,
    data: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pricingRes, providersRes] = await Promise.all([
          api.get('/admin/pricing'),
          api.get('/admin/providers')
        ]);
        if (pricingRes.data.success) setPricingData(pricingRes.data.data);
        if (providersRes.data.success) setProviders(providersRes.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPricing = pricingData.filter(p => p.category === filterCategory);

  const handleEditClick = (p: any) => {
    setEditModal({
      isOpen: true,
      data: { ...p, providerId: p.providerId?._id || p.providerId || '' }
    });
  };

  const handleModalChange = (field: string, value: string | number) => {
    if (editModal.data) {
      setEditModal({
        ...editModal,
        data: { ...editModal.data, [field]: value }
      });
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal.data) {
      try {
        const response = await api.put(`/admin/pricing/${editModal.data._id}`, editModal.data);
        if (response.data.success) {
          setPricingData(prev => prev.map(p => 
            p._id === editModal.data?._id ? response.data.data : p
          ));
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        alert('Failed to save configuration');
      }
    }
    setEditModal({ isOpen: false, data: null });
  };

  const calculateProfit = (sellPrice: number, costPrice: number) => {
    const profit = sellPrice - costPrice;
    const margin = costPrice > 0 ? (profit / costPrice) * 100 : 0;
    return { profit, margin: margin.toFixed(1) };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pricing & Routing</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-2 overflow-x-auto">
          {['airtime', 'data', 'cable', 'electricity'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                filterCategory === cat 
                  ? 'bg-[#1B3A6B] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Network / Plan</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Plan ID</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Provider Setup</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">API Cost (₦)</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Vendor (₦)</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">User (₦)</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-500">Loading...</td></tr>
              ) : filteredPricing.map((p) => {
                const vendorPL = calculateProfit(p.vendorPrice, p.apiPrice);
                const userPL = calculateProfit(p.userPrice, p.apiPrice);
                // p.providerId might be an object or string, so check if it exists in providers array
                const pId = typeof p.providerId === 'object' ? p.providerId?._id : p.providerId;
                const providerName = providers.find(prov => prov._id === pId)?.name || 'Unknown Provider';

                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${
                          p.network === 'MTN' ? 'bg-[#FFCC00]' :
                          p.network === 'Airtel' ? 'bg-[#E4002B]' :
                          p.network === 'Glo' ? 'bg-[#009A44]' : 'bg-gray-800'
                        }`} />
                        <div>
                          <div className="font-bold text-gray-900 whitespace-nowrap">{p.network}</div>
                          <div className="text-sm text-gray-600 whitespace-nowrap">{p.planName}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        {p.planId || 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900 text-sm">{providerName}</span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{p.apiPrice}</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{p.vendorPrice}</span>
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap">+{vendorPL.profit} ({vendorPL.margin}%)</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{p.userPrice}</span>
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap">+{userPL.profit} ({userPL.margin}%)</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="inline-flex items-center gap-2 bg-blue-50 text-[#1B3A6B] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredPricing.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No pricing configurations found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Config Modal */}
      {editModal.isOpen && editModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#1B3A6B]" />
                Edit Configuration - {editModal.data.network} {editModal.data.planName}
              </h3>
              <button 
                onClick={() => setEditModal({ isOpen: false, data: null })}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="edit-pricing-form" onSubmit={handleSaveModal} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Routing Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Provider & Routing</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Provider</label>
                      <select 
                        required
                        value={editModal.data.providerId}
                        onChange={(e) => handleModalChange('providerId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                      >
                        <option value="">Select Provider...</option>
                        {providers.map(prov => (
                          <option key={prov._id} value={prov._id}>{prov.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan ID</label>
                      <input 
                        type="text"
                        required
                        value={editModal.data.planId}
                        onChange={(e) => handleModalChange('planId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none font-mono text-sm"
                        placeholder="e.g. MTN-1GB-30"
                      />
                      <p className="text-xs text-gray-500 mt-1">The exact Plan ID expected by the target provider API.</p>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Pricing Structure</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Cost Price (₦)</label>
                      <input 
                        type="number"
                        required
                        min="0"
                        value={editModal.data.apiPrice}
                        onChange={(e) => handleModalChange('apiPrice', Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Sell Price (₦)</label>
                      <input 
                        type="number"
                        required
                        min="0"
                        value={editModal.data.vendorPrice}
                        onChange={(e) => handleModalChange('vendorPrice', Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                      />
                      {editModal.data.vendorPrice > 0 && (
                        <p className={`text-xs mt-1 ${editModal.data.vendorPrice >= editModal.data.apiPrice ? 'text-green-600' : 'text-red-600'}`}>
                          Profit: ₦{editModal.data.vendorPrice - editModal.data.apiPrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Normal User Sell Price (₦)</label>
                      <input 
                        type="number"
                        required
                        min="0"
                        value={editModal.data.userPrice}
                        onChange={(e) => handleModalChange('userPrice', Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                      />
                      {editModal.data.userPrice > 0 && (
                        <p className={`text-xs mt-1 ${editModal.data.userPrice >= editModal.data.apiPrice ? 'text-green-600' : 'text-red-600'}`}>
                          Profit: ₦{editModal.data.userPrice - editModal.data.apiPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-gray-50 shrink-0">
              <button 
                type="button"
                onClick={() => setEditModal({isOpen: false, data: null})}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                form="edit-pricing-form"
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#1B3A6B] rounded-lg hover:bg-[#2A5A9E] transition-colors"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
