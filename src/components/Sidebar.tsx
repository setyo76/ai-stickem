"use client";

import { useState, useCallback } from "react";

type NavPage = "about" | "gallery" | "event" | "shop" | null;

const GALLERY_IMAGES = [
  { src: "/img1.jpg", alt: "Robot Stick'Em di arena kompetisi" },
  { src: "/img2.jpg", alt: "Robot dengan dekorasi bintang di arena" },
  { src: "/img3.jpg", alt: "Tim OeL di Challenge Time" },
  { src: "/img4.jpg", alt: "Siswa mendampingi robot di arena" },
  { src: "/img5.jpg", alt: "Bronze Award – Global Robotics Games 2025" },
  { src: "/img6.jpg", alt: "Silver Award – Global Robotics Games 2025" },
];

export default function Sidebar() {
  const [activePage, setActivePage] = useState<NavPage>(null);

  const navItems: { key: NavPage; label: string; icon: string }[] = [
    { key: "about", label: "About", icon: "ℹ️" },
    { key: "gallery", label: "Gallery", icon: "🖼️" },
    { key: "event", label: "Event", icon: "📅" },
    { key: "shop", label: "Shop", icon: "🛒" },
  ];

  const closeModal = useCallback(() => setActivePage(null), []);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-blue-600 sticky top-0 self-start h-screen overflow-y-auto">
        <div className="p-6 flex flex-col items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/logo-oel.jpg" alt="Logo OeL" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-widest uppercase leading-tight">AI Stickem Debugger</h1>
            <p className="text-blue-200 text-[10px] tracking-[0.2em] uppercase mt-1 font-medium">Ora et Labora</p>
            <p className="text-blue-200 text-[10px] tracking-[0.15em] uppercase font-medium">Holiday Program Juni 2026</p>
          </div>
        </div>

        <div className="mx-6 border-t border-white/20" />

        <nav className="p-4 flex-1">
          <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold mb-3 px-2">Menu</p>
          <div className="space-y-1">
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActivePage(key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left text-white/80 hover:bg-white/15 hover:text-white cursor-pointer"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

<div className="p-6 mt-auto">
  <div className="flex flex-col items-center gap-1">
    <div className="text-blue-300 text-[10px] text-center tracking-widest uppercase mb-2">
      © 2026 Ora et Labora
    </div>
    <p className="text-white/70 text-[10px] font-medium flex items-center gap-1.5 whitespace-nowrap">
      Build With 
      <span className="text-red-400 animate-pulse text-xs">❤️</span> 
      By Setyo OeL
    </p>
  </div>
</div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-blue-600 border-t border-blue-500">
        <div className="flex">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-blue-200 hover:text-white"
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MODAL OVERLAY (POPUP) ── */}
      {activePage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeModal} 
          />
          
          {/* Modal Content Box */}
          <div className="relative bg-white w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all z-20"
            >
              ✕
            </button>

            <div className="p-8 md:p-16">
              <SidebarContent page={activePage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({ page }: { page: NavPage }) {
  const headingClass = "text-3xl md:text-4xl font-black text-blue-800 uppercase tracking-tighter mb-8";

  if (page === "about") {
    return (
      <div>
        <h2 className={headingClass}>ℹ️ Tentang Aplikasi</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", t: "Eksplorasi STEAM", d: "Alat bantu belajar peserta didik Sekolah ORA et LABORA dalam mengeksplorasi kit Stick'Em." },
            { num: "02", t: "Kolaborasi", d: "Tempat berbagi ide dan inspirasi antar siswa, guru, dan komunitas STEAM OeL." },
            { num: "03", t: "Dokumentasi", d: "Arsip hasil belajar dari prototipe hingga kompetisi internasional (GRG 2025)." }
          ].map((item) => (
            <div key={item.num} className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
              <span className="text-blue-500 font-black text-3xl">{item.num}</span>
              <h4 className="font-bold text-lg text-blue-900 mt-4 leading-tight">{item.t}</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "gallery") {
    return (
      <div>
        <h2 className={headingClass}>🖼️ Galeri STEAM OeL</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden aspect-video bg-gray-100 shadow-sm">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <p className="text-white text-xs font-medium leading-snug">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "event") {
    const events = [
      { emoji: "🏆", title: "OeL STEAM Challenge", date: "September 2026", tag: "Segera", color: "bg-orange-100 text-orange-600" },
      { emoji: "🤖", title: "Global Robotics Games 2026", date: "2026 (TBA)", tag: "Internasional", color: "bg-blue-100 text-blue-600" },
      { emoji: "💻", title: "Coding Camp OeL", date: "Coming Soon", tag: "Edukasi", color: "bg-purple-100 text-purple-600" },
      { emoji: "🌟", title: "Holiday Program OeL", date: "Juni 2026", tag: "Aktif", color: "bg-green-100 text-green-600" },
    ];
    return (
      <div>
        <h2 className={headingClass}>📅 Event Mendatang</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((ev, i) => (
            <div key={i} className="flex items-start gap-5 p-6 rounded-3xl border border-gray-100 bg-gray-50/50">
              <span className="text-4xl">{ev.emoji}</span>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${ev.color}`}>{ev.tag}</span>
                <h4 className="font-bold text-gray-900 mt-2 text-lg">{ev.title}</h4>
                <p className="text-blue-600 font-medium text-sm">📅 {ev.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "shop") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={headingClass}>🛒 Shop Stick'Em Kit</h2>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[3rem] p-10 space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            Dukung kreativitas ananda dengan <strong>Pre-Order</strong> kit Stick'Em Singapore. 
            Sarana belajar robotika yang interaktif dan menyenangkan!
          </p>
          <a 
            href="https://shop.oel.sch.id/product/stick-em-singapore-preorder/" 
            target="_blank" 
            className="inline-block bg-blue-600 text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1"
          >
            Pesan di OeL Shop
          </a>
          <p className="text-gray-400 text-sm italic">shop.oel.sch.id</p>
        </div>
      </div>
    );
  }

  return null;
}