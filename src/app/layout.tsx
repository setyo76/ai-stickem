import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ─── UPDATE METADATA DI SINI ───
// Ini akan memperbaiki Tab Title, Favicon, dan WhatsApp Share Image
export const metadata: Metadata = {
  // 1. Judul di Tab Browser
  title: "AI Stickem Debugger — Ora et Labora",
  
  // 2. Deskripsi singkat di Tab Browser/Google
  description: "Asisten cerdas untuk debugging robot Stick'Em Sekolah Ora et Labora. Holiday Program Juni 2026.",
  
  // 3. FAVICON (Logo di Tab)
  icons: {
    icon: "/OeL-ai.png", // Mengarah ke public/OeL-ai.png
    apple: "/OeL-ai.png", // Untuk icon saat di-save di home screen iPhone
  },

  // 4. OPEN GRAPH (Untuk WhatsApp, Facebook, LinkedIn, dll.)
  openGraph: {
    title: "AI Stickem Debugger — Ora et Labora",
    description: "Asisten cerdas pendamping belajar robotika STEAM untuk siswa OeL.",
    url: "https://stickem-oel.vercel.app/", // Ganti dengan URL Vercel asli Anda
    siteName: "AI Stickem Debugger OeL",
    images: [
      {
        url: "/OeL-ai.png", // Gambar robot yang akan muncul di WA
        width: 1200, // Ukuran standar OG
        height: 1200, // Karena gambarnya kotak
        alt: "Logo Robot AI Stickem Debugger Ora et Labora",
      },
    ],
    locale: "id_ID", // Mengatur bahasa bahasa Indonesia
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Next.js secara otomatis memasukkan metadata (title, icons, og) ke dalam <head> */}
      <body className={`${inter.className} min-h-screen bg-[#121212]`}>
        {children}
      </body>
    </html>
  );
}