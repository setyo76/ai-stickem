"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { QUICK_PROBLEMS } from "../lib/constants";
import ChatBox from "../components/ChatBox";

export default function Home() {
  const [activeProblem, setActiveProblem] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden">
          <Header />
        </div>

        <div className="flex-1 p-5 md:p-8 space-y-6 max-w-3xl w-full mx-auto">
          {/* Quick Issues */}


          {/* Chat Interface */}
          <section>
            <ChatBox level="Umum" initialProblem={activeProblem} />
          </section>
        </div>
      </main>
    </div>
  );
}