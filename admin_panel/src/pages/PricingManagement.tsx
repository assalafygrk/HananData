import { useState } from 'react';
import { mockPricing } from '../mocks/data';
import { PricingConfig } from '../mocks/types';
import { Save, Filter, AlertTriangle } from 'lucide-react';

export function PricingManagement() {
  const [pricingData, setPricingData] = useState<PricingConfig[]>([...mockPricing]);
  const [filterCategory, setFilterCategory] = useState('data');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ apiPrice: 0, vendorPrice: 0, userPrice: 0 });
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, data: any}>({isOpen: false, data: null});

  const filteredPricing = pricingData.filter(p => p.category === filterCategory);

  const handleEditClick = (p: PricingConfig) => {
    setEditingId(p.id);
    setEditForm({ apiPrice: p.apiPrice, vendorPrice: p.vendorPrice, userPrice: p.userPrice });
  };

  const handleSaveClick = (p: PricingConfig) => {
    setConfirmModal({
      isOpen: true,
      data: { ...p, ...editForm }
    });
  };

  const confirmSave = () => {
    if (confirmModal.data) {
      setPricingData(prev => prev.map(p => 
        p.id === confirmModal.data.id ? { 
          ...p, 
          ...confirmModal.data,
          lastUpdatedBy: 'Super Admin',
          lastUpdatedAt: new Date().toISOString()
        } : p
      ));
    }
    setConfirmModal({ isOpen: false, data: null });
    setEditingId(null);
  };

  const calculateProfit = (sellPrice: number, costPrice: number) => {
    const profit = sellPrice - costPrice;
    const margin = costPrice > 0 ? (profit / costPrice) * 100 : 0;
    return { profit, margin: margin.toFixed(1) };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pricing & Margins</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-2">
          {['airtime', 'data', 'cable', 'electricity'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
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
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">API Cost (₦)</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Vendor Price (₦)</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">User Price (₦)</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase min-w-[200px]">Action / Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPricing.map((p) => {
                const isEditing = editingId === p.id;
                
                // Calculate P&L indicators
                const currentApi = isEditing ? editForm.apiPrice : p.apiPrice;
                const currentVendor = isEditing ? editForm.vendorPrice : p.vendorPrice;
                const currentUser = isEditing ? editForm.userPrice : p.userPrice;
                
                const vendorPL = calculateProfit(currentVendor, currentApi);
                const userPL = calculateProfit(currentUser, currentApi);

                return (
                  <tr key={p.id} className={isEditing ? 'bg-blue-50/50' : 'hover:bg-gray-50'}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          p.network === 'MTN' ? 'bg-[#FFCC00]' :
                          p.network === 'Airtel' ? 'bg-[#E4002B]' :
                          p.network === 'Glo' ? 'bg-[#009A44]' : 'bg-gray-800'
                        }`} />
                        <div>
                          <div className="font-bold text-gray-900">{p.network}</div>
                          <div className="text-sm text-gray-600">{p.planName}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.apiPrice} 
                          onChange={e => setEditForm({...editForm, apiPrice: Number(e.target.value)})}
                          className="w-24 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1B3A6B]"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{p.apiPrice}</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input 
                            type="number" 
                            value={editForm.vendorPrice} 
                            onChange={e => setEditForm({...editForm, vendorPrice: Number(e.target.value)})}
                            className="w-24 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1B3A6B]"
                          />
                          <span className={`text-xs font-medium ${vendorPL.profit < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {vendorPL.profit >= 0 ? '+' : ''}{vendorPL.profit} ({vendorPL.margin}%)
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{p.vendorPrice}</span>
                          <span className="text-xs text-green-600 font-medium">+{vendorPL.profit} ({vendorPL.margin}%)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input 
                            type="number" 
                            value={editForm.userPrice} 
                            onChange={e => setEditForm({...editForm, userPrice: Number(e.target.value)})}
                            className="w-24 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1B3A6B]"
                          />
                          <span className={`text-xs font-medium ${userPL.profit < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {userPL.profit >= 0 ? '+' : ''}{userPL.profit} ({userPL.margin}%)
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{p.userPrice}</span>
                          <span className="text-xs text-green-600 font-medium">+{userPL.profit} ({userPL.margin}%)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSaveClick(p)}
                            className="flex items-center gap-1 bg-[#1B3A6B] text-white px-3 py-1 rounded text-sm hover:bg-[#2A5A9E]"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 hover:text-gray-700 px-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <button 
                            onClick={() => handleEditClick(p)}
                            className="text-[#1B3A6B] font-medium text-sm hover:underline"
                          >
                            Edit Prices
                          </button>
                          <div className="text-[10px] text-gray-400 leading-tight">
                            Updated by {p.lastUpdatedBy}<br/>
                            {new Date(p.lastUpdatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredPricing.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No pricing configurations found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500 w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Price Update</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                You are about to update the prices for <strong>{confirmModal.data?.network} - {confirmModal.data?.planName}</strong>. This change will affect all users immediately.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">API Cost:</span>
                  <span className="font-bold text-gray-900">₦{confirmModal.data?.apiPrice}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-500">Vendor Price:</span>
                  <span className="font-bold text-[#1B3A6B]">₦{confirmModal.data?.vendorPrice}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-500">User Price:</span>
                  <span className="font-bold text-green-700">₦{confirmModal.data?.userPrice}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  onClick={() => setConfirmModal({isOpen: false, data: null})}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1B3A6B] rounded-lg hover:bg-[#2A5A9E]"
                >
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
