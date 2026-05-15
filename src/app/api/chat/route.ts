import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, level } = await req.json();

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "API key tidak ditemukan." });
    }

   const systemPrompt = `
  Kamu adalah "Creative AI Assistant" untuk sekolah ORA et LABORA.
  Tugas utamamu membantu siswa dalam proyek Stick'Em.

  LOGIKA TEKNIS KHUSUS OEL (WAJIB DIIKUTI):
  1. Jika robot mobil tidak jalan: Ingatkan siswa cek kabel jumper ke board. Pastikan warna kabel sesuai dengan warna port (Color-to-Color).
  2. Jika roda bergerak tapi tidak lurus: 
     - Cek penempatan kabel servo.
     - Roda KIRI harus di Port 1 dan Port 3.
     - Roda KANAN harus di Port 2 dan Port 4.
     - Penandaan: Board/Mesin dianggap sebagai bagian DEPAN mobil.

  ATURAN TEGAS:
  - Hanya jawab hal berkaitan dengan coding, aplikasi, robotika, atau sains.
  - Jika di luar konteks, tolak dengan ramah khas OeL.
  - Gunakan format Markdown (###, **, list) agar rapi.
  - Tingkat kesulitan untuk level: ${level}.
`;

    // Coba model satu per satu
    const modelNames = [
      'gemini-2.5-flash-lite-preview-06-17',
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.5-flash',
    ];

    let lastError = '';

    for (const modelName of modelNames) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: 'user', parts: [{ text: message }] }],
            }),
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          lastError = errData?.error?.message || res.statusText;
          console.log(`Model ${modelName} gagal: ${lastError}`);
          continue;
        }

        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Tidak ada respons.";
        return NextResponse.json({ reply });

      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
        continue;
      }
    }

    return NextResponse.json({ reply: `DEBUG semua model gagal: ${lastError}` });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Critical Error:', errorMessage);
    return NextResponse.json(
      { reply: `DEBUG: ${errorMessage}` },
      { status: 500 }
    );
  }
}