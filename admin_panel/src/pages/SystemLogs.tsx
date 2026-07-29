import { useState } from 'react';
import { mockLogs } from '../mocks/data';
import { SystemLog } from '../mocks/types';
import { Search, Info, AlertTriangle, XCircle, AlertOctagon, ActivitySquare, Filter } from 'lucide-react';

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'critical'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'admin_panel' | 'mobile_app' | 'system'>('all');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;

    return matchesSearch && matchesLevel && matchesSource;
  });

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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1B3A6B]/10 rounded-lg text-[#1B3A6B]">
            <ActivitySquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">System Logs</h2>
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
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Action & Details</th>
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
                    <div className="font-medium text-gray-900">{log.action}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{log.details}</div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
