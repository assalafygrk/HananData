import { Link, Outlet } from 'react-router-dom';
import { Menu, X, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-[var(--color-primary-navy)] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--color-accent-green)] rounded-xl flex items-center justify-center font-black text-xl">
                H
              </div>
              <span className="font-bold text-2xl tracking-tight">HananData</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 font-medium">
              <Link to="/" className="hover:text-[var(--color-accent-green)] transition-colors">Home</Link>
              <Link to="/about" className="hover:text-[var(--color-accent-green)] transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-[var(--color-accent-green)] transition-colors">Contact</Link>
              
              <a href="/dashboard" className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg transition-colors border border-white/20">
                Dashboard
              </a>
              <a href="/dashboard" className="bg-[var(--color-accent-green)] hover:bg-[#2d8d00] text-white px-5 py-2.5 rounded-lg transition-colors font-semibold shadow-lg shadow-green-900/20">
                Login / Register
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-[var(--color-accent-green)] focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#132a4e] border-t border-white/10 absolute w-full left-0 animate-fade-in-up">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-white/10">Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-white/10">About Us</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium hover:bg-white/10">Contact</Link>
              <div className="pt-4 flex flex-col gap-3">
                <a href="/dashboard" className="block text-center bg-white/10 px-4 py-3 rounded-lg font-medium">Dashboard</a>
                <a href="/dashboard" className="block text-center bg-[var(--color-accent-green)] text-white px-4 py-3 rounded-lg font-bold">Login / Register</a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-dark-bg)] text-slate-300 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[var(--color-accent-green)] rounded-lg flex items-center justify-center font-black text-white">
                H
              </div>
              <span className="font-bold text-xl text-white tracking-tight">HananData</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              The ultimate Nigerian VTU service app. Buy cheap data, airtime, and pay bills securely and instantly.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-[var(--color-accent-green)] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[var(--color-accent-green)] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-accent-green)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Get the App</h3>
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl transition-colors border border-slate-700 w-fit">
                <Smartphone size={20} className="text-[var(--color-accent-green)]" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-slate-400">GET IT ON</div>
                  <div className="font-semibold text-white leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} HananData. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
