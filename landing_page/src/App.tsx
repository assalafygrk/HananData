import { Smartphone, Shield, Zap, Globe, Download, CheckCircle, CreditCard, Tv, Lightbulb, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    { question: "How do I fund my HananData wallet?", answer: "You can fund your wallet by transferring money to the unique virtual account number generated for you on the app. Funding is instant and automated." },
    { question: "Are your data plans valid for 30 days?", answer: "Yes, all our standard SME and Corporate Gifting data plans are valid for 30 days unless explicitly stated otherwise." },
    { question: "What should I do if a transaction fails?", answer: "If a transaction fails, our system is designed to automatically refund your wallet immediately. If the issue persists, please contact our 24/7 support." },
    { question: "Do you have an iOS app?", answer: "Our iOS app is currently in development and will be available on the App Store soon. For now, Android users can download our APK directly." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center shadow-inner">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-[#1B3A6B]">HananData</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-600 hover:text-[#1B3A6B] text-sm font-semibold transition-colors">Home</a>
              <a href="#services" className="text-gray-600 hover:text-[#1B3A6B] text-sm font-semibold transition-colors">Services</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-[#1B3A6B] text-sm font-semibold transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#1B3A6B] text-sm font-semibold transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-[#1B3A6B] text-sm font-semibold transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#download" className="text-sm font-bold text-white bg-[#1B3A6B] hover:bg-[#122a50] px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Download App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 border border-blue-100 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            HananData App v1.0 is Live!
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Premium VTU & Bills Payment in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3A6B] to-blue-400">Nigeria</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Experience the fastest, most secure, and highly reliable way to purchase Airtime, Cheap Data, Cable TV, and Electricity tokens.
          </p>
          <div id="download" className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/HananData.apk" download className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-[#1B3A6B] text-white font-bold text-lg hover:bg-[#122a50] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20">
              <Download className="w-6 h-6" />
              Download APK
            </a>
            <button className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-700 font-bold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm cursor-not-allowed opacity-70" title="Coming soon to Play Store">
              <Smartphone className="w-6 h-6 text-green-600" />
              Google Play (Soon)
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-gray-900">Everything you need in one place</h2>
            <p className="mt-4 text-xl text-gray-500 font-medium">We offer a wide range of digital utility services designed to make your life easier.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cheap Data</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Buy cheap and affordable data bundles for all networks. 30 days validity guaranteed.</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/5 transition-all group">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Airtime Top-up</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Get instant airtime recharge for MTN, Glo, Airtel, and 9Mobile with amazing discounts.</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-900/5 transition-all group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Tv className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cable TV</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Instantly activate your DSTV, GOTV, and Startimes subscriptions with zero hassle.</p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-2xl hover:shadow-yellow-900/5 transition-all group">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Electricity</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Pay for your postpaid or prepaid electricity meter tokens across all DisCos in Nigeria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">How it works</h2>
            <p className="mt-4 text-xl text-gray-500 font-medium">Get started in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-[#1B3A6B] flex items-center justify-center text-2xl font-black text-[#1B3A6B] shadow-xl mb-6">1</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Download the app and sign up in less than 60 seconds with just your email and phone number.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-[#1B3A6B] flex items-center justify-center text-2xl font-black text-[#1B3A6B] shadow-xl mb-6">2</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fund Wallet</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Transfer money to your dedicated virtual account number. Your wallet is credited instantly.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-[#1B3A6B] flex items-center justify-center text-2xl font-black text-[#1B3A6B] shadow-xl mb-6">3</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Purchasing</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Buy data, airtime, or pay bills effortlessly. Enjoy instant delivery and awesome discounts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">Unbeatable Data Rates</h2>
            <p className="mt-4 text-xl text-gray-500 font-medium">We offer the cheapest data rates in the market. (Sample Pricing)</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 p-6 font-bold text-gray-700 text-lg">
              <div>Network</div>
              <div>Plan</div>
              <div>Price</div>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="grid grid-cols-3 p-6 items-center hover:bg-gray-50 transition-colors">
                <div className="font-bold text-yellow-500 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> MTN SME</div>
                <div className="font-semibold text-gray-900">1GB</div>
                <div className="font-bold text-[#1B3A6B]">₦260</div>
              </div>
              <div className="grid grid-cols-3 p-6 items-center hover:bg-gray-50 transition-colors">
                <div className="font-bold text-red-500 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Airtel CG</div>
                <div className="font-semibold text-gray-900">1GB</div>
                <div className="font-bold text-[#1B3A6B]">₦280</div>
              </div>
              <div className="grid grid-cols-3 p-6 items-center hover:bg-gray-50 transition-colors">
                <div className="font-bold text-green-500 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Glo CG</div>
                <div className="font-semibold text-gray-900">1GB</div>
                <div className="font-bold text-[#1B3A6B]">₦270</div>
              </div>
              <div className="grid grid-cols-3 p-6 items-center hover:bg-gray-50 transition-colors">
                <div className="font-bold text-gray-800 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-800"></div> 9Mobile SME</div>
                <div className="font-semibold text-gray-900">1GB</div>
                <div className="font-bold text-[#1B3A6B]">₦250</div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8 font-medium">Download the app to see all available networks and massive volume plans!</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6 text-gray-600 font-medium leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#1B3A6B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-8">Need Help? We're here for you.</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">Our customer support team is available 24/7 to resolve any issues you might have quickly.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
            <div className="flex items-center gap-4 bg-white/10 px-8 py-6 rounded-2xl backdrop-blur-sm border border-white/20">
              <Mail className="w-8 h-8 text-blue-300" />
              <div className="text-left">
                <div className="text-blue-200 text-sm font-semibold mb-1">Email Us</div>
                <div className="font-bold text-lg">support@hanandata.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 px-8 py-6 rounded-2xl backdrop-blur-sm border border-white/20">
              <Phone className="w-8 h-8 text-green-300" />
              <div className="text-left">
                <div className="text-green-200 text-sm font-semibold mb-1">Call / WhatsApp</div>
                <div className="font-bold text-lg">+234 (0) 800 000 0000</div>
              </div>
            </div>
          </div>
          
          <a href="/HananData.apk" download className="inline-flex justify-center items-center gap-2 px-10 py-5 rounded-full bg-white text-[#1B3A6B] font-bold text-xl hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 active:scale-95">
            <Download className="w-6 h-6" />
            Get HananData Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center border-b border-gray-800 pb-12 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1B3A6B] flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">HananData</span>
              </div>
              <p className="max-w-sm text-gray-500 font-medium leading-relaxed">
                Securing your digital lifestyle with seamless utility payments across Nigeria. Fast, reliable, and secure.
              </p>
            </div>
            <div className="flex gap-6 md:justify-end font-semibold">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="text-center text-sm font-medium text-gray-600">
            &copy; {new Date().getFullYear()} HananData. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
