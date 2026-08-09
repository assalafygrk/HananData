
import { Smartphone, Zap, Wifi, Tv, ChevronRight, ShieldCheck, Clock, CreditCard } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-brand-navy tracking-tight">
                Hanan<span className="text-brand-green">Data</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-slate-600 hover:text-brand-navy font-medium transition-colors">Services</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-brand-navy font-medium transition-colors">How it Works</a>
              <a href="#features" className="text-slate-600 hover:text-brand-navy font-medium transition-colors">Features</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://hanandata.com/login" className="hidden md:block text-brand-navy font-semibold hover:text-brand-green transition-colors">Login</a>
              <a href="#download" className="bg-brand-navy hover:bg-brand-navy/90 text-white px-5 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                Get the App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-brand-navy/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
                <span className="flex h-2.5 w-2.5 rounded-full bg-brand-green"></span>
                <span className="text-sm font-semibold text-slate-700">Nigeria's Most Reliable VTU App</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Simplify Your <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-navy to-brand-green">Top-ups & Bills</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Instant Data, Airtime, Cable TV, and Electricity payments at your fingertips. Join thousands of Nigerians enjoying fast, seamless, and secure transactions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4" id="download">
                <a href="#" className="flex items-center justify-center space-x-3 w-full sm:w-auto bg-black hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.8 3.59-.72 1.61.16 2.76.77 3.51 1.95-2.91 1.77-2.39 5.86.41 7.02-.69 1.63-1.6 3.12-2.59 3.92zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center justify-center space-x-3 w-full sm:w-auto bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.1 3.4l11.4 12.3 4.2-4.5L3.1 3.4zm16.7 8.9L15.3 16l4.5 4.9 3.1-8.6-3.1-8.6zm-11 1.5L3 20.6l15.3 1.1-9.5-7.9zM2.8 2.2L1 4.1l7.8 8.4-6 6.5 1.7 1.9 6.1-6.5L18.4 22l2.8-3-18.4-16.8z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-6 relative">
              {/* App Mockup Placeholder - using a styled generic card for now */}
              <div className="relative mx-auto w-full max-w-[320px] aspect-[1/2.1] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden z-10">
                {/* Mock App Header */}
                <div className="bg-brand-navy h-48 rounded-b-3xl p-6 text-white pt-10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs text-brand-navy-100 opacity-80">Total Balance</p>
                      <h3 className="text-2xl font-bold">₦45,250.00</h3>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium">Fund Wallet</div>
                  </div>
                </div>
                {/* Mock App Body */}
                <div className="p-6">
                  <h4 className="font-semibold text-slate-800 mb-4 text-sm">Quick Services</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-slate-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Smartphone size={20}/></div>
                      <span className="text-xs font-semibold">Airtime</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-slate-100">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-brand-green"><Wifi size={20}/></div>
                      <span className="text-xs font-semibold">Data</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-slate-100">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Tv size={20}/></div>
                      <span className="text-xs font-semibold">Cable TV</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-slate-100">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600"><Zap size={20}/></div>
                      <span className="text-xs font-semibold">Electricity</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements behind phone */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-brand-green/20 rounded-full blur-xl z-0"></div>
              <div className="absolute bottom-10 right-0 translate-x-1/4 w-32 h-32 bg-brand-navy/20 rounded-full blur-xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-green font-semibold tracking-wide uppercase text-sm mb-3">What We Offer</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Everything you need, in one app</h3>
            <p className="text-lg text-slate-600">Enjoy discounted rates on everyday digital services. We process thousands of transactions daily with a 99.9% uptime guarantee.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Wifi className="w-8 h-8 text-brand-green" />, title: "Cheap Data", desc: "Buy SME, Corporate and Direct data bundles for all networks at unbeatable prices." },
              { icon: <Smartphone className="w-8 h-8 text-blue-500" />, title: "Airtime Top-up", desc: "Instant recharge for MTN, GLO, Airtel, and 9mobile with attractive cashback." },
              { icon: <Tv className="w-8 h-8 text-purple-500" />, title: "Cable TV", desc: "Instantly subscribe to DSTV, GOTV, and Startimes without any hidden charges." },
              { icon: <Zap className="w-8 h-8 text-orange-500" />, title: "Electricity Bills", desc: "Pay for prepaid and postpaid electricity across all discos in Nigeria instantly." }
            ].map((service, idx) => (
              <div key={idx} className="bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-navy/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-brand-green font-semibold tracking-wide uppercase text-sm mb-3">Getting Started</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-6">Simple. Fast. Secure.</h3>
              <p className="text-lg text-slate-300 mb-10">You're just three steps away from experiencing the easiest way to manage your utility payments and top-ups.</p>
              
              <div className="space-y-8">
                {[
                  { step: "01", title: "Create an Account", desc: "Download the app and sign up in less than 2 minutes using just your email and phone number." },
                  { step: "02", title: "Fund your Wallet", desc: "Instantly fund your wallet via bank transfer to your dedicated virtual account number." },
                  { step: "03", title: "Start Transacting", desc: "Buy data, airtime, or pay bills. Enjoy instant delivery and automated receipts." }
                ].map((item, idx) => (
                  <div key={idx} className="flex">
                    <div className="mr-6">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-green font-bold text-lg border border-white/10">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Abstract App Flow Illustration */}
              <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-brand-navy to-brand-green/80 rounded-[3rem] p-8 shadow-2xl transform rotate-3">
                <div className="w-full h-full bg-slate-900/40 backdrop-blur-sm rounded-[2rem] border border-white/20 flex flex-col justify-center items-center p-8 text-center">
                  <ShieldCheck size={64} className="text-white mb-6" />
                  <h4 className="text-2xl font-bold mb-2">Bank-grade Security</h4>
                  <p className="text-slate-300">All transactions are encrypted and secured with modern authentication protocols including Biometric and PIN support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Features Highlights */}
      <section id="features" className="py-24 bg-brand-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-navy shadow-md mb-6">
                <Clock size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">24/7 Availability</h4>
              <p className="text-slate-600">Our services run round the clock. Automations ensure your orders are processed instantly, day or night.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-navy shadow-md mb-6">
                <CreditCard size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Multiple Funding Options</h4>
              <p className="text-slate-600">Fund your wallet easily via Dedicated Virtual Accounts (Moniepoint, Wema, Sterling) or direct card payments.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-navy shadow-md mb-6">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Secure Transactions</h4>
              <p className="text-slate-600">Your funds and data are safe. We enforce transaction PINs and biometric authentication for every purchase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to simplify your bills?</h2>
          <p className="text-xl text-brand-navy-100 mb-10 opacity-90">Join the smart way to pay for everyday digital services in Nigeria.</p>
          <button className="bg-brand-green hover:bg-brand-green/90 text-white text-lg font-bold px-10 py-4 rounded-full transition-transform transform hover:scale-105 shadow-xl flex items-center mx-auto">
            Get Started Now
            <ChevronRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-extrabold text-brand-navy tracking-tight mb-4 block">
                Hanan<span className="text-brand-green">Data</span>
              </span>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                Your reliable partner for affordable data, airtime, cable TV, and electricity payments in Nigeria.
              </p>
              <div className="flex space-x-4">
                {/* Social placeholders */}
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-brand-navy hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-brand-navy hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="text-slate-500 hover:text-brand-green transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="text-slate-500 hover:text-brand-green transition-colors">How it Works</a></li>
                <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Refund Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} HananData. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Built with secure & modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
