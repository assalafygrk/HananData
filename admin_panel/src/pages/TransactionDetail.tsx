import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import api from '../api';

export function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [actionModal, setActionModal] = useState<{isOpen: boolean, type: 'retry' | 'resolve' | 'refund' | null}>({ isOpen: false, type: null });
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await api.get(`/admin/transactions/${id}`);
        if (res.data.success) {
          setTx(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching tx', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTx();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!tx) return <div className="p-8 text-center text-gray-500">Transaction not found</div>;

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNote) return;
    
    try {
      const res = await api.post(`/admin/transactions/${id}/action`, {
        action: actionModal.type,
        note: adminNote
      });
      if (res.data.success) {
        setTx(res.data.data); // this might not have populated user anymore since action endpoint might not populate.
        // Let's refetch or just update local
        setTx((prev: any) => ({
           ...prev,
           status: res.data.data.status,
           adminNote: res.data.data.adminNote
        }));
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update transaction');
    }
    
    setActionModal({ isOpen: false, type: null });
    setAdminNote('');
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="w-12 h-12 text-green-500" />;
    if (status === 'failed') return <XCircle className="w-12 h-12 text-red-500" />;
    return <AlertCircle className="w-12 h-12 text-yellow-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/transactions')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className={`p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4 ${
          tx.status === 'success' ? 'bg-green-50 border-green-100' :
          tx.status === 'failed' ? 'bg-red-50 border-red-100' :
          'bg-yellow-50 border-yellow-100'
        }`}>
          <div className="flex items-center gap-4">
            {getStatusIcon(tx.status)}
            <div>
              <h3 className="text-xl font-bold text-gray-900">₦{tx.amount.toLocaleString()}</h3>
              <p className={`font-medium ${
                tx.status === 'success' ? 'text-green-700' :
                tx.status === 'failed' ? 'text-red-700' :
                'text-yellow-700'
              } capitalize`}>
                {tx.status}
              </p>
            </div>
          </div>
          
          <div className="text-right sm:text-left">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Reference</p>
            <p className="font-mono font-medium text-gray-900 text-lg">{tx.refId}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Service Type</p>
              <p className="font-medium text-gray-900 capitalize">{tx.type} {tx.network && `- ${tx.network}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium text-gray-900">{new Date(tx.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-4">
            {tx.userId ? (
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <button 
                  onClick={() => navigate(`/users/${tx.userId._id}`)}
                  className="font-medium text-[#1B3A6B] hover:underline block"
                >
                  {tx.userId.name || tx.userId.phone}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">System / Unknown</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Aggregator Notes</p>
              <p className="font-medium text-gray-900 text-sm bg-gray-50 p-2 rounded border border-gray-100 min-h-[40px] break-all">
                {tx.adminNote || tx.providerResponse || 'No notes available'}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Actions for Failed/Pending Tx */}
        {tx.status !== 'success' && (
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-wrap gap-3">
            <button 
              onClick={() => setActionModal({ isOpen: true, type: 'retry' })}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              <RefreshCw className="w-4 h-4" /> Retry via API
            </button>
            <button 
              onClick={() => setActionModal({ isOpen: true, type: 'resolve' })}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <CheckCircle2 className="w-4 h-4" /> Force Success
            </button>
            <button 
              onClick={() => setActionModal({ isOpen: true, type: 'refund' })}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium ml-auto sm:ml-0"
            >
              <ShieldAlert className="w-4 h-4" /> Issue Refund
            </button>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {actionModal.type === 'resolve' ? 'Force Success' : actionModal.type} Transaction
              </h3>
              <button onClick={() => setActionModal({ isOpen: false, type: null })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAction} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
                You are about to {actionModal.type} transaction <strong>{tx.refId}</strong>.
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Note (Required)
                </label>
                <textarea 
                  required
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none resize-none h-24"
                  placeholder="Reason for this action..."
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
                  disabled={!adminNote}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                    actionModal.type === 'refund' ? 'bg-red-600 hover:bg-red-700' :
                    actionModal.type === 'resolve' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-[#1B3A6B] hover:bg-[#2A5A9E]'
                  }`}
                >
                  Confirm Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
