export default function Header() {
  return (
    <header className="bg-blue-700 p-6 rounded-b-[2rem] shadow-2xl">
      <div className="max-w-5xl mx-auto flex items-center gap-5">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden">
          {/* Ganti dengan Logo OeL yang Anda upload */}
          <img src="/logo-oel.jpg" alt="Logo OeL" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-black italic tracking-wider">AI STICKEM DEBUGGER</h1>
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest">
            ORA et LABORA — Holiday Program Juni 2026
          </p>
        </div>
      </div>
    </header>
  );
}