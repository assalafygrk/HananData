import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | "splash" | "onboarding" | "login" | "signup"
  | "home" | "data" | "airtime" | "cable" | "electricity" | "airtimecash"
  | "confirm" | "success" | "failed"
  | "history" | "wallet" | "profile";

interface TxnData {
  type: string;
  network?: string;
  networkColor?: string;
  recipient?: string;
  plan?: string;
  amount: number;
  fee: number;
  total: number;
  description: string;
  provider?: string;
  meterNumber?: string;
  refId?: string;
}

// ─── Data Constants ───────────────────────────────────────────────────────────

const NETWORKS = [
  { id: "mtn",     name: "MTN",     color: "#FFCC00", bg: "#FFFBE6", text: "#7A6000", dot: "#E6B800" },
  { id: "airtel",  name: "Airtel",  color: "#E4002B", bg: "#FFF0F2", text: "#B80022", dot: "#E4002B" },
  { id: "glo",     name: "Glo",     color: "#009A44", bg: "#E8F5EE", text: "#006B2F", dot: "#009A44" },
  { id: "9mobile", name: "9mobile", color: "#006E51", bg: "#E6F1EE", text: "#004D38", dot: "#006E51" },
];

const DATA_PLANS = {
  daily: [
    { id: "d1", size: "100MB", price: 100, validity: "1 Day" },
    { id: "d2", size: "200MB", price: 150, validity: "1 Day" },
    { id: "d3", size: "500MB", price: 200, validity: "1 Day" },
    { id: "d4", size: "1GB",   price: 350, validity: "1 Day" },
  ],
  weekly: [
    { id: "w1", size: "1GB",  price: 300,  validity: "7 Days" },
    { id: "w2", size: "2GB",  price: 500,  validity: "7 Days" },
    { id: "w3", size: "5GB",  price: 1000, validity: "7 Days" },
    { id: "w4", size: "10GB", price: 1500, validity: "7 Days" },
  ],
  monthly: [
    { id: "m1", size: "3GB",  price: 1000, validity: "30 Days" },
    { id: "m2", size: "10GB", price: 2500, validity: "30 Days" },
    { id: "m3", size: "20GB", price: 4500, validity: "30 Days" },
    { id: "m4", size: "50GB", price: 9000, validity: "30 Days" },
  ],
};

const CABLE_PROVIDERS = [
  { id: "dstv",      name: "DStv",      color: "#003087", bg: "#E8F0FB" },
  { id: "gotv",      name: "GOtv",      color: "#0070BA", bg: "#E8F4FB" },
  { id: "startimes", name: "StarTimes", color: "#CC1020", bg: "#FDEBEC" },
];

const CABLE_PACKAGES: Record<string, { id: string; name: string; price: number; channels: string }[]> = {
  dstv: [
    { id: "cp1", name: "Padi",         price: 2500,  channels: "77 channels" },
    { id: "cp2", name: "Yanga",        price: 3500,  channels: "110 channels" },
    { id: "cp3", name: "Confam",       price: 6200,  channels: "152 channels" },
    { id: "cp4", name: "Compact",      price: 10500, channels: "190 channels" },
    { id: "cp5", name: "Compact Plus", price: 16600, channels: "218 channels" },
    { id: "cp6", name: "Premium",      price: 29500, channels: "254 channels" },
  ],
  gotv: [
    { id: "gp1", name: "Lite",  price: 410,  channels: "20 channels" },
    { id: "gp2", name: "Jinja", price: 1640, channels: "40 channels" },
    { id: "gp3", name: "Jolli", price: 2460, channels: "55 channels" },
    { id: "gp4", name: "Max",   price: 4150, channels: "75 channels" },
    { id: "gp5", name: "Supa",  price: 6400, channels: "100+ channels" },
  ],
  startimes: [
    { id: "sp1", name: "Nova",    price: 900,  channels: "30 channels" },
    { id: "sp2", name: "Basic",   price: 1850, channels: "50 channels" },
    { id: "sp3", name: "Smart",   price: 2600, channels: "70 channels" },
    { id: "sp4", name: "Classic", price: 3100, channels: "90 channels" },
  ],
};

const DISCOS = [
  "Ikeja Electric (IKEDC)", "Eko Electric (EKEDC)", "Abuja Electric (AEDC)",
  "Enugu Electric (EEDC)", "Port Harcourt Electric (PHED)", "Ibadan Electric (IBEDC)",
  "Kano Electric (KEDCO)", "Jos Electric (JED)", "Kaduna Electric (KAEDCO)",
  "Benin Electric (BEDC)", "Yola Electric (YEDC)",
];

