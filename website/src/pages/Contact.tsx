import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex flex-col w-full animate-fade-in-up">
      {/* Header */}
      <section className="bg-[var(--color-primary-navy)] py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Have questions or need assistance? Our support team is here to help 24/7.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
          {/* Contact Info */}
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-bold text-[var(--color-primary-navy)] mb-8">Get in Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[var(--color-primary-blue)] rounded-xl flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-1">Email Support</h4>
                <p className="text-slate-500">support@hanandata.com</p>
                <p className="text-sm text-slate-400 mt-1">We typically reply within 2 hours.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 text-[var(--color-accent-green)] rounded-xl flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-1">Phone</h4>
                <p className="text-slate-500">+234 800 000 0000</p>
                <p className="text-sm text-slate-400 mt-1">Available Mon-Fri, 9am - 5pm</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-1">Office</h4>
                <p className="text-slate-500">123 Tech Avenue, Lagos, Nigeria.</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] transition-shadow" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] transition-shadow" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] transition-shadow" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-[var(--color-primary-navy)] hover:bg-[#12284c] text-white font-bold py-4 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
