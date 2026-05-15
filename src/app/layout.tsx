import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Stickem Debugger — Ora et Labora",
  description: "Asisten cerdas untuk debugging robot Stick'Em Sekolah Ora et Labora. Holiday Program Juni 2026.",
  icons: {
    icon: "/OeL-ai.png",
    apple: "/OeL-ai.png",
  },
  openGraph: {
    title: "AI Stickem Debugger — Ora et Labora",
    description: "Asisten cerdas pendamping belajar robotika STEAM untuk siswa OeL.",
    url: "https://stickem-oel.vercel.app/",
    siteName: "AI Stickem Debugger OeL",
    images: [
      {
        url: "/OeL-ai.png",
        width: 1200,
        height: 1200,
        alt: "Logo Robot AI Stickem Debugger Ora et Labora",
      },
    ],
    locale: "id_ID",
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
      <body className={`${inter.className} min-h-screen bg-[#121212] overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}