import React from 'react';
import { Smartphone, Shield, Zap, Globe, Download, ChevronRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1B3A6B]">HananData</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
              <a href="https://admin.hanandata.com" className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors">Admin Login</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-6 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            HananData App is Live!
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Seamless VTU & Bills Payment in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3A6B] to-blue-500">Nigeria</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            Experience the fastest, most secure, and highly reliable way to purchase Airtime, Data, Cable Subscriptions, and Electricity tokens.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/HananData.apk" download className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-[#1B3A6B] text-white font-semibold hover:bg-[#122a50] transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
              <Download className="w-5 h-5" />
              Download APK
            </a>
            <button className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-700 font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm cursor-not-allowed opacity-80" title="Coming soon to Play Store">
              <Smartphone className="w-5 h-5 text-green-600" />
              Google Play (Soon)
            </button>
            <button className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-700 font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm cursor-not-allowed opacity-80" title="Coming soon to App Store">
              <Smartphone className="w-5 h-5 text-gray-900" />
              App Store (Soon)
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why choose HananData?</h2>
            <p className="mt-4 text-lg text-gray-500">Premium services tailored for your digital lifestyle.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated VTU system ensures instant delivery of your data, airtime, and bill payments. No delays.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data and wallet are protected by industry-leading encryption and strict PIN authentications.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Available 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                Our services are always online. Whenever you need to recharge or pay bills, HananData is ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center border-b border-gray-800 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">HananData</span>
              </div>
              <p className="max-w-xs">Securing your digital lifestyle with seamless utility payments across Nigeria.</p>
            </div>
            <div className="flex gap-4 md:justify-end">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="text-center text-sm">
            &copy; {new Date().getFullYear()} HananData. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
