import { useState } from 'react';
import { Search, Info, AlertTriangle, XCircle, AlertOctagon, ActivitySquare, Filter, Trash2, Download, Eye, X } from 'lucide-react';

export function SystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'critical'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'admin_panel' | 'mobile_app' | 'system'>('all');
  
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;

    return matchesSearch && matchesLevel && matchesSource;
  });

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all system logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const getLevelIcon = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'critical': return <AlertOctagon className="w-4 h-4 text-red-700" />;
    }
  };

  const getLevelBadge = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
    }
  };

  const getSourceBadge = (source: SystemLog['source']) => {
    switch (source) {
      case 'admin_panel': return 'bg-purple-100 text-purple-800';
      case 'mobile_app': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1B3A6B]/10 rounded-lg text-[#1B3A6B]">
            <ActivitySquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">System Logs</h2>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All Logs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search actor, action, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-500 hidden md:block" />
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none bg-white min-w-[140px]"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>

            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none bg-white min-w-[140px]"
            >
              <option value="all">All Sources</option>
              <option value="admin_panel">Admin Panel</option>
              <option value="mobile_app">Mobile App</option>
              <option value="system">System Events</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Level</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Actor</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right min-w-[120px]">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getLevelBadge(log.level)}`}>
                      {getLevelIcon(log.level)}
                      {log.level}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${getSourceBadge(log.source)}`}>
                      {log.source.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{log.actor}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 truncate max-w-[200px]">{log.action}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {getLevelIcon(selectedLog.level)}
                Log Details
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Timestamp</p>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Actor</p>
                  <p className="text-sm font-medium text-[#1B3A6B] mt-1">{selectedLog.actor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Source</p>
                  <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium ${getSourceBadge(selectedLog.source)}`}>
                    {selectedLog.source.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Level</p>
                  <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium uppercase ${getLevelBadge(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase">Action</p>
                <p className="text-base font-medium text-gray-900 mt-1">{selectedLog.action}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Detailed Message</p>
                <p className="text-sm text-gray-800 font-mono break-words">{selectedLog.details}</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  handleDeleteLog(selectedLog.id);
                  setSelectedLog(null);
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                Delete Log
              </button>
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1B3A6B] hover:bg-[#2A5A9E] rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
