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
          <section className="bg-white rounded-2xl p-5 shadow-lg">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Pilih masalah cepat:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROBLEMS.map((problem) => (
                <button
                  key={problem}
                  onClick={() =>
                    setActiveProblem(activeProblem === problem ? null : problem)
                  }
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                    activeProblem === problem
                      ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {problem}
                </button>
              ))}
            </div>
          </section>

          {/* Chat Interface */}
          <section>
            <ChatBox level="Umum" initialProblem={activeProblem} />
          </section>
        </div>
      </main>
    </div>
  );
}