export default function Header() {
  return (
    <header className="relative p-8 rounded-b-[3rem] shadow-2xl overflow-hidden min-h-[160px] flex items-center">
      {/* Background Image dengan Blur */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/header.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.6)'
        }}
      />
      
      {/* Overlay Warna Biru OeL */}
      <div className="absolute inset-0 bg-blue-700/40 mix-blend-multiply z-10" />

      {/* Konten Header */}
      <div className="relative z-20 max-w-5xl mx-auto flex items-center gap-6 w-full">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl rotate-3 overflow-hidden">
          <img src="/logo-oel.jpg" alt="Logo OeL" className="w-12 h-12 object-contain" />
        </div>
        <div className="drop-shadow-lg">
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white">
            AI STICKEM DEBUGGER
          </h1>
          <p className="text-blue-50 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1 opacity-90">
            ORA et LABORA — Holiday Program Juni 2026
          </p>
        </div>
      </div>
    </header>
  );
}