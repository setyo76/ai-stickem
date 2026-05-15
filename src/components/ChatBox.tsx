"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

// Daftar masalah cepat
const QUICK_PROBLEMS = [
  "Tidak bisa belok", 
  "Sensor tidak terbaca", 
  "Motor tidak jalan", 
  "OLED blank", 
  "Program aneh",
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
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (_error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Waduh, sepertinya koneksi AI sedang bermasalah. Coba lagi ya!"
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
    /* Perubahan Utama: Tambahkan w-full dan overflow-x-hidden untuk mencegah scroll horizontal */
    <div className="flex flex-col h-full gap-6 w-full max-w-full overflow-x-hidden">
      
      {/* ── SECTION PILIH MASALAH CEPAT ── */}
      <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl overflow-hidden border border-white/10 w-full">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "url('/header.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10">
          <p className="text-[10px] md:text-[11px] font-black text-blue-700 uppercase tracking-[0.25em] mb-4 md:mb-5 ml-1">
            Pilih Masalah Cepat:
          </p>
          
          {/* Flex-wrap dipastikan aman untuk mobile */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {QUICK_PROBLEMS.map((problem) => (
              <button
                key={problem}
                onClick={() => handleSendMessage(problem)}
                className="bg-gray-50/80 backdrop-blur-sm hover:bg-blue-600 border border-gray-200 hover:border-blue-500 text-gray-700 hover:text-white px-3 py-2 md:px-5 md:py-2.5 rounded-full text-[10px] md:text-xs font-semibold transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                {problem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AREA CHAT UTAMA ── */}
      <div className="bg-[#1e1e1e] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col flex-1 min-h-[450px] w-full">
        {/* Header Chatbox */}
        <div className="bg-[#252525] p-4 md:p-5 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400">
              AI Assistant — {level ?? "Umum"}
            </span>
          </div>
          <button
            onClick={() => {
              setMessages([]);
              triggeredRef.current = null;
            }}
            className="text-[9px] md:text-[10px] font-bold text-gray-500 hover:text-red-400 px-2 md:px-3 py-1 rounded-lg transition-all uppercase"
          >
            Bersihkan
          </button>
        </div>

        {/* Scrollable Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#161616] scroll-smooth custom-scrollbar w-full"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 w-full`}
            >
              {/* max-w ditingkatkan agar teks tidak terlalu sempit di HP, word-break ditambahkan */}
              <div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-xl break-words ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-[#2a2a2a] text-gray-200 border border-white/5 rounded-tl-none'
              }`}>
                {m.role === 'user' ? (
                  m.content
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none
                    prose-strong:text-amber-400 prose-p:my-2 prose-li:my-1
                    prose-code:text-emerald-400 prose-code:bg-black/30 prose-code:px-1 prose-code:rounded break-words">
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
            const input = form.elements.namedItem("input") as HTMLInputElement;
            if (input && input.value.trim()) {
              handleSendMessage(input.value);
              input.value = "";
            }
          }}
          /* pb-24 untuk ruang jempol/navbar mobile, w-full untuk kepastian lebar */
          className="p-4 md:p-5 bg-[#1e1e1e] border-t border-white/5 flex gap-2 md:gap-3 pb-24 lg:pb-6 w-full"
        >
          <input
            name="input"
            autoComplete="off"
            type="text"
            placeholder="Tulis di sini..."
            className="flex-1 bg-[#121212] border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-white placeholder:text-gray-600 min-w-0"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest transition-all shadow-lg active:scale-95 text-white whitespace-nowrap"
          >
            {isLoading ? '...' : 'KIRIM'}
          </button>
        </form>
      </div>
    </div>
  );
}