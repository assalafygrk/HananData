import { ArrowRight, Zap, Shield, Clock, Phone, Wifi, Tv, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const services = [
    { icon: <Wifi className="text-[var(--color-primary-blue)]" size={32} />, title: 'Cheap Data', desc: 'Get the best data rates across all networks in Nigeria instantly.' },
    { icon: <Phone className="text-[var(--color-accent-green)]" size={32} />, title: 'Airtime Top-up', desc: 'Recharge your line seamlessly with zero delays and instant delivery.' },
    { icon: <Tv className="text-purple-500" size={32} />, title: 'Cable TV', desc: 'Subscribe to DSTV, GOTV, and Startimes without leaving your home.' },
    { icon: <Lightbulb className="text-amber-500" size={32} />, title: 'Electricity Bills', desc: 'Pay your electricity bills for all DisCos instantly and securely.' }
  ];

  const features = [
    { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'All transactions are processed in seconds. No waiting time.' },
    { icon: <Shield size={24} />, title: '100% Secure', desc: 'Bank-grade encryption ensures your money and data are safe.' },
    { icon: <Clock size={24} />, title: '24/7 Support', desc: 'Our dedicated team is always ready to assist you anytime.' }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-primary-navy)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A6B] to-[#12284c] z-0"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[var(--color-primary-blue)]/20 blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[var(--color-accent-green)]/10 blur-3xl z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-[var(--color-accent-green)] font-semibold text-sm mb-6 border border-white/10">
              #1 VTU Platform in Nigeria 🇳🇬
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-green)] to-green-300">VTU Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Buy cheap data, airtime, and pay bills seamlessly. Join thousands of Nigerians who trust HananData for their daily top-ups.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[var(--color-accent-green)] hover:bg-[#2d8d00] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2">
                Get Started Now <ArrowRight size={20} />
              </a>
              <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all border border-white/20 text-center">
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Right Image/Mockup */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[4/5] bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
              {/* Abstract App Mockup instead of an image to keep it clean */}
              <div className="w-full h-full bg-[#f8fafc] rounded-2xl overflow-hidden shadow-inner flex flex-col relative">
                <div className="bg-[var(--color-primary-navy)] h-16 w-full flex items-center px-4 rounded-t-2xl">
                  <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  <div className="ml-3 h-4 w-24 bg-white/20 rounded-full"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="w-full h-32 bg-gradient-to-r from-[var(--color-primary-navy)] to-[var(--color-primary-blue)] rounded-xl p-4 flex flex-col justify-between shadow-md">
                    <div className="text-white/80 text-sm">Wallet Balance</div>
                    <div className="text-white font-bold text-2xl">₦50,240.00</div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-lg"></div>)}
                  </div>
                  <div className="mt-4 flex-1 bg-slate-100 rounded-xl p-4">
                    <div className="h-4 w-32 bg-slate-300 rounded-full mb-4"></div>
                    <div className="space-y-3">
                      {[1,2,3].map(i => <div key={i} className="h-10 w-full bg-slate-200 rounded-lg"></div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-navy)] mb-4">Our Services</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Everything you need to stay connected and powered up, all in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-navy)] mb-6">Why Choose HananData?</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                We've built our platform from the ground up to provide the most reliable, fast, and secure VTU experience in the country.
              </p>
              
              <div className="space-y-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 w-12 h-12 bg-blue-100 text-[var(--color-primary-blue)] rounded-xl flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h4>
                      <p className="text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-[var(--color-primary-navy)] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h3 className="text-2xl font-bold mb-6 relative z-10">Ready to start?</h3>
                <p className="text-slate-300 mb-8 relative z-10 leading-relaxed">
                  Create an account in less than 2 minutes and start enjoying discounted rates on all your digital purchases.
                </p>
                <div className="space-y-4 relative z-10">
                  <a href="/dashboard" className="block w-full text-center bg-white text-[var(--color-primary-navy)] hover:bg-slate-100 font-bold py-4 rounded-xl transition-colors">
                    Create Free Account
                  </a>
                  <a href="/dashboard" className="block w-full text-center bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-colors">
                    Login to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
