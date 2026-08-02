import { useState, useEffect } from 'react';
import { Send, Clock, Users, Megaphone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export function NotificationsBroadcast() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [segment, setSegment] = useState('all');
  const [schedule, setSchedule] = useState('');
  
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await api.get('/admin/broadcasts');
      if (res.data.success) {
        setBroadcasts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsSending(true);
    try {
      await api.post('/admin/broadcasts', {
        subject,
        message,
        segment,
        sentAt: schedule || new Date().toISOString()
      });
      await fetchBroadcasts();
      setSubject('');
      setMessage('');
      setSegment('all');
      setSchedule('');
      toast.success('Broadcast sent successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Push Notifications</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#1B3A6B]" />
              Compose Broadcast
            </h3>
            
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Segment</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none text-sm"
                  >
                    <option value="all">All Users</option>
                    <option value="tier1">Tier 1 Users</option>
                    <option value="tier2">Tier 2 Users</option>
                    <option value="tier3">Tier 3 Users</option>
                    <option value="suspended">Suspended Accounts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none text-sm"
                  placeholder="e.g. System Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none resize-none h-32 text-sm"
                  placeholder="Type your message here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="datetime-local" 
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-[#1B3A6B] outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={!subject || !message || isSending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1B3A6B] text-white rounded-lg font-medium hover:bg-[#2A5A9E] transition-colors disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {schedule ? 'Schedule Broadcast' : 'Send Now'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Broadcast History</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading broadcasts...
                </div>
              ) : broadcasts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No previous broadcasts.
                </div>
              ) : (
                broadcasts.map((b) => (
                  <div key={b.id || b._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{b.subject}</h4>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {new Date(b.sentAt || b.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{b.message}</p>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1 text-[#1B3A6B] bg-blue-50 px-2 py-1 rounded">
                        <Users className="w-3 h-3" /> Target: {b.segment}
                      </span>
                      <span className="text-gray-500">
                        Sent by: {b.sentBy || 'Super Admin'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
