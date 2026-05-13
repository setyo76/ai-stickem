"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

interface ChatBoxProps {
  level: string | null;
  initialProblem: string | null;
}

export default function ChatBox({ level, initialProblem }: ChatBoxProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (level && initialProblem) {
      const prompt = `Saya di kelas ${level}. Masalah saya: ${initialProblem}. Apa yang harus saya cek?`;
      handleSendMessage(prompt);
    }
  }, [initialProblem]);

  async function handleSendMessage(text: string) {
    if (!level) return;
    
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, level: level }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant" as const, content: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant" as const, content: "Waduh, sepertinya koneksi AI sedang bermasalah. Coba lagi ya!" }]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!level) {
    return (
      <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center text-gray-500 italic animate-pulse">
        Silahkan pilih level kelasmu terlebih dahulu untuk mengaktifkan AI Debugger
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-[#252525] p-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">AI Assistant — {level}</span>
        </div>
        <button 
          onClick={() => setMessages([])} 
          className="text-[10px] text-gray-500 hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-all uppercase"
        >
          Bersihkan Chat
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="h-[450px] overflow-y-auto p-6 space-y-6 bg-[#161616] scroll-smooth custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] p-5 rounded-2xl text-sm leading-relaxed shadow-xl ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-[#2a2a2a] text-gray-200 border border-white/5 rounded-tl-none'
            }`}>
              {m.role === 'user' ? (
                m.content
              ) : (
                <div className="prose prose-invert prose-sm max-w-none 
                  /* Pewarnaan Heading Utama */
                  prose-h3:text-blue-400 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4 prose-h3:border-b prose-h3:border-blue-900/30 prose-h3:pb-2
                  
                  /* Pewarnaan Sub-heading atau Poin Penting */
                  prose-strong:text-amber-400 prose-strong:font-semibold
                  
                  /* Jarak Paragraf dan Teks */
                  prose-p:text-gray-300 prose-p:my-4 prose-p:leading-relaxed
                  
                  /* Styling List agar Rapi dan Menjorok */
                  prose-ul:list-disc prose-ul:my-4 prose-ul:pl-6
                  prose-li:my-2 prose-li:text-gray-300
                  
                  /* Styling Kode Emerald */
                  prose-code:text-emerald-400 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  
                  /* Styling Blockquote untuk Opening/Closing jika AI menggunakannya */
                  prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#2a2a2a] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as any;
          if (target.input.value.trim()) {
            handleSendMessage(target.input.value);
            target.input.value = "";
          }
        }}
        className="p-4 bg-[#1e1e1e] border-t border-white/5 flex gap-2"
      >
        <input 
          name="input"
          autoComplete="off"
          type="text" 
          placeholder="Tulis pertanyaanmu di sini..."
          className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-600"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
        >
          {isLoading ? '...' : 'KIRIM'}
        </button>
      </form>
    </div>
  );
}