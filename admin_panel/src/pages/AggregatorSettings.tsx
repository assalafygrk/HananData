import { useState, useEffect } from 'react';
import { Save, Server, CreditCard, Plus, Trash2, Edit2, X, Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export function AggregatorSettings() {
  const [providers, setProviders] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  
  const [isSaved, setIsSaved] = useState(false);
  
  // Manage Add/Edit modal
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'provider' | 'gateway' | null;
    isEdit: boolean;
    editId: string | null;
  }>({
    isOpen: false,
    type: null,
    isEdit: false,
    editId: null
  });
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    apiKeyEncrypted: '',
    secretKeyEncrypted: '',
    baseUrl: '',
    businessId: '',
    webhookUrl: '',
    password: '' // Required for editing
  });
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manage Delete password confirm modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemType: 'provider' | 'gateway' | null;
    password: string;
  }>({
    isOpen: false,
    itemId: null,
    itemType: null,
    password: ''
  });
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Manage Edit Auth Modal
  const [authEditModal, setAuthEditModal] = useState<{
    isOpen: boolean;
    item: any;
    itemType: 'provider' | 'gateway' | null;
    password: string;
  }>({
    isOpen: false,
    item: null,
    itemType: null,
    password: ''
  });
  const [showAuthEditPassword, setShowAuthEditPassword] = useState(false);

  const fetchProviders = async () => {
    try {
      const res = await api.get(`/admin/providers?_t=${new Date().getTime()}`);
      if (res.data.success) {
        const all = res.data.data;
        setProviders(all.filter((p: any) => p.type === 'vtu'));
        setGateways(all.filter((p: any) => p.type === 'payment-gateway'));
      }
    } catch (error) {
      console.error('Error fetching providers', error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSaveConfig = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleEditClick = (item: any, type: 'provider' | 'gateway') => {
    setAuthEditModal({
      isOpen: true,
      item,
      itemType: type,
      password: ''
    });
    setShowAuthEditPassword(false);
  };

  const handleVerifyEditPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEditModal.password) return toast.error('Password is required to edit');

    try {
      setIsSubmitting(true);
      const res = await api.post('/admin/auth/verify-password', { password: authEditModal.password });
      if (res.data.success) {
        // Password verified, open edit modal
        setFormData({
          name: authEditModal.item.name || '',
          username: authEditModal.item.username || '',
          apiKeyEncrypted: authEditModal.item.apiKeyEncrypted || '',
          secretKeyEncrypted: authEditModal.item.secretKeyEncrypted || '',
          baseUrl: authEditModal.item.baseUrl || '',
          businessId: authEditModal.item.businessId || '',
          webhookUrl: authEditModal.item.webhookUrl || '',
          password: authEditModal.password // Store it for the final PUT request
        });
        setModal({
          isOpen: true,
          type: authEditModal.itemType,
          isEdit: true,
          editId: authEditModal.item._id
        });
        setAuthEditModal({ isOpen: false, item: null, itemType: null, password: '' });
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');
    
    try {
      setIsSubmitting(true);
      if (modal.isEdit) {
        // Edit flow (password was already verified and stored in formData)
        const res = await api.put(`/admin/providers/${modal.editId}`, {
          ...formData,
          type: modal.type === 'provider' ? 'vtu' : 'payment-gateway'
        });
        if (res.data.success) {
          toast.success('Configuration updated successfully');
          fetchProviders();
          closeModal();
        } else {
          toast.error(res.data.message);
        }
      } else {
        // Add flow
        const res = await api.post('/admin/providers', {
          ...formData,
          type: modal.type === 'provider' ? 'vtu' : 'payment-gateway'
        });
        if (res.data.success) {
          toast.success('Configuration added successfully');
          fetchProviders();
          closeModal();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, isEdit: false, editId: null });
    setFormData({ name: '', username: '', apiKeyEncrypted: '', secretKeyEncrypted: '', baseUrl: '', businessId: '', webhookUrl: '', password: '' });
    
  };

  const initiateDelete = (id: string, type: 'provider' | 'gateway') => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemType: type,
      password: ''
    });
    setShowDeletePassword(false);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteModal.password) return toast.error('Password is required to delete');
    
    try {
      setIsSubmitting(true);
      const res = await api.delete(`/admin/providers/${deleteModal.itemId}`, {
        data: { password: deleteModal.password }
      });
      if (res.data.success) {
        toast.success('Configuration deleted successfully');
        fetchProviders();
        setDeleteModal({ isOpen: false, itemId: null, itemType: null, password: '' });
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onClick={() => setModal({ isOpen: true, type: 'provider', isEdit: false, editId: null })}
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
                      <button onClick={() => handleEditClick(p, 'provider')} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => initiateDelete(p._id, 'provider')} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
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
            onClick={() => setModal({ isOpen: true, type: 'gateway', isEdit: false, editId: null })}
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
                      <button onClick={() => handleEditClick(g, 'gateway')} className="p-1.5 text-gray-400 hover:text-purple-600 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => initiateDelete(g._id, 'gateway')} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
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

      {/* Add / Edit Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {modal.isEdit ? 'Edit' : 'Add'} {modal.type}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddOrEdit} className="p-6 space-y-4">
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
              {modal.type === 'provider' && (
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
              )}
              {modal.type === 'gateway' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business ID</label>
                  <input 
                    type="text" 
                    value={formData.businessId}
                    onChange={e => setFormData({...formData, businessId: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                    placeholder="Enter Business ID"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{modal.type === 'gateway' ? 'Public / API Key' : 'API Key'}</label>
                <input 
                  type="password" 
                  value={formData.apiKeyEncrypted}
                  onChange={e => setFormData({...formData, apiKeyEncrypted: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                />
              </div>
              {modal.type === 'gateway' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                  <input 
                    type="password" 
                    value={formData.secretKeyEncrypted}
                    onChange={e => setFormData({...formData, secretKeyEncrypted: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                  />
                </div>
              )}
              {modal.type === 'provider' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                  />
                </div>
              )}
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
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-700 border rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-[#1B3A6B] rounded-lg hover:bg-[#2A5A9E] disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : (modal.isEdit ? 'Save Changes' : 'Add Configuration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Edit Password Modal */}
      {authEditModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" />
                Authorize Action
              </h3>
              <button 
                onClick={() => setAuthEditModal({ isOpen: false, item: null, itemType: null, password: '' })} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleVerifyEditPassword} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Please enter your admin password to edit this {authEditModal.itemType === 'provider' ? 'VTU provider' : 'payment gateway'}.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                <div className="relative">
                  <input 
                    type={showAuthEditPassword ? "text" : "password"} 
                    required
                    value={authEditModal.password}
                    onChange={e => setAuthEditModal({...authEditModal, password: e.target.value})}
                    className="w-full pl-4 pr-10 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B3A6B]" 
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthEditPassword(!showAuthEditPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showAuthEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setAuthEditModal({ isOpen: false, item: null, itemType: null, password: '' })} 
                  className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-4 py-2 text-sm text-white bg-[#1B3A6B] rounded-lg hover:bg-[#2A5A9E] disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Password Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h3 className="text-lg font-bold text-red-700">
                Confirm Provider Deletion
              </h3>
              <button 
                onClick={() => setDeleteModal({ isOpen: false, itemId: null, itemType: null, password: '' })} 
                className="text-red-400 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmDelete} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this {deleteModal.itemType === 'provider' ? 'VTU provider' : 'payment gateway'}? 
                This action is irreversible. Please enter your administrator password to confirm.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password *</label>
                <div className="relative">
                  <input 
                    type={showDeletePassword ? "text" : "password"} 
                    required
                    value={deleteModal.password}
                    onChange={e => setDeleteModal({...deleteModal, password: e.target.value})}
                    className="w-full pl-4 pr-10 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600" 
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setDeleteModal({ isOpen: false, itemId: null, itemType: null, password: '' })} 
                  className="px-4 py-2 text-sm text-gray-700 border rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
