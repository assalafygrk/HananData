import { useState, useEffect, useRef } from 'react';
import { Search, Command, FileText, Users, CreditCard, Tag, Link2, Bell, Shield, Settings, ActivitySquare, Wallet, Gift, BarChart3, X, Loader2, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_PAGES = [
  { name: 'Dashboard', path: '/dashboard', icon: FileText, category: 'Pages' },
  { name: 'Users', path: '/users', icon: Users, category: 'Pages' },
  { name: 'Transactions', path: '/transactions', icon: CreditCard, category: 'Pages' },
  { name: 'Pricing', path: '/pricing', icon: Tag, category: 'Pages' },
  { name: 'API Wallets', path: '/api-wallets', icon: Wallet, category: 'Pages' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, category: 'Pages' },
  { name: 'Referrals', path: '/referrals', icon: Gift, category: 'Pages' },
  { name: 'Aggregator', path: '/aggregator', icon: Link2, category: 'Pages' },
  { name: 'Notifications', path: '/notifications', icon: Bell, category: 'Pages' },
  { name: 'Roles', path: '/roles', icon: Shield, category: 'Pages' },
  { name: 'System Logs', path: '/system-logs', icon: ActivitySquare, category: 'Pages' },
  { name: 'Settings', path: '/settings', icon: Settings, category: 'Pages' },
];

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState('');
  const [globalResults, setGlobalResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setGlobalResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchGlobalResults = async () => {
      if (query.trim().length < 2) {
        setGlobalResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await api.get(`/admin/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setGlobalResults(res.data.data);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchGlobalResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const filteredPages = ALL_PAGES.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const getResultIcon = (type: string) => {
    if (type === 'user') return <Users className="h-4 w-4 text-blue-500" />;
    if (type === 'transaction') return <CreditCard className="h-4 w-4 text-green-500" />;
    if (type === 'provider') return <Database className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getResultPath = (item: any) => {
    if (item.type === 'user') return `/users/${item.id}`;
    if (item.type === 'transaction') return `/transactions/${item.id}`;
    if (item.type === 'provider') return `/aggregator`;
    return '#';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all mx-4">
        <div className="flex items-center border-b border-gray-100 px-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="h-14 w-full border-0 bg-transparent px-4 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
            placeholder="Search pages, users, transactions, providers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />}
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-sm text-gray-500">
              <Command className="mx-auto h-8 w-8 text-gray-300 mb-3" />
              <p>Start typing to search across the dashboard.</p>
              <div className="mt-4 flex justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">Navigate to pages</span>
                <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">Find users</span>
                <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">Lookup transactions</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {filteredPages.length > 0 && (
                <div>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</h3>
                  <ul className="space-y-1">
                    {filteredPages.map((page) => (
                      <li key={page.path}>
                        <button
                          onClick={() => handleSelect(page.path)}
                          className="flex w-full items-center px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B] rounded-xl transition-colors group"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-100 mr-3 transition-colors">
                            <page.icon className="h-4 w-4 text-gray-500 group-hover:text-[#1B3A6B]" />
                          </div>
                          <span className="font-medium">{page.name}</span>
                          <span className="ml-auto text-xs text-gray-400">Go to</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {globalResults.length > 0 && (
                <div className={filteredPages.length > 0 ? "pt-2 border-t border-gray-100" : ""}>
                   <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Database Results</h3>
                   <ul className="space-y-1">
                     {globalResults.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSelect(getResultPath(item))}
                            className="flex w-full items-center px-3 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B] rounded-xl transition-colors group text-left"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-100 mr-3 transition-colors">
                              {getResultIcon(item.type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 group-hover:text-[#1B3A6B]">{item.title}</span>
                              <span className="text-xs text-gray-500">{item.subtitle}</span>
                            </div>
                            <span className="ml-auto text-xs text-gray-400 uppercase">{item.type}</span>
                          </button>
                        </li>
                     ))}
                   </ul>
                </div>
              )}

              {filteredPages.length === 0 && globalResults.length === 0 && !isSearching && (
                <div className="py-14 px-6 text-center text-sm sm:px-14">
                  <Search className="mx-auto h-6 w-6 text-gray-300" />
                  <p className="mt-4 font-semibold text-gray-900">No results found</p>
                  <p className="mt-2 text-gray-500">We couldn't find any pages, users, or transactions matching "{query}".</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs flex justify-between text-gray-500 items-center">
          <div>
             Search anything in your dashboard.
          </div>
          <div className="flex gap-2">
            <span><kbd className="font-sans border bg-white border-gray-200 px-1 py-0.5 rounded shadow-sm">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