const HISTORY_ITEMS = [
  { id: "h1", type: "data",        network: "MTN",     desc: "5GB Data · 30 Days",     amount: -1000,  date: "Today, 2:30 PM",   status: "success" },
  { id: "h2", type: "airtime",     network: "Airtel",  desc: "₦500 Airtime",            amount: -500,   date: "Today, 9:15 AM",   status: "success" },
  { id: "h3", type: "cable",       network: null,      desc: "DStv Compact",            amount: -10500, date: "Jul 14, 9:00 AM",  status: "success" },
  { id: "h4", type: "electricity", network: null,      desc: "Ikeja Electric · ₦5,000", amount: -5000,  date: "Jul 12, 3:45 PM",  status: "failed"  },
  { id: "h5", type: "wallet",      network: null,      desc: "Wallet Funding",          amount: 20000,  date: "Jul 10, 10:20 AM", status: "success" },
  { id: "h6", type: "data",        network: "Glo",     desc: "10GB Data · 30 Days",     amount: -2500,  date: "Jul 8, 8:00 AM",   status: "success" },
  { id: "h7", type: "airtimecash", network: "MTN",     desc: "₦500 Airtime → Cash",     amount: 375,    date: "Jul 7, 1:00 PM",   status: "success" },
  { id: "h8", type: "airtime",     network: "9mobile", desc: "₦200 Airtime",            amount: -200,   date: "Jul 5, 6:10 PM",   status: "success" },
  { id: "h9", type: "cable",       network: null,      desc: "GOtv Max",                amount: -4150,  date: "Jul 3, 11:00 AM",  status: "success" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString("en-NG");
const D = "var(--font-display)";

function genRef() {
  return "HND" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IcoHome({ active }: { active?: boolean }) {
  const c = active ? "#1B3A6B" : "#6B7A99";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 21V12h6v9" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IcoHistory({ active }: { active?: boolean }) {
  const c = active ? "#1B3A6B" : "#6B7A99";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8"/>
      <path d="M12 7v5l3 3" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IcoWalletNav({ active }: { active?: boolean }) {
  const c = active ? "#1B3A6B" : "#6B7A99";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke={c} strokeWidth="1.8"/>
      <path d="M2 10h20" stroke={c} strokeWidth="1.8"/>
      <circle cx="17" cy="15" r="1.5" fill={c}/>
    </svg>
  );
}
function IcoProfile({ active }: { active?: boolean }) {
  const c = active ? "#1B3A6B" : "#6B7A99";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IcoBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 10a6 6 0 0112 0v4l2 2H4l2-2v-4z" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M10 18a2 2 0 004 0" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IcoBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15 19l-7-7 7-7" stroke="#0D1B35" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IcoData() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="14" width="3" height="7" rx="1" fill="#1B3A6B"/>
      <rect x="8" y="10" width="3" height="11" rx="1" fill="#1B3A6B" opacity=".7"/>
      <rect x="13" y="6" width="3" height="15" rx="1" fill="#1B3A6B" opacity=".5"/>
      <rect x="18" y="3" width="3" height="18" rx="1" fill="#1B3A6B" opacity=".3"/>
    </svg>
  );
}
function IcoAirtime() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="3" stroke="#1B3A6B" strokeWidth="1.8"/>
      <circle cx="12" cy="18" r="1" fill="#1B3A6B"/>
      <path d="M9 6h6" stroke="#1B3A6B" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IcoCable() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="13" rx="2" stroke="#1B3A6B" strokeWidth="1.8"/>
      <path d="M8 19v2M16 19v2M5 22h14" stroke="#1B3A6B" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="#1B3A6B" strokeWidth="1.8"/>
    </svg>
  );
}
function IcoElectric() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#1B3A6B" strokeLinejoin="round"/>
    </svg>
  );
}
function IcoConvert() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 16l-4-4 4-4" stroke="#1B3A6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h18" stroke="#1B3A6B" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 8l4 4-4 4" stroke="#1B3A6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IcoWalletAction() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="#1B3A6B" strokeWidth="1.8"/>
      <path d="M2 10h20" stroke="#1B3A6B" strokeWidth="1.8"/>
      <circle cx="17" cy="15" r="1.5" fill="#1B3A6B"/>
    </svg>
  );
}
function IcoShare() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="#1B3A6B" strokeWidth="1.8"/>
      <circle cx="6" cy="12" r="3" stroke="#1B3A6B" strokeWidth="1.8"/>
      <circle cx="18" cy="19" r="3" stroke="#1B3A6B" strokeWidth="1.8"/>
      <path d="M8.6 13.7l6.8 3.6M15.4 6.7L8.6 10.3" stroke="#1B3A6B" strokeWidth="1.8"/>
    </svg>
  );
}
function IcoChevRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke="#B8C4D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IcoChevDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "rgba(255,255,255,0.8)" : "#0D1B35";
  return (
    <div className="flex justify-between items-center px-6 pt-4 pb-1 text-[11px] font-semibold" style={{ color: c, fontFamily: D }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="14" height="11" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="4" width="3" height="8" rx="1" opacity=".4"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" opacity=".6"/>
          <rect x="9" y="1" width="3" height="11" rx="1" opacity=".8"/>
          <rect x="13.5" y="0" width="2.5" height="12" rx="1"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 24 12" fill="currentColor">
          <path d="M1 4C4.6 1.3 19.4 1.3 23 4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M4.5 7C7 5 17 5 19.5 7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 10.5C9.8 9.3 14.2 9.3 16 10.5" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="13" r="1.5" fill="currentColor"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="currentColor" strokeOpacity=".35"/>
          <rect x="2" y="2" width="15" height="8" rx="1" fill="currentColor"/>
          <path d="M23 4.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity=".6"/>
        </svg>
      </div>
    </div>
  );
}

function BottomNav({ active, navigate }: { active: string; navigate: (s: Screen) => void }) {
  const items = [
    { id: "home",    label: "Home",    icon: (a: boolean) => <IcoHome active={a} /> },
    { id: "history", label: "History", icon: (a: boolean) => <IcoHistory active={a} /> },
    { id: "wallet",  label: "Wallet",  icon: (a: boolean) => <IcoWalletNav active={a} /> },
    { id: "profile", label: "Profile", icon: (a: boolean) => <IcoProfile active={a} /> },
  ] as const;
  return (
    <div className="flex bg-white border-t border-[#E2E8F4] pb-5 pt-3">
      {items.map(({ id, label, icon }) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => navigate(id as Screen)}
            className="flex-1 flex flex-col items-center gap-1">
            {icon(on)}
            <span className="text-[10px] font-bold" style={{ color: on ? "#1B3A6B" : "#6B7A99", fontFamily: D }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-[#E2E8F4]">
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "#F4F6FA" }}>
        <IcoBack />
      </button>
      <h2 className="text-[17px] font-bold text-[#0D1B35]" style={{ fontFamily: D }}>{title}</h2>
    </div>
  );
}

function PrimaryBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 rounded-2xl text-white font-bold text-[16px] transition-opacity disabled:opacity-40"
      style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #2952A3 100%)", fontFamily: D }}>
      {label}
    </button>
  );
}

function NetworkBadge({ network }: { network: string }) {
  const n = NETWORKS.find(x => x.name === network || x.id === network.toLowerCase());
  if (!n) return <span className="text-[11px] text-[#6B7A99]">{network}</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: n.bg, color: n.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: n.dot }} />
      {n.name}
    </span>
  );
}

function PINDots({ value, max = 6 }: { value: string; max?: number }) {
  return (
    <div className="flex gap-3 justify-center py-4">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all"
          style={{ borderColor: value.length > i ? "#1B3A6B" : "#E2E8F4", background: value.length > i ? "#E8EDF5" : "white" }}>
          {value.length > i && <span className="w-2.5 h-2.5 rounded-full block" style={{ background: "#1B3A6B" }} />}
        </div>
      ))}
    </div>
  );
}

function NumPad({ value, setValue, max = 6 }: { value: string; setValue: (v: string) => void; max?: number }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
        <button key={i}
          onClick={() => {
            if (k === "⌫") setValue(value.slice(0, -1));
            else if (k !== "" && value.length < max) setValue(value + String(k));
          }}
          className="py-4 rounded-2xl text-[18px] font-semibold text-[#0D1B35] transition-all active:scale-95"
          style={{ background: k === "" ? "transparent" : "white", border: k === "" ? "none" : "1px solid #E2E8F4", fontFamily: D, visibility: k === "" ? "hidden" : "visible" }}>
          {k}
        </button>
      ))}
    </div>
  );
}

// ─── SCREEN 1: Splash ─────────────────────────────────────────────────────────

function SplashScreen({ navigate }: { navigate: (s: Screen) => void }) {
  useEffect(() => {
    const t = setTimeout(() => navigate("onboarding"), 2600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(160deg, #0D1B35 0%, #1B3A6B 58%, #2952A3 100%)" }}>
      <StatusBar dark />
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="w-[88px] h-[88px] rounded-[26px] flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(145deg, #00C896, #00A87D)" }}>
          <span className="text-white font-black text-[36px]" style={{ fontFamily: D }}>H</span>
        </div>
        <div className="text-center">
          <h1 className="text-white text-[30px] font-extrabold tracking-tight" style={{ fontFamily: D }}>HananData</h1>
          <p className="text-[13px] mt-1" style={{ color: "#7BAED4" }}>Your pocket VTU companion</p>
        </div>
      </div>
      <div className="flex gap-2 justify-center pb-16">
        {[0,1,2].map(i => <span key={i} className="loading-dot w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.5)", display: "inline-block" }} />)}
      </div>
    </div>
  );
}

// ─── SCREEN 2: Onboarding ─────────────────────────────────────────────────────

const SLIDES = [
  { title: "Fast, instant top-ups",    body: "Buy data and airtime for any Nigerian network in under 10 seconds — no queues, no stress.", icon: <IcoData /> },
  { title: "Bills sorted in one tap",  body: "Pay for DStv, GOtv, PHCN electricity and more. Keep the lights on and the TV running.", icon: <IcoElectric /> },
  { title: "Turn airtime into cash",   body: "Have unused airtime? Convert it to wallet cash instantly at the best available rates.", icon: <IcoConvert /> },
];

function OnboardingScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [slide, setSlide] = useState(0);
  const s = SLIDES[slide];
  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-sm" style={{ background: "#E8EDF5" }}>
          <div style={{ transform: "scale(2.2)" }}>{s.icon}</div>
        </div>
        <div key={slide} style={{ animation: "fadeIn .35s ease both" }}>
          <h2 className="text-[26px] font-extrabold leading-tight mb-3 text-[#0D1B35]" style={{ fontFamily: D }}>{s.title}</h2>
          <p className="text-[15px] leading-relaxed text-[#6B7A99]">{s.body}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-center mb-8">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
            style={{ width: slide === i ? 28 : 8, height: 8, background: slide === i ? "#1B3A6B" : "#B8C4D9" }} />
        ))}
      </div>
      <div className="px-6 pb-10 flex flex-col gap-3">
        {slide < 2 ? (
          <div className="flex gap-3">
            <button onClick={() => navigate("login")}
              className="flex-1 py-4 rounded-2xl font-semibold text-[15px] border-2 border-[#E2E8F4] text-[#3D4F6E]"
              style={{ fontFamily: D }}>
              Skip
            </button>
            <button onClick={() => setSlide(s => s + 1)}
              className="flex-[2] py-4 rounded-2xl font-bold text-[15px] text-white"
              style={{ background: "linear-gradient(135deg, #1B3A6B, #2952A3)", fontFamily: D }}>
              Next →
            </button>
          </div>
        ) : (
          <PrimaryBtn label="Get Started" onClick={() => navigate("login")} />
        )}
      </div>
    </div>
  );
}

// ─── SCREEN 3: Login ─────────────────────────────────────────────────────────

function LoginScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"phone" | "pin">("phone");

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="px-6 pt-6 pb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(145deg, #00C896, #00A87D)" }}>
          <span className="text-white font-black text-xl" style={{ fontFamily: D }}>H</span>
        </div>
        <h1 className="text-[28px] font-extrabold text-[#0D1B35] mb-1" style={{ fontFamily: D }}>Welcome back</h1>
        <p className="text-[14px] text-[#6B7A99]">Sign in to your HananData account</p>
      </div>
      <div className="flex-1 px-6 pt-2 flex flex-col gap-5 overflow-y-auto scrollbar-hide">
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Phone Number</label>
          <div className="flex items-center gap-2 bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 focus-within:border-[#1B3A6B]">
            <span className="text-[15px] text-[#3D4F6E] font-medium border-r border-[#E2E8F4] pr-3">🇳🇬 +234</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="8012345678"
              className="flex-1 text-[15px] text-[#0D1B35] font-medium bg-transparent outline-none placeholder:text-[#B8C4D9]" />
          </div>
        </div>
        {step === "phone" ? (
          <PrimaryBtn label="Continue" onClick={() => setStep("pin")} disabled={phone.length < 10} />
        ) : (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <label className="text-[11px] font-bold text-[#3D4F6E] mb-1 block uppercase tracking-widest">Enter PIN</label>
            <PINDots value={pin} />
            <NumPad value={pin} setValue={setPin} />
            <div className="mt-4">
              <PrimaryBtn label="Sign In" onClick={() => navigate("home")} disabled={pin.length < 6} />
            </div>
            <button className="w-full text-center text-[13px] text-[#6B7A99] mt-3">Forgot PIN?</button>
          </div>
        )}
        <p className="text-center text-[14px] text-[#6B7A99]">
          New to HananData?{" "}
          <button onClick={() => navigate("signup")} className="font-bold" style={{ color: "#1B3A6B" }}>Sign up</button>
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN 4: Signup ─────────────────────────────────────────────────────────

function SignupScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const active = step === 1 ? pin : confirm;
  const setActive = step === 1 ? setPin : setConfirm;

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Create Account" onBack={() => step === 0 ? navigate("login") : setStep(s => s - 1)} />
      <div className="flex-1 px-6 py-5 flex flex-col gap-5 overflow-y-auto scrollbar-hide">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full transition-colors"
              style={{ background: i <= step ? "#1B3A6B" : "#E2E8F4" }} />
          ))}
        </div>
        {step === 0 && (
          <div className="flex flex-col gap-5" style={{ animation: "fadeIn .3s ease" }}>
            <div>
              <h2 className="text-[22px] font-extrabold text-[#0D1B35] mb-1" style={{ fontFamily: D }}>Your details</h2>
              <p className="text-sm text-[#6B7A99]">Tell us a bit about yourself</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Amaka Okonkwo"
                className="w-full bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 text-[15px] text-[#0D1B35] outline-none focus:border-[#1B3A6B]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Phone Number</label>
              <div className="flex items-center gap-2 bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5">
                <span className="text-[15px] text-[#3D4F6E] font-medium border-r border-[#E2E8F4] pr-3">🇳🇬 +234</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="8012345678"
                  className="flex-1 text-[15px] text-[#0D1B35] bg-transparent outline-none placeholder:text-[#B8C4D9]" />
              </div>
            </div>
            <PrimaryBtn label="Continue" onClick={() => setStep(1)} disabled={!name.trim() || phone.length < 10} />
          </div>
        )}
        {(step === 1 || step === 2) && (
          <div className="flex flex-col gap-4" style={{ animation: "fadeIn .3s ease" }}>
            <div>
              <h2 className="text-[22px] font-extrabold text-[#0D1B35] mb-1" style={{ fontFamily: D }}>
                {step === 1 ? "Create your PIN" : "Confirm your PIN"}
              </h2>
              <p className="text-sm text-[#6B7A99]">
                {step === 1 ? "Choose a secure 6-digit PIN" : "Re-enter to confirm"}
              </p>
            </div>
            <PINDots value={active} />
            <NumPad value={active} setValue={setActive} />
            <PrimaryBtn
              label={step === 1 ? "Continue" : "Create Account"}
              onClick={() => step === 1 ? setStep(2) : navigate("home")}
              disabled={active.length < 6}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN 5: Home ───────────────────────────────────────────────────────────

function TxnRow({ txn }: { txn: typeof HISTORY_ITEMS[0] }) {
  const icons: Record<string, ReactNode> = {
    data: <IcoData />, airtime: <IcoAirtime />, cable: <IcoCable />,
    electricity: <IcoElectric />, airtimecash: <IcoConvert />, wallet: <IcoWalletAction />,
  };
  const pos = txn.amount > 0;
  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ border: "1px solid #F0F4FA" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#F0F4FA" }}>
        {icons[txn.type] || <IcoData />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#0D1B35] truncate" style={{ fontFamily: D }}>{txn.desc}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {txn.network && <NetworkBadge network={txn.network} />}
          <span className="text-[11px] text-[#6B7A99]">{txn.date}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[14px] font-bold" style={{ fontFamily: D, color: pos ? "#00A87D" : "#0D1B35" }}>
          {pos ? "+" : ""}₦{fmt(Math.abs(txn.amount))}
        </p>
        <span className="text-[10px] font-bold uppercase tracking-wide"
          style={{ color: txn.status === "success" ? "#00C896" : "#E53E3E" }}>
          {txn.status}
        </span>
      </div>
    </div>
  );
}

function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const QUICK = [
    { label: "Buy Data",     icon: <IcoData />,         screen: "data" as Screen },
    { label: "Buy Airtime",  icon: <IcoAirtime />,      screen: "airtime" as Screen },
    { label: "Cable TV",     icon: <IcoCable />,        screen: "cable" as Screen },
    { label: "Electricity",  icon: <IcoElectric />,     screen: "electricity" as Screen },
    { label: "Airtime→Cash", icon: <IcoConvert />,      screen: "airtimecash" as Screen },
    { label: "Fund Wallet",  icon: <IcoWalletAction />, screen: "wallet" as Screen },
  ];
  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <div style={{ background: "linear-gradient(160deg, #0D1B35 0%, #1B3A6B 100%)" }}>
        <StatusBar dark />
        <div className="px-5 pt-1 pb-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-[12px] mb-0.5" style={{ color: "#7BAED4" }}>Good morning,</p>
              <h2 className="text-white text-[20px] font-bold" style={{ fontFamily: D }}>Aisha Bello 👋</h2>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: "rgba(255,255,255,0.1)" }}>
              <IcoBell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "#00C896", border: "2px solid #1B3A6B" }} />
            </button>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#7BAED4" }}>Wallet Balance</p>
            <h3 className="text-white text-[30px] font-extrabold tracking-tight mb-0.5" style={{ fontFamily: D }}>₦48,750.00</h3>
            <p className="text-[11px]" style={{ color: "#7BAED4" }}>0123 456 789 · HananData MFB</p>
            <div className="flex gap-2.5 mt-4">
              <button onClick={() => navigate("wallet")}
                className="flex items-center gap-1.5 text-white text-[13px] font-bold px-4 py-2.5 rounded-xl"
                style={{ background: "#00C896", fontFamily: D }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
                Add Money
              </button>
              <button className="flex-1 text-white text-[13px] font-semibold py-2.5 rounded-xl text-center"
                style={{ border: "1px solid rgba(255,255,255,0.25)", fontFamily: D }}>
                Send Money
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pt-5">
          <p className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK.map(({ label, icon, screen }) => (
              <button key={screen} onClick={() => navigate(screen)}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 transition-transform active:scale-95"
                style={{ border: "1px solid #E2E8F4" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F0F4FA" }}>{icon}</div>
                <span className="text-[11px] font-semibold text-center leading-tight text-[#3D4F6E]" style={{ fontFamily: D }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 pt-6 pb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-widest">Recent</p>
            <button onClick={() => navigate("history")} className="text-[13px] font-semibold" style={{ color: "#1B3A6B" }}>See all</button>
          </div>
          <div className="flex flex-col gap-2">
            {HISTORY_ITEMS.slice(0, 4).map(txn => <TxnRow key={txn.id} txn={txn} />)}
          </div>
        </div>
      </div>
      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}

// ─── SCREEN 6: Buy Data ───────────────────────────────────────────────────────

function DataScreen({ navigate, setTxn }: { navigate: (s: Screen) => void; setTxn: (t: TxnData) => void }) {
  const [netIdx, setNetIdx] = useState(0);
  const [validity, setValidity] = useState<"daily"|"weekly"|"monthly">("monthly");
  const [selected, setSelected] = useState<string | null>(null);
  const [phone, setPhone] = useState("08012345678");
  const plans = DATA_PLANS[validity];
  const net = NETWORKS[netIdx];

  function proceed() {
    const p = plans.find(x => x.id === selected)!;
    setTxn({ type: "Data Bundle", network: net.name, networkColor: net.color,
      recipient: "+234" + phone.slice(1), plan: p.size + " · " + p.validity,
      amount: p.price, fee: 0, total: p.price, description: net.name + " " + p.size + " Data", refId: genRef() });
    navigate("confirm");
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Buy Data" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 text-[15px] text-[#0D1B35] outline-none focus:border-[#1B3A6B]" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Network</label>
          <div className="flex gap-2">
            {NETWORKS.map((n, i) => (
              <button key={n.id} onClick={() => { setNetIdx(i); setSelected(null); }}
                className="flex-1 py-3 rounded-2xl text-[12px] font-bold border-2 transition-all"
                style={{ background: netIdx === i ? n.bg : "white", borderColor: netIdx === i ? n.dot : "#E2E8F4",
                  color: netIdx === i ? n.text : "#6B7A99", fontFamily: D }}>
                {n.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Plan Type</label>
          <div className="flex p-1 bg-white rounded-2xl border border-[#E2E8F4]">
            {(["daily","weekly","monthly"] as const).map(v => (
              <button key={v} onClick={() => { setValidity(v); setSelected(null); }}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold capitalize transition-all"
                style={{ background: validity === v ? "#1B3A6B" : "transparent",
                  color: validity === v ? "white" : "#6B7A99", fontFamily: D }}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {plans.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className="flex items-center justify-between bg-white rounded-2xl px-4 py-4 border-2 transition-all"
              style={{ borderColor: selected === p.id ? "#1B3A6B" : "#E2E8F4" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full border-2 transition-all"
                  style={{ borderColor: selected === p.id ? "#1B3A6B" : "#B8C4D9", background: selected === p.id ? "#1B3A6B" : "transparent" }} />
                <div className="text-left">
                  <p className="text-[15px] font-bold text-[#0D1B35]" style={{ fontFamily: D }}>{p.size}</p>
                  <p className="text-[12px] text-[#6B7A99]">{p.validity}</p>
                </div>
              </div>
              <span className="text-[16px] font-extrabold text-[#1B3A6B]" style={{ fontFamily: D }}>₦{fmt(p.price)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t border-[#E2E8F4]" style={{ background: "#F4F6FA" }}>
        <PrimaryBtn label="Proceed" onClick={proceed} disabled={!selected} />
      </div>
    </div>
  );
}

// ─── SCREEN 7: Buy Airtime ────────────────────────────────────────────────────

function AirtimeScreen({ navigate, setTxn }: { navigate: (s: Screen) => void; setTxn: (t: TxnData) => void }) {
  const [netIdx, setNetIdx] = useState(0);
  const [phone, setPhone] = useState("08012345678");
  const [amount, setAmount] = useState("");
  const QUICK = [100, 200, 500, 1000, 2000, 5000];
  const net = NETWORKS[netIdx];

  function proceed() {
    setTxn({ type: "Airtime", network: net.name, networkColor: net.color,
      recipient: "+234" + phone.slice(1), amount: Number(amount), fee: 0, total: Number(amount),
      description: net.name + " ₦" + fmt(Number(amount)) + " Airtime", refId: genRef() });
    navigate("confirm");
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Buy Airtime" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Network</label>
          <div className="flex gap-2">
            {NETWORKS.map((n, i) => (
              <button key={n.id} onClick={() => setNetIdx(i)}
                className="flex-1 py-3 rounded-2xl text-[12px] font-bold border-2 transition-all"
                style={{ background: netIdx === i ? n.bg : "white", borderColor: netIdx === i ? n.dot : "#E2E8F4",
                  color: netIdx === i ? n.text : "#6B7A99", fontFamily: D }}>
                {n.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 text-[15px] text-[#0D1B35] outline-none focus:border-[#1B3A6B]" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Amount</label>
          <div className="flex items-center bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 focus-within:border-[#1B3A6B]">
            <span className="text-[20px] font-bold text-[#B8C4D9] mr-2">₦</span>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
              type="text" inputMode="numeric" placeholder="0"
              className="flex-1 text-[22px] font-extrabold text-[#0D1B35] bg-transparent outline-none placeholder:text-[#B8C4D9]"
              style={{ fontFamily: D }} />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Quick Select</label>
          <div className="grid grid-cols-3 gap-2">
            {QUICK.map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className="py-3 rounded-xl border-2 text-[13px] font-bold transition-all"
                style={{ borderColor: amount === String(a) ? "#1B3A6B" : "#E2E8F4",
                  background: amount === String(a) ? "#E8EDF5" : "white",
                  color: amount === String(a) ? "#1B3A6B" : "#3D4F6E", fontFamily: D }}>
                ₦{fmt(a)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-[#E2E8F4]" style={{ background: "#F4F6FA" }}>
        <PrimaryBtn label="Proceed" onClick={proceed} disabled={!amount || Number(amount) < 50} />
      </div>
    </div>
  );
}

// ─── SCREEN 8: Cable TV ───────────────────────────────────────────────────────

function CableScreen({ navigate, setTxn }: { navigate: (s: Screen) => void; setTxn: (t: TxnData) => void }) {
  const [provIdx, setProvIdx] = useState(0);
  const [smartcard, setSmartcard] = useState("0123456789");
  const [selected, setSelected] = useState<string | null>(null);
  const prov = CABLE_PROVIDERS[provIdx];
  const packages = CABLE_PACKAGES[prov.id];

  function proceed() {
    const pkg = packages.find(p => p.id === selected)!;
    setTxn({ type: "Cable TV", provider: prov.name, recipient: "Smartcard: " + smartcard,
      amount: pkg.price, fee: 0, total: pkg.price,
      description: prov.name + " " + pkg.name, plan: pkg.name + " · " + pkg.channels, refId: genRef() });
    navigate("confirm");
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Cable TV" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Provider</label>
          <div className="flex gap-2">
            {CABLE_PROVIDERS.map((p, i) => (
              <button key={p.id} onClick={() => { setProvIdx(i); setSelected(null); }}
                className="flex-1 py-4 rounded-2xl font-bold text-[13px] border-2 transition-all"
                style={{ borderColor: provIdx === i ? p.color : "#E2E8F4", background: provIdx === i ? p.bg : "white",
                  color: provIdx === i ? p.color : "#6B7A99", fontFamily: D }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Smartcard / IUC Number</label>
          <input value={smartcard} onChange={e => setSmartcard(e.target.value.replace(/\D/g, ""))}
            type="text" inputMode="numeric"
            className="w-full bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 text-[15px] text-[#0D1B35] outline-none focus:border-[#1B3A6B]" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Select Package</label>
          <div className="flex flex-col gap-2">
            {packages.map(pkg => (
              <button key={pkg.id} onClick={() => setSelected(pkg.id)}
                className="flex items-center justify-between bg-white rounded-2xl px-4 py-4 border-2 transition-all"
                style={{ borderColor: selected === pkg.id ? prov.color : "#E2E8F4" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full border-2 transition-all"
                    style={{ borderColor: selected === pkg.id ? prov.color : "#B8C4D9", background: selected === pkg.id ? prov.color : "transparent" }} />
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-[#0D1B35]" style={{ fontFamily: D }}>{pkg.name}</p>
                    <p className="text-[12px] text-[#6B7A99]">{pkg.channels}</p>
                  </div>
                </div>
                <span className="text-[15px] font-extrabold text-[#1B3A6B]" style={{ fontFamily: D }}>₦{fmt(pkg.price)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-[#E2E8F4]" style={{ background: "#F4F6FA" }}>
        <PrimaryBtn label="Proceed" onClick={proceed} disabled={!selected || smartcard.length < 8} />
      </div>
    </div>
  );
}

// ─── SCREEN 9: Electricity ────────────────────────────────────────────────────

function ElectricityScreen({ navigate, setTxn }: { navigate: (s: Screen) => void; setTxn: (t: TxnData) => void }) {
  const [discoIdx, setDiscoIdx] = useState(0);
  const [meter, setMeter] = useState("12345678901");
  const [type, setType] = useState<"prepaid"|"postpaid">("prepaid");
  const [amount, setAmount] = useState("");
  const QUICK = [1000, 2000, 5000, 10000];

  function proceed() {
    setTxn({ type: "Electricity", provider: DISCOS[discoIdx], meterNumber: meter,
      recipient: type === "prepaid" ? "Prepaid · " + meter : "Postpaid · " + meter,
      amount: Number(amount), fee: 100, total: Number(amount) + 100,
      description: DISCOS[discoIdx].split(" (")[0],
      plan: (type.charAt(0).toUpperCase() + type.slice(1)) + " · Meter " + meter, refId: genRef() });
    navigate("confirm");
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Electricity" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Meter Type</label>
          <div className="flex p-1 bg-white rounded-2xl border border-[#E2E8F4]">
            {(["prepaid","postpaid"] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold capitalize transition-all"
                style={{ background: type === t ? "#1B3A6B" : "transparent",
                  color: type === t ? "white" : "#6B7A99", fontFamily: D }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Distribution Company</label>
          <div className="relative bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5">
            <select value={discoIdx} onChange={e => setDiscoIdx(Number(e.target.value))}
              className="w-full text-[14px] text-[#0D1B35] bg-transparent outline-none appearance-none pr-6">
              {DISCOS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><IcoChevDown /></div>
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Meter Number</label>
          <input value={meter} onChange={e => setMeter(e.target.value.replace(/\D/g, "").slice(0, 13))}
            type="text" inputMode="numeric" placeholder="Enter 11-digit meter number"
            className="w-full bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5 text-[15px] text-[#0D1B35] outline-none focus:border-[#1B3A6B]" />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Amount (₦)</label>
          <div className="flex items-center bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5">
            <span className="text-[20px] font-bold text-[#B8C4D9] mr-2">₦</span>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
              type="text" inputMode="numeric" placeholder="0"
              className="flex-1 text-[22px] font-extrabold text-[#0D1B35] bg-transparent outline-none placeholder:text-[#B8C4D9]"
              style={{ fontFamily: D }} />
          </div>
          <div className="flex gap-2 mt-2">
            {QUICK.map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className="flex-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all"
                style={{ borderColor: amount === String(a) ? "#1B3A6B" : "#E2E8F4",
                  background: amount === String(a) ? "#E8EDF5" : "white",
                  color: amount === String(a) ? "#1B3A6B" : "#6B7A99", fontFamily: D }}>
                ₦{fmt(a)}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: "#E6F9F4", border: "1px solid #00C896" }}>
          <p className="text-[12px] font-medium" style={{ color: "#00A87D" }}>Service fee: ₦100 · Token delivered instantly to meter</p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-[#E2E8F4]" style={{ background: "#F4F6FA" }}>
        <PrimaryBtn label="Proceed" onClick={proceed} disabled={!amount || Number(amount) < 500 || meter.length < 10} />
      </div>
    </div>
  );
}

// ─── SCREEN 10: Airtime to Cash ───────────────────────────────────────────────

function AirtimeCashScreen({ navigate, setTxn }: { navigate: (s: Screen) => void; setTxn: (t: TxnData) => void }) {
  const [netIdx, setNetIdx] = useState(0);
  const [amount, setAmount] = useState("");
  const net = NETWORKS[netIdx];
  const num = Number(amount) || 0;
  const cash = Math.floor(num * 0.75);

  function proceed() {
    setTxn({ type: "Airtime to Cash", network: net.name, networkColor: net.color,
      recipient: "HananData Wallet", amount: num, fee: num - cash, total: cash,
      description: net.name + " Airtime → Cash", plan: "25% conversion fee", refId: genRef() });
    navigate("confirm");
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Airtime to Cash" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Network</label>
          <div className="flex gap-2">
            {NETWORKS.map((n, i) => (
              <button key={n.id} onClick={() => setNetIdx(i)}
                className="flex-1 py-3 rounded-2xl text-[12px] font-bold border-2 transition-all"
                style={{ background: netIdx === i ? n.bg : "white", borderColor: netIdx === i ? n.dot : "#E2E8F4",
                  color: netIdx === i ? n.text : "#6B7A99", fontFamily: D }}>
                {n.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Airtime Amount</label>
          <div className="flex items-center bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5">
            <span className="text-[20px] font-bold text-[#B8C4D9] mr-2">₦</span>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
              type="text" inputMode="numeric" placeholder="Minimum ₦100"
              className="flex-1 text-[22px] font-extrabold text-[#0D1B35] bg-transparent outline-none placeholder:text-[#B8C4D9]"
              style={{ fontFamily: D }} />
          </div>
        </div>
        {num >= 100 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F4] overflow-hidden" style={{ animation: "fadeIn .3s ease" }}>
            <div className="px-5 py-4">
              <p className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-widest mb-3">Conversion Summary</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#6B7A99]">Airtime submitted</span>
                  <span className="text-[14px] font-semibold text-[#0D1B35]" style={{ fontFamily: D }}>₦{fmt(num)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#6B7A99]">Conversion fee (25%)</span>
                  <span className="text-[14px] font-semibold" style={{ color: "#E53E3E", fontFamily: D }}>-₦{fmt(num - cash)}</span>
                </div>
                <div className="h-px" style={{ background: "#E2E8F4" }} />
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-[#0D1B35]">Cash received</span>
                  <span className="text-[20px] font-extrabold" style={{ color: "#00C896", fontFamily: D }}>₦{fmt(cash)}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3" style={{ background: "#E6F9F4" }}>
              <p className="text-[12px] font-medium" style={{ color: "#00A87D" }}>Credited to your HananData wallet instantly</p>
            </div>
          </div>
        )}
        <div className="rounded-xl px-4 py-3" style={{ background: "#FEF3E2", border: "1px solid #F6A623" }}>
          <p className="text-[12px] font-bold mb-1" style={{ color: "#F6A623" }}>Before submitting:</p>
          <p className="text-[12px] text-[#3D4F6E]">Send airtime to <strong>08123456789</strong> (MTN) or <strong>08012345678</strong> (others), then enter the amount above.</p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-[#E2E8F4]" style={{ background: "#F4F6FA" }}>
        <PrimaryBtn label="Proceed" onClick={proceed} disabled={num < 100} />
      </div>
    </div>
  );
}

// ─── SCREEN 11: Confirm ───────────────────────────────────────────────────────

function ConfirmScreen({ navigate, txn }: { navigate: (s: Screen) => void; txn: TxnData }) {
  const [pin, setPin] = useState("");

  function confirm() {
    navigate(Math.random() > 0.3 ? "success" : "failed");
  }

  const rows = [
    { label: "Service",   value: txn.type },
    txn.network  ? { label: "Network",  value: txn.network } : null,
    txn.provider ? { label: "Provider", value: txn.provider } : null,
    { label: "Recipient", value: txn.recipient || "—" },
    txn.plan     ? { label: "Detail",   value: txn.plan } : null,
    { label: "Amount",    value: "₦" + fmt(txn.amount) },
    txn.fee > 0  ? { label: "Fee",      value: "₦" + fmt(txn.fee) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <BackHeader title="Confirm Transaction" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F4] overflow-hidden">
          <div className="px-5 py-4">
            <div className="flex flex-col gap-2.5 mb-4">
              {rows.map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[13px] text-[#6B7A99]">{r.label}</span>
                  <span className="text-[13px] font-semibold text-[#0D1B35] max-w-[55%] text-right" style={{ fontFamily: D }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="h-px" style={{ background: "#E2E8F4" }} />
            <div className="flex justify-between items-center pt-3">
              <span className="text-[15px] font-bold text-[#0D1B35]">Total Debit</span>
              <span className="text-[22px] font-extrabold text-[#1B3A6B]" style={{ fontFamily: D }}>₦{fmt(txn.total)}</span>
            </div>
          </div>
          <div className="px-5 py-3 flex justify-between" style={{ background: "#F0F4FA" }}>
            <span className="text-[12px] text-[#6B7A99]">Wallet balance after</span>
            <span className="text-[12px] font-bold text-[#3D4F6E]" style={{ fontFamily: D }}>₦{fmt(Math.max(0, 48750 - txn.total))}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F4] p-5">
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-1 block uppercase tracking-widest">Transaction PIN</label>
          <PINDots value={pin} max={4} />
          <NumPad value={pin} setValue={setPin} max={4} />
        </div>
      </div>
      <div className="px-5 py-4 border-t border-[#E2E8F4]" style={{ background: "#F4F6FA" }}>
        <PrimaryBtn label="Confirm & Pay" onClick={confirm} disabled={pin.length < 4} />
      </div>
    </div>
  );
}

// ─── SCREEN 12: Success ───────────────────────────────────────────────────────

function SuccessScreen({ navigate, txn }: { navigate: (s: Screen) => void; txn: TxnData }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-8 flex flex-col items-center">
        <div className="mb-7" style={{ animation: "scalePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="45" fill="#E6F9F4" />
            <circle cx="48" cy="48" r="45" fill="none" stroke="#00C896" strokeWidth="3" className="success-circle" />
            <path d="M28 48l14 14 26-26" fill="none" stroke="#00C896" strokeWidth="4.5"
              strokeLinecap="round" strokeLinejoin="round" className="success-check" />
          </svg>
        </div>
        <h2 className="text-[26px] font-extrabold text-[#0D1B35] mb-2" style={{ fontFamily: D }}>Transaction Successful!</h2>
        <p className="text-[14px] text-[#6B7A99] text-center mb-7">Your payment was processed successfully</p>

        <div className="w-full bg-white rounded-2xl border border-[#E2E8F4] overflow-hidden mb-5">
          <div className="px-5 py-4">
            <p className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-widest mb-3">Receipt</p>
            {[
              { label: "Service",  value: txn.description },
              txn.plan ? { label: "Detail",   value: txn.plan } : null,
              txn.recipient ? { label: "Recipient", value: txn.recipient } : null,
              { label: "Amount",   value: "₦" + fmt(txn.total) },
              { label: "Ref ID",   value: txn.refId || genRef() },
              { label: "Date",     value: "Jul 17, 2026 · 2:30 PM" },
              { label: "Status",   value: "✓ Successful" },
            ].filter(Boolean).map((r, i) => (
              <div key={i} className="flex justify-between items-center py-1.5">
                <span className="text-[13px] text-[#6B7A99]">{r!.label}</span>
                <span className="text-[13px] font-semibold max-w-[55%] text-right"
                  style={{ fontFamily: D, color: r!.label === "Status" ? "#00C896" : "#0D1B35" }}>
                  {r!.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button className="w-full py-4 rounded-2xl border-2 font-bold text-[15px] flex items-center justify-center gap-2"
            style={{ borderColor: "#1B3A6B", color: "#1B3A6B", fontFamily: D }}>
            <IcoShare /> Share Receipt
          </button>
          <PrimaryBtn label="Back to Home" onClick={() => navigate("home")} />
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 13: Failed ────────────────────────────────────────────────────────

function FailedScreen({ navigate, txn }: { navigate: (s: Screen) => void; txn: TxnData }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-8 flex flex-col items-center">
        <div className="mb-6" style={{ animation: "scalePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "#FEE2E2", border: "3px solid #E53E3E" }}>
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
              <path d="M10 10l20 20M30 10L10 30" stroke="#E53E3E" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-[#0D1B35] mb-2 text-center" style={{ fontFamily: D }}>Transaction Failed</h2>
        <p className="text-[14px] text-[#6B7A99] text-center mb-5 leading-relaxed px-2">
          Don't worry — your money is <strong className="text-[#0D1B35]">completely safe</strong>. No funds were deducted.
        </p>

        <div className="w-full rounded-2xl px-5 py-4 mb-4" style={{ background: "#FEE2E2", border: "1px solid #E53E3E" }}>
          <p className="text-[13px] font-bold mb-1.5" style={{ color: "#E53E3E" }}>What went wrong</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "#9B1C1C" }}>
            The service provider is temporarily unavailable. Please try again in a few minutes. If the problem persists, contact our support team.
          </p>
        </div>

        <div className="w-full bg-white border border-[#E2E8F4] rounded-2xl px-5 py-4 mb-6">
          {[
            { label: "Service",        value: txn.description },
            { label: "Amount",         value: "₦" + fmt(txn.total) },
            { label: "Transaction ID", value: txn.refId || "HND00FAILED" },
            { label: "Wallet Deducted", value: "₦0.00 ✓" },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center py-1.5">
              <span className="text-[13px] text-[#6B7A99]">{r.label}</span>
              <span className="text-[13px] font-semibold" style={{ fontFamily: r.label === "Transaction ID" ? "monospace" : D,
                color: r.label === "Wallet Deducted" ? "#00C896" : "#0D1B35" }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col gap-3">
          <PrimaryBtn label="Try Again" onClick={() => navigate("confirm")} />
          <button className="w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 text-white"
            style={{ background: "linear-gradient(135deg, #00A87D 0%, #00C896 100%)", fontFamily: D }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8"/>
              <path d="M9.1 9c.3-.9 1.2-1.5 2.2-1.5 1.2 0 2.2.9 2.2 2.1 0 .9-.5 1.6-1.4 2l-.5.3C11.1 12.3 11 12.7 11 13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="16.5" r="1" fill="white"/>
            </svg>
            Contact Support
          </button>
          <button onClick={() => navigate("home")} className="text-[14px] font-medium py-2" style={{ color: "#6B7A99" }}>
            Go back to Home
          </button>
        </div>

        <div className="mt-5 px-4 py-4 rounded-2xl w-full" style={{ background: "#E8EDF5" }}>
          <p className="text-[12px] font-bold mb-1" style={{ color: "#1B3A6B" }}>🔒 Your money is always protected</p>
          <p className="text-[11px] leading-relaxed text-[#3D4F6E]">
            HananData uses bank-grade encryption. Failed transactions are automatically reversed within seconds. No hidden charges, ever.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 14: History ───────────────────────────────────────────────────────

function HistoryScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const FILTERS = ["All", "Data", "Airtime", "Cable", "Electricity", "Wallet"];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? HISTORY_ITEMS
    : HISTORY_ITEMS.filter(t => t.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="bg-white border-b border-[#E2E8F4] px-5 py-4">
        <h2 className="text-[20px] font-extrabold text-[#0D1B35]" style={{ fontFamily: D }}>Transactions</h2>
      </div>
      <div className="bg-white border-b border-[#E2E8F4]">
        <div className="flex overflow-x-auto scrollbar-hide px-5 py-3 gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
              style={{ background: filter === f ? "#1B3A6B" : "#F4F6FA", color: filter === f ? "white" : "#6B7A99", fontFamily: D }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-2">
        {filtered.length
          ? filtered.map(txn => <TxnRow key={txn.id} txn={txn} />)
          : <p className="text-center text-[#6B7A99] py-10">No transactions found</p>}
      </div>
      <BottomNav active="history" navigate={navigate} />
    </div>
  );
}

// ─── SCREEN 15: Wallet ────────────────────────────────────────────────────────

function WalletScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [method, setMethod] = useState<"bank"|"card"|"ussd"|null>(null);
  const [amount, setAmount] = useState("");

  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="bg-white border-b border-[#E2E8F4] px-5 py-4">
        <h2 className="text-[20px] font-extrabold text-[#0D1B35]" style={{ fontFamily: D }}>Fund Wallet</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-4">
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #0D1B35 0%, #1B3A6B 100%)" }}>
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#7BAED4" }}>Available Balance</p>
          <p className="text-white text-[28px] font-extrabold" style={{ fontFamily: D }}>₦48,750.00</p>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-2 block uppercase tracking-widest">Amount to Fund</label>
          <div className="flex items-center bg-white border-2 border-[#E2E8F4] rounded-2xl px-4 py-3.5">
            <span className="text-[20px] font-bold text-[#B8C4D9] mr-2">₦</span>
            <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
              type="text" inputMode="numeric" placeholder="0"
              className="flex-1 text-[22px] font-extrabold text-[#0D1B35] bg-transparent outline-none placeholder:text-[#B8C4D9]"
              style={{ fontFamily: D }} />
          </div>
          <div className="flex gap-2 mt-2">
            {[1000,5000,10000,20000].map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className="flex-1 py-2.5 rounded-xl border text-[11px] font-bold"
                style={{ borderColor: amount === String(a) ? "#1B3A6B" : "#E2E8F4",
                  background: amount === String(a) ? "#E8EDF5" : "white",
                  color: amount === String(a) ? "#1B3A6B" : "#6B7A99", fontFamily: D }}>
                ₦{fmt(a)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#3D4F6E] mb-3 block uppercase tracking-widest">Funding Method</label>
          {([
            { id: "bank", title: "Bank Transfer", sub: "Transfer from any Nigerian bank", emoji: "🏦",
              detail: (
                <div className="rounded-xl p-4 mt-2.5" style={{ background: "#E8EDF5" }}>
                  <p className="text-[12px] text-[#6B7A99] mb-2">Transfer to this dedicated account:</p>
                  {[["Account Name","HananData · Aisha"],["Account No.","0123 456 789"],["Bank","HananData MFB"]].map(([l,v]) => (
                    <div key={l} className="flex justify-between mb-1.5">
                      <span className="text-[13px] text-[#6B7A99]">{l}</span>
                      <span className="text-[13px] font-bold text-[#0D1B35]">{v}</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-[#6B7A99] mt-1.5">Wallet funded automatically within seconds</p>
                </div>
              )},
            { id: "card", title: "Debit / Credit Card", sub: "Visa, Mastercard or Verve", emoji: "💳",
              detail: (
                <div className="flex flex-col gap-2.5 mt-2.5">
                  <input placeholder="Card Number" className="w-full bg-[#F4F6FA] border border-[#E2E8F4] rounded-xl px-4 py-3 text-[14px] outline-none" />
                  <div className="flex gap-2.5">
                    <input placeholder="MM/YY" className="flex-1 bg-[#F4F6FA] border border-[#E2E8F4] rounded-xl px-4 py-3 text-[14px] outline-none" />
                    <input placeholder="CVV" className="flex-1 bg-[#F4F6FA] border border-[#E2E8F4] rounded-xl px-4 py-3 text-[14px] outline-none" />
                  </div>
                </div>
              )},
            { id: "ussd", title: "USSD Payment", sub: "No internet needed", emoji: "📱",
              detail: (
                <div className="rounded-xl p-4 mt-2.5" style={{ background: "#E8EDF5" }}>
                  <p className="text-[12px] text-[#6B7A99] mb-1.5">Dial this code on your phone:</p>
                  <p className="text-[17px] font-bold" style={{ fontFamily: "monospace", color: "#1B3A6B" }}>*737*50*{amount || "AMOUNT"}*60483#</p>
                  <p className="text-[11px] text-[#6B7A99] mt-1">Works on all networks · No data required</p>
                </div>
              )},
          ] as const).map(m => (
            <div key={m.id} className="mb-2">
              <button onClick={() => setMethod(method === m.id ? null : m.id as typeof method)}
                className="w-full bg-white border-2 rounded-2xl px-4 py-4 flex items-center gap-3 text-left"
                style={{ borderColor: method === m.id ? "#1B3A6B" : "#E2E8F4" }}>
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#0D1B35]" style={{ fontFamily: D }}>{m.title}</p>
                  <p className="text-[12px] text-[#6B7A99]">{m.sub}</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  style={{ transform: method === m.id ? "rotate(90deg)" : "none", transition: "transform .2s" }}>
                  <path d="M9 5l7 7-7 7" stroke="#B8C4D9" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {method === m.id && m.detail}
            </div>
          ))}
        </div>
        {method === "card" && amount && (
          <PrimaryBtn label={`Pay ₦${fmt(Number(amount))}`} onClick={() => navigate("success")} />
        )}
      </div>
      <BottomNav active="wallet" navigate={navigate} />
    </div>
  );
}

// ─── SCREEN 16: Profile ───────────────────────────────────────────────────────

function ProfileScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#F4F6FA" }}>
      <StatusBar />
      <div className="bg-white border-b border-[#E2E8F4] px-5 py-4">
        <h2 className="text-[20px] font-extrabold text-[#0D1B35]" style={{ fontFamily: D }}>Profile</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="bg-white px-5 py-5 flex items-center gap-4 border-b border-[#F0F4FA]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-[22px] font-black"
            style={{ background: "linear-gradient(135deg, #1B3A6B, #2952A3)", fontFamily: D }}>
            AB
          </div>
          <div className="flex-1">
            <p className="text-[18px] font-extrabold text-[#0D1B35]" style={{ fontFamily: D }}>Aisha Bello</p>
            <p className="text-[13px] text-[#6B7A99]">+234 801 234 5678</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#00C896" }} />
              <span className="text-[11px] font-semibold" style={{ color: "#00A87D" }}>Verified · Tier 2</span>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#F4F6FA" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-2">
          <p className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-widest mb-1">Account Settings</p>
          {[
            { icon: "👤", label: "Account Details",  sub: "Name, email, BVN" },
            { icon: "🔐", label: "Change PIN",        sub: "Update your 6-digit PIN" },
            { icon: "🔑", label: "Transaction PIN",   sub: "4-digit payment PIN" },
            { icon: "🔔", label: "Notifications",     sub: "Push alerts & SMS" },
            { icon: "🛡️", label: "Security & Privacy",sub: "Biometrics, data" },
          ].map(s => (
            <button key={s.label} className="bg-white border rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ borderColor: "#F0F4FA" }}>
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold text-[#0D1B35]" style={{ fontFamily: D }}>{s.label}</p>
                <p className="text-[12px] text-[#6B7A99]">{s.sub}</p>
              </div>
              <IcoChevRight />
            </button>
          ))}
        </div>

        <div className="px-5 pb-4 flex flex-col gap-2">
          <p className="text-[11px] font-bold text-[#6B7A99] uppercase tracking-widest mb-1">Support & Info</p>
          {[
            { icon: "💬", label: "Help & Support",   sub: "Chat, call, or email us", highlight: true },
            { icon: "⭐", label: "Rate HananData",   sub: "Leave us a review" },
            { icon: "ℹ️", label: "About HananData",  sub: "Version 2.4.1" },
          ].map(s => (
            <button key={s.label} className="border rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{ background: s.highlight ? "#E8F5EE" : "white", borderColor: s.highlight ? "#00C896" : "#F0F4FA" }}>
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold" style={{ fontFamily: D, color: s.highlight ? "#00A87D" : "#0D1B35" }}>{s.label}</p>
                <p className="text-[12px] text-[#6B7A99]">{s.sub}</p>
              </div>
              <IcoChevRight />
            </button>
          ))}
        </div>

        <div className="px-5 pb-8">
          <button onClick={() => navigate("login")}
            className="w-full border rounded-2xl px-4 py-4 flex items-center justify-center gap-2"
            style={{ background: "#FEE2E2", borderColor: "#E53E3E" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="16 17 21 12 16 7" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[15px] font-bold" style={{ color: "#E53E3E", fontFamily: D }}>Log Out</span>
          </button>
        </div>
      </div>
      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [txn, setTxn] = useState<TxnData>({ type: "", amount: 0, fee: 0, total: 0, description: "", refId: genRef() });

  function navigate(s: Screen) {
    setScreen(s);
  }

  const screens: Record<Screen, ReactNode> = {
    splash:       <SplashScreen navigate={navigate} />,
    onboarding:   <OnboardingScreen navigate={navigate} />,
    login:        <LoginScreen navigate={navigate} />,
    signup:       <SignupScreen navigate={navigate} />,
    home:         <HomeScreen navigate={navigate} />,
    data:         <DataScreen navigate={navigate} setTxn={setTxn} />,
    airtime:      <AirtimeScreen navigate={navigate} setTxn={setTxn} />,
    cable:        <CableScreen navigate={navigate} setTxn={setTxn} />,
    electricity:  <ElectricityScreen navigate={navigate} setTxn={setTxn} />,
    airtimecash:  <AirtimeCashScreen navigate={navigate} setTxn={setTxn} />,
    confirm:      <ConfirmScreen navigate={navigate} txn={txn} />,
    success:      <SuccessScreen navigate={navigate} txn={txn} />,
    failed:       <FailedScreen navigate={navigate} txn={txn} />,
    history:      <HistoryScreen navigate={navigate} />,
    wallet:       <WalletScreen navigate={navigate} />,
    profile:      <ProfileScreen navigate={navigate} />,
  };

  const darkBg = screen === "splash";

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0A1628 0%, #1B3A6B 100%)" }}>
      <div className="relative flex flex-col overflow-hidden"
        style={{ width: 390, height: 844, borderRadius: 44,
          boxShadow: "0 48px 96px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          background: "#F4F6FA" }}>
        {/* Dynamic island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[34px] rounded-b-[22px] z-50"
          style={{ background: darkBg ? "#0D1B35" : "#F4F6FA" }} />
        <div key={screen} className="flex flex-col h-full screen-enter">
          {screens[screen]}
        </div>
      </div>
    </div>
  );
}
