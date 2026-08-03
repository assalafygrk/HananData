export function LogoLoader({}: { text?: string }) {
  // text is intentionally ignored to remove the label
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 bg-[#1B3A6B]/20 rounded-full blur-xl animate-pulse"></div>
        <img 
          src="/logo.png" 
          alt="Loading..." 
          className="relative w-20 h-20 object-contain z-10 animate-bounce transition-transform"
          style={{ animationDuration: '1.5s' }}
        />
      </div>
    </div>
  );
}
