import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, level } = await req.json();

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "API key tidak ditemukan." });
    }

    const systemPrompt = `Kamu adalah AI Stickem Debugger Ora et Labora. Level: ${level}. Bantu siswa Stick'Em debugging robot dengan ramah, singkat, dan jelas.`;

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