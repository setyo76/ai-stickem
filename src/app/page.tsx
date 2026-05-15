"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [activeProblem, setActiveProblem] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header — full width, background biru dijaga */}
        <div className="lg:hidden w-full bg-blue-600">
          <Header />
        </div>

        <div className="flex-1 p-5 md:p-8 space-y-6 max-w-3xl w-full mx-auto">
          {/* Chat Interface */}
          <section>
            <ChatBox level="Umum" initialProblem={activeProblem} />
          </section>
        </div>
      </main>
    </div>
  );
}