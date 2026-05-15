"use client";

import { useState } from "react";

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

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-blue-600 sticky top-0 self-start h-screen overflow-y-auto">
        {/* Logo + Brand */}
        <div className="p-6 flex flex-col items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/logo-oel.jpg" alt="Logo OeL" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-widest uppercase leading-tight">
              AI Stickem
            </h1>
            <h2 className="text-white font-black text-lg tracking-widest uppercase leading-tight">
              Debugger
            </h2>
            <p className="text-blue-200 text-[10px] tracking-[0.2em] uppercase mt-1 font-medium">
              Ora et Labora
            </p>
            <p className="text-blue-200 text-[10px] tracking-[0.15em] uppercase font-medium">
              Holiday Program Juni 2026
            </p>
          </div>
        </div>

        <div className="mx-6 border-t border-white/20" />

        {/* Nav */}
        <nav className="p-4 flex-1">
          <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold mb-3 px-2">
            Menu
          </p>
          <div className="space-y-1">
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActivePage(activePage === key ? null : key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  activePage === key
                    ? "bg-white text-blue-700 shadow"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
                {activePage === key && (
                  <span className="ml-auto text-blue-400 text-xs">▲</span>
                )}
              </button>
            ))}
          </div>

          {/* Panel konten */}
          {activePage && (
            <div className="mt-4 bg-white/10 rounded-xl p-4 text-white text-sm space-y-3">
              <SidebarContent page={activePage} />
            </div>
          )}
        </nav>

        <div className="p-6">
          <div className="text-blue-300 text-[10px] text-center tracking-widest uppercase">
            © 2026 Ora et Labora
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-blue-600 border-t border-blue-500">
        {/* Panel slide-up konten */}
        {activePage && (
          <div className="bg-white text-gray-800 text-sm max-h-72 overflow-y-auto p-4 border-t border-blue-500">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-blue-700 uppercase text-xs tracking-widest">
                {navItems.find((n) => n.key === activePage)?.label}
              </h3>
              <button
                onClick={() => setActivePage(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <SidebarContent page={activePage} mobile />
          </div>
        )}
        {/* Tab bar */}
        <div className="flex">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActivePage(activePage === key ? null : key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                activePage === key ? "text-white bg-blue-700" : "text-blue-200"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Konten tiap halaman ─── */
function SidebarContent({ page, mobile = false }: { page: NavPage; mobile?: boolean }) {
  const prose = mobile ? "text-gray-700" : "text-white/90";
  const heading = mobile ? "text-blue-700" : "text-white";

  if (page === "about") {
    return (
      <div className="space-y-3">
        <h3 className={`font-bold text-xs uppercase tracking-widest ${heading}`}>
          Tentang Aplikasi
        </h3>
        <ul className="space-y-2">
          {[
            {
              num: "01",
              text: "Alat bantu belajar peserta didik Sekolah ORA et LABORA dalam mengeksplorasi STEAM menggunakan kit Stick'Em.",
            },
            {
              num: "02",
              text: "Tempat berbagi ide dan inspirasi antar siswa, guru, dan komunitas STEAM OeL.",
            },
            {
              num: "03",
              text: "Dokumentasi hasil belajar STEAM Sekolah ORA et LABORA — dari prototipe hingga kompetisi internasional.",
            },
          ].map(({ num, text }) => (
            <li key={num} className="flex gap-2">
              <span
                className={`font-black text-xs mt-0.5 shrink-0 ${
                  mobile ? "text-blue-500" : "text-blue-200"
                }`}
              >
                {num}
              </span>
              <p className={`text-xs leading-relaxed ${prose}`}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (page === "gallery") {
    return (
      <div className="space-y-3">
        <h3 className={`font-bold text-xs uppercase tracking-widest ${heading}`}>
          Galeri STEAM OeL
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.src}
              className="rounded-lg overflow-hidden aspect-video bg-black/20"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        <p className={`text-xs ${mobile ? "text-gray-500" : "text-blue-200"}`}>
          Dokumentasi kegiatan STEAM Sekolah ORA et LABORA — Global Robotics Games 2025 & lebih banyak lagi.
        </p>
      </div>
    );
  }

  if (page === "event") {
    const events = [
      {
        emoji: "🏆",
        title: "OeL STEAM Challenge",
        date: "September 2026",
        desc: "Kompetisi STEAM internal Sekolah ORA et LABORA. Siswa unjuk karya robotika & kreativitas dengan kit Stick'Em.",
        tag: "Segera",
        tagColor: mobile
          ? "bg-orange-100 text-orange-600"
          : "bg-orange-400/30 text-orange-200",
      },
      {
        emoji: "🤖",
        title: "Global Robotics Games 2026",
        date: "2026 (TBA)",
        desc: "Kompetisi robotika internasional menggunakan kit Stick'Em. OeL telah meraih Bronze & Silver Award di GRG 2025!",
        tag: "Internasional",
        tagColor: mobile
          ? "bg-blue-100 text-blue-600"
          : "bg-blue-400/30 text-blue-200",
        link: "https://www.globalroboticsgames.com/",
      },
      {
        emoji: "💻",
        title: "Coding Camp OeL",
        date: "Coming Soon",
        desc: "Program intensif coding untuk siswa ORA et LABORA. Belajar pemrograman, logika, dan problem solving.",
        tag: "Coming Soon",
        tagColor: mobile
          ? "bg-gray-100 text-gray-500"
          : "bg-white/10 text-white/60",
      },
      {
        emoji: "🌟",
        title: "Holiday Program OeL",
        date: "Juni 2026",
        desc: "Program liburan seru dengan aktivitas STEAM, robotika, dan inovasi bersama teman-teman OeL.",
        tag: "Aktif",
        tagColor: mobile
          ? "bg-green-100 text-green-600"
          : "bg-green-400/30 text-green-200",
      },
    ];

    return (
      <div className="space-y-3">
        <h3 className={`font-bold text-xs uppercase tracking-widest ${heading}`}>
          Event STEAM Terdekat
        </h3>
        <div className="space-y-2">
          {events.map((ev) => (
            <div
              key={ev.title}
              className={`rounded-lg p-3 space-y-1 ${
                mobile ? "bg-gray-50 border border-gray-100" : "bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-base">{ev.emoji}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.tagColor}`}
                >
                  {ev.tag}
                </span>
              </div>
              <p className={`font-bold text-xs ${heading}`}>{ev.title}</p>
              <p
                className={`text-[10px] font-medium ${
                  mobile ? "text-blue-500" : "text-blue-200"
                }`}
              >
                📅 {ev.date}
              </p>
              <p className={`text-[11px] leading-relaxed ${prose}`}>{ev.desc}</p>
              {ev.link && (
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[10px] underline ${
                    mobile ? "text-blue-500" : "text-blue-200"
                  }`}
                >
                  globalroboticsgames.com →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "shop") {
    return (
      <div className="space-y-3">
        <h3 className={`font-bold text-xs uppercase tracking-widest ${heading}`}>
          Shop – Kit Stick'Em
        </h3>
        <p className={`text-xs leading-relaxed ${prose}`}>
          Dalam rangka mendukung perkembangan siswa, OeL membuka{" "}
          <strong>Pre-Order</strong> alat pembelajaran STEAM Stick'Em — sarana belajar kreatif dan
          eksploratif bagi anak-anak.
        </p>
        <p className={`text-xs leading-relaxed ${prose}`}>
          Melalui media belajar ini, siswa diajak belajar secara <em>hands-on</em> untuk
          mengembangkan kreativitas, logika berpikir, serta kemampuan problem solving dengan cara
          yang menyenangkan.
        </p>
        <div
          className={`rounded-lg p-3 space-y-2 ${
            mobile ? "bg-yellow-50 border border-yellow-200" : "bg-white/10"
          }`}
        >
          <p
            className={`text-[10px] font-semibold uppercase tracking-wide ${
              mobile ? "text-yellow-700" : "text-yellow-300"
            }`}
          >
            📦 Stok Terbatas
          </p>
          <a
            href="https://shop.oel.sch.id/product/stick-em-singapore-preorder/"
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center text-xs font-bold py-2.5 px-4 rounded-lg transition-colors ${
              mobile
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            🛒 Pesan Sekarang
          </a>
          <p
            className={`text-[10px] text-center ${
              mobile ? "text-gray-400" : "text-blue-200"
            }`}
          >
            shop.oel.sch.id
          </p>
        </div>
      </div>
    );
  }

  return null;
}