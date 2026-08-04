import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { LogoLoader } from '../components/LogoLoader';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  planned: { label: 'Planned', color: 'bg-gray-100 text-gray-700' },
  in_development: { label: 'In Development', color: 'bg-blue-100 text-blue-700' },
  testing: { label: 'Testing', color: 'bg-yellow-100 text-yellow-700' },
  released: { label: 'Released', color: 'bg-green-100 text-green-700' },
};

const ICON_OPTIONS = [
  { value: 'card_giftcard', label: '🎁 Gift Cards' },
  { value: 'public', label: '🌍 Global/International' },
  { value: 'sim_card', label: '📱 SIM / eSIM' },
  { value: 'autorenew', label: '🔄 Automation' },
  { value: 'attach_money', label: '💵 Money' },
  { value: 'business', label: '🏢 Business' },
  { value: 'school', label: '🎓 Education' },
  { value: 'savings', label: '💰 Savings' },
  { value: 'currency_exchange', label: '💱 Exchange' },
  { value: 'account_balance', label: '🏦 Banking' },
  { value: 'payments', label: '💳 Payments' },
  { value: 'receipt_long', label: '📋 Receipts' },
];

const defaultForm = {
  title: '',
  description: '',
  icon: 'auto_awesome',
  category: 'General',
  status: 'in_development',
  progress: 50,
  expectedDate: 'Q3 2026',
  isPublished: true,
};

export function UpcomingServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [form, setForm] = useState<any>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/upcoming-services');
      if (res.data.success) setServices(res.data.data);
    } catch {
      toast.error('Failed to load upcoming services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => {
    setForm(defaultForm);
    setModal({ open: true, data: null });
  };

  const openEdit = (svc: any) => {
    setForm({ ...svc });
    setModal({ open: true, data: svc });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }
    try {
      setSaving(true);
      if (modal.data?._id) {
        const res = await api.put(`/admin/upcoming-services/${modal.data._id}`, form);
        if (res.data.success) {
          setServices(prev => prev.map(s => s._id === modal.data._id ? res.data.data : s));
          toast.success('Feature updated');
        }
      } else {
        const res = await api.post('/admin/upcoming-services', form);
        if (res.data.success) {
          setServices(prev => [...prev, res.data.data]);
          toast.success('Feature created');
        }
      }
      setModal({ open: false, data: null });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (svc: any) => {
    try {
      const res = await api.put(`/admin/upcoming-services/${svc._id}`, { isPublished: !svc.isPublished });
      if (res.data.success) {
        setServices(prev => prev.map(s => s._id === svc._id ? res.data.data : s));
        toast.success(svc.isPublished ? 'Feature hidden from app' : 'Feature published to app');
      }
    } catch {
      toast.error('Failed to toggle visibility');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/upcoming-services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      setDeleteConfirm(null);
      toast.success('Feature deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Features</h2>
          <p className="text-sm text-gray-500 mt-1">Manage features shown in the "Coming Soon" screen on the mobile app.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5A9E] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20"><LogoLoader /></div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-lg font-medium">No upcoming features yet</p>
            <p className="text-sm mt-1">Click "Add Feature" to create your first one.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Feature</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Expected</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Visible</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map(svc => {
                const st = STATUS_LABELS[svc.status] || STATUS_LABELS.planned;
                return (
                  <tr key={svc._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{svc.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5 max-w-xs truncate">{svc.description}</div>
                      <div className="text-xs text-gray-400 mt-0.5 capitalize">{svc.category}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1B3A6B] transition-all"
                            style={{ width: `${svc.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{svc.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{svc.expectedDate}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(svc)}
                        title={svc.isPublished ? 'Visible in app (click to hide)' : 'Hidden from app (click to show)'}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${svc.isPublished
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {svc.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {svc.isPublished ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(svc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B3A6B] hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === svc._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(svc._id)}
                              className="text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(svc._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {modal.data ? 'Edit Feature' : 'Add New Feature'}
              </h3>
              <button
                onClick={() => setModal({ open: false, data: null })}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Gift Cards Exchange"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the upcoming feature..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
                  >
                    {ICON_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Finance"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_development">In Development</option>
                    <option value="testing">Testing</option>
                    <option value="released">Released</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Date</label>
                  <input
                    type="text"
                    value={form.expectedDate}
                    onChange={e => setForm({ ...form, expectedDate: e.target.value })}
                    placeholder="e.g. Q3 2026"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Development Progress: <span className="font-bold text-[#1B3A6B]">{form.progress}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={form.progress}
                  onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                  className="w-full accent-[#1B3A6B]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#1B3A6B] rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Publish to mobile app (visible in Coming Soon screen)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, data: null })}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#1B3A6B] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2A5A9E] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : modal.data ? 'Save Changes' : 'Create Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
