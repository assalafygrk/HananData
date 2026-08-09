import { Users, Target, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col w-full animate-fade-in-up">
      {/* Header */}
      <section className="bg-[var(--color-primary-navy)] py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">About HananData</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            We are on a mission to simplify digital payments and connectivity for every Nigerian.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                HananData was born out of a simple necessity: the need for a fast, reliable, and affordable way to top up airtime, purchase data, and pay everyday bills.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                We noticed that Nigerians were paying exorbitant fees and experiencing frequent downtime with existing solutions. We decided to build a platform that puts the user first—combining cutting-edge technology with unmatched customer support.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <Users className="text-[var(--color-primary-blue)] mb-4" size={32} />
                <h3 className="text-xl font-bold text-slate-800 mb-2">10k+ Users</h3>
                <p className="text-slate-500">Trust us for their daily digital needs.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <Target className="text-[var(--color-accent-green)] mb-4" size={32} />
                <h3 className="text-xl font-bold text-slate-800 mb-2">99.9% Uptime</h3>
                <p className="text-slate-500">Reliable servers that never sleep.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:col-span-2">
                <ShieldCheck className="text-purple-500 mb-4" size={32} />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Secure Transactions</h3>
                <p className="text-slate-500">Your funds and data are protected with enterprise-grade encryption.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
