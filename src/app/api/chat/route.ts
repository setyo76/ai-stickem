import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, level } = await req.json();

    // DAFTAR MODEL DARI YANG TERBARU KE YANG PALING STABIL
    // Jika 3.1 sibuk, kita coba 2.5. Jika 2.5 sibuk, kita coba 1.5-flash-latest
    const modelNames = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash-latest"];
    
    let lastError = "";
    
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const systemPrompt = `Kamu adalah AI Stickem Debugger Ora et Labora. Level: ${level}. Bantu siswa Stick'Em dengan ramah.`;
        const result = await model.generateContent(`${systemPrompt}\n\nPertanyaan: ${message}`);
        const response = await result.response;
        
        // Jika berhasil, langsung kirim jawaban
        return NextResponse.json({ reply: response.text() });
        
      } catch (err: any) {
        lastError = err.message;
        if (err.message.includes("503") || err.message.includes("429")) {
          console.log(`Model ${modelName} sibuk, mencoba model cadangan...`);
          continue; // Coba model berikutnya di list
        }
        throw err; // Jika error lain (misal API Key salah), langsung stop
      }
    }

    return NextResponse.json({ reply: `Waduh, semua asisten AI sedang sibuk melayani siswa lain. Coba klik lagi dalam 5 detik ya! (Error: ${lastError})` });

  } catch (error: any) {
    return NextResponse.json({ reply: "Ada kendala teknis. Pastikan koneksi internet aman." }, { status: 500 });
  }
}