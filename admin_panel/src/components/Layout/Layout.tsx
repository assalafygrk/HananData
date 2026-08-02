import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CreditCard, Tag, Link2, 
  Bell, Shield, Settings, LogOut, Menu, BarChart3, Gift, Wallet, ActivitySquare, Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { QuickSearchModal } from './QuickSearchModal';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const dataStr = localStorage.getItem('adminData');
    if (dataStr) {
      try {
        setAdminData(JSON.parse(dataStr));
      } catch (e) {}
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Transactions', path: '/transactions', icon: CreditCard },
    { name: 'Pricing', path: '/pricing', icon: Tag },
    { name: 'API Wallets', path: '/api-wallets', icon: Wallet },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Referrals', path: '/referrals', icon: Gift },
    { name: 'Aggregator', path: '/aggregator', icon: Link2 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Roles', path: '/roles', icon: Shield },
    { name: 'System Logs', path: '/system-logs', icon: ActivitySquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/login');
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const adminName = adminData?.name || 'Super Admin';
  const adminEmail = adminData?.email || 'admin@hanandata.com';
  const initials = adminName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1B3A6B] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wider">HANAN DATA</h1>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white/10 text-white font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 px-4 lg:px-8 flex justify-center lg:justify-start">
             <button 
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center w-full max-w-sm bg-gray-100/80 text-gray-500 hover:bg-gray-200/80 px-4 py-2 rounded-xl text-sm transition-colors border border-gray-200"
             >
                <Search className="w-4 h-4 mr-2 text-gray-400" />
                <span>Quick search...</span>
                <div className="ml-auto flex items-center gap-1 opacity-70">
                  <kbd className="font-sans text-[10px] font-semibold bg-white border border-gray-300 rounded px-1.5 py-0.5">Ctrl</kbd>
                  <span className="text-xs">+</span>
                  <kbd className="font-sans text-[10px] font-semibold bg-white border border-gray-300 rounded px-1.5 py-0.5">K</kbd>
                </div>
             </button>
             <button 
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
             >
                <Search className="w-5 h-5" />
             </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-gray-900">{adminName}</p>
              <p className="text-gray-500 text-xs">{adminEmail}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-100 text-[#1B3A6B] flex items-center justify-center font-bold">
              {initials}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
