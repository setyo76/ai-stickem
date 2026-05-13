"use client"; // Pastikan ada directive ini di paling atas

import { useState } from "react";
import Header from "../components/Header";
import LevelCard from "../components/LevelCard";
import { LEVELS, QUICK_PROBLEMS } from "../lib/constants";
import ChatBox from "../components/ChatBox"; // Kita akan buat komponen ini

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [activeProblem, setActiveProblem] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Header />
      
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Level Selector */}
        <section>
          <p className="text-gray-400 text-sm mb-4">Level kelas kamu:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEVELS.map((level) => (
              <div key={level.id} onClick={() => setSelectedLevel(level.title)}>
                <LevelCard 
                  {...level} 
                  isActive={selectedLevel === level.title} 
                />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Issues */}
        <section>
          <p className="text-gray-400 text-sm mb-4">Pilih masalah cepat:</p>
          <div className="flex flex-wrap gap-3">
            {QUICK_PROBLEMS.map((problem) => (
              <button 
                key={problem}
                onClick={() => setActiveProblem(problem)}
                className={`px-4 py-2 border rounded-full text-xs transition-all ${
                  activeProblem === problem 
                  ? "bg-red-600 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                  : "bg-[#1e1e1e] border-white/5 hover:border-red-500"
                }`}
              >
                {problem}
              </button>
            ))}
          </div>
        </section>

        {/* Chat Interface (Area Putus-putus di Screenshot) */}
        <section className="mt-10">
          <ChatBox 
            level={selectedLevel} 
            initialProblem={activeProblem} 
          />
        </section>
      </div>
    </main>
  );
}