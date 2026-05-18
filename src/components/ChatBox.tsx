"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

const QUICK_PROBLEMS = [
  "Tidak bisa belok", 
  "Sensor tidak terbaca", 
  "Motor tidak jalan", 
  "OLED blank", 
  "Robot/Servos tidak bisa berhenti",
  "Robot mobil tidak berjalan"
];

interface ChatBoxProps {
  level: string | null;
  initialProblem: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBox({ level, initialProblem }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef<string | null>(null);

  const fetchReply = async (text: string, currentLevel: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, level: currentLevel }),
      });
      
      const data = await response.json();

      // PERBAIKAN UTAMA: Menggunakan data.reply sesuai dengan payload dari backend route.ts
      if (response.ok && data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `⚠️ **Gagal memuat jawaban:** ${data.error || "Terjadi kesalahan pada server."}` 
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Waduh, sepertinya koneksi jaringan sedang bermasalah. Coba lagi ya!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!level || isLoading) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    await fetchReply(text, level);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const key = `${level}__${initialProblem}`;
    if (level && initialProblem && triggeredRef.current !== key) {
      triggeredRef.current = key;
      const prompt = `Saya di kelas ${level}. Masalah saya: ${initialProblem}. Apa yang harus saya cek?`;
      setMessages([{ role: "user", content: prompt }]);
      fetchReply(prompt, level);
    }
  }, [initialProblem, level]);

  return (
    <div className="flex flex-col h-full gap-6 w-full max-w-full overflow-x-hidden min-w-0">
      
      {/* ── SECTION PILIH MASALAH CEPAT ── */}
      <div className="relative bg-white rounded-4xl md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl overflow-hidden border border-white/10 w-full min-w-0">
        <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "url('/header.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 w-full min-w-0">
          <p className="text-[10px] md:text-[11px] font-black text-blue-700 uppercase tracking-[0.25em] mb-4 md:mb-5 ml-1">
            Pilih Masalah Cepat:
          </p>
          
          <div className="flex flex-wrap gap-2 md:gap-3 w-full">
            {QUICK_PROBLEMS.map((problem) => (
              <button
                key={problem}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(problem)}
                className="bg-gray-50/80 backdrop-blur-sm hover:bg-blue-600 border border-gray-200 hover:border-blue-500 text-gray-700 hover:text-white cursor-pointer px-3 py-2 md:px-5 md:py-2.5 rounded-2xl md:rounded-full text-[11px] md:text-xs font-semibold transition-all shadow-sm active:scale-95 text-left md:text-center max-w-full disabled:opacity-50"
              >
                {problem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AREA CHAT UTAMA ── */}
      <div className="bg-[#1e1e1e] rounded-4xl md:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col flex-1 min-h-112.5 w-full min-w-0">
        
        {/* Header Chatbox */}
        <div className="bg-[#252525] p-4 md:p-5 border-b border-white/5 flex justify-between items-center w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 truncate">
              Stickem Assistant — {level ?? "Umum"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              triggeredRef.current = null;
            }}
            className="text-[10px] font-bold text-gray-500 hover:text-red-400 cursor-pointer px-2 py-1 rounded-lg transition-all uppercase shrink-0"
          >
            Bersihkan
          </button>
        </div>

        {/* Scrollable Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 bg-[#161616] scroll-smooth custom-scrollbar w-full min-w-0"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} w-full min-w-0`}
            >
              <div className={`max-w-[85%] p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-xl wrap-break-word overflow-hidden shrink ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-[#2a2a2a] text-gray-200 border border-white/5 rounded-tl-none'
              }`}>
                {m.role === 'user' ? (
                  <span className="wrap-break-word">{m.content}</span>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none w-full min-w-0 -wrap-break-word
                    prose-strong:text-amber-400 prose-p:my-2 prose-li:my-1
                    prose-code:text-emerald-400 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:break-words
                    prose-pre:bg-black/50 prose-pre:p-3 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:max-w-full
                    prose-hr:border-white/10 prose-em:text-gray-400">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2a2a2a] p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5 shadow-inner">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.elements.namedItem("input") as HTMLInputElement | null;
            if (input && input.value.trim()) {
              handleSendMessage(input.value.trim());
              input.value = "";
            }
          }}
          className="p-4 md:p-5 bg-[#1e1e1e] border-t border-white/5 flex gap-2 md:gap-3 pb-24 lg:pb-6 w-full min-w-0"
        >
          <input
            name="input"
            autoComplete="off"
            type="text"
            placeholder="Tulis kata kunci masalah di sini..."
            className="flex-1 bg-[#121212] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-white placeholder:text-gray-600 min-w-0"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 cursor-pointer disabled:bg-gray-800 px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg active:scale-95 text-white shrink-0"
          >
            {isLoading ? '...' : 'KIRIM'}
          </button>
        </form>
      </div>
    </div>
  );
}