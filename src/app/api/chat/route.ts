import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Normalisasi alias umum
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/stick\s*'?\s*em/gi, "stick em")
    .replace(/stickem/gi, "stick em")
    .replace(/stikem/gi, "stick em")
    .replace(/[''`]/g, "'")
    .trim();
}

// Ekstrak frasa (prioritas panjang dulu, kata tunggal terakhir)
function extractKeywords(text: string): string[] {
  const stopwords = [
    "apa", "itu", "yang", "dan", "di", "ke", "dari", "ini", "ada", "tidak",
    "apakah", "bagaimana", "saya", "untuk", "dengan", "pada", "atau", "bisa",
    "harus", "cek", "masalah", "kelas", "tolong", "mohon", "kenapa", "mengapa",
    "gimana", "cara", "boleh", "sudah", "belum", "jika", "kalau", "saat",
  ];

  const normalized = normalizeText(text).replace(/[?.,!]/g, "");
  const words = normalized
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopwords.includes(w));

  const phrases: string[] = [];

  // Prioritas 1: frasa 4 kata
  for (let i = 0; i <= words.length - 4; i++) {
    phrases.push(words.slice(i, i + 4).join(" "));
  }
  // Prioritas 2: frasa 3 kata
  for (let i = 0; i <= words.length - 3; i++) {
    phrases.push(words.slice(i, i + 3).join(" "));
  }
  // Prioritas 3: frasa 2 kata
  for (let i = 0; i <= words.length - 2; i++) {
    phrases.push(words.slice(i, i + 2).join(" "));
  }
  // Prioritas 4: kata tunggal panjang saja (min 5 huruf)
  for (const w of words) {
    if (w.length >= 5) phrases.push(w);
  }

  return [...new Set(phrases)];
}

// Restore alias agar cocok dengan format di Notion
function restoreAlias(text: string): string {
  return text.replace(/stick em/gi, "Stick 'Em");
}

async function queryNotion(databaseId: string, notionToken: string, keyword: string) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        property: "Pertanyaan",
        title: { contains: keyword },
      },
    }),
  });
  if (!res.ok) throw new Error(`Notion error ${res.status}`);
  return res.json();
}

function wrapReply(core: string): string {
  const openings = [
    "Oke! Untuk masalah ini, silahkan ikuti saran berikut:\n\n",
    "Baik, ini yang perlu kamu cek:\n\n",
    "Tenang, ini langkah yang bisa dicoba:\n\n",
  ];
  const closings = [
    "\n\n---\n_Semoga saran ini membantu ya. Tetap semangat! 💪_",
    "\n\n---\n_Semoga berhasil! Kalau masih ada kendala, tanya lagi ya. 🙌_",
    "\n\n---\n_Yuk dicoba dulu! Semangat terus! 🚀_",
  ];
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return pick(openings) + core + pick(closings);
}

export async function POST(request: Request) {
  try {
    const textData = await request.text();
    if (!textData) {
      return NextResponse.json({ success: false, error: "Body kosong." }, { status: 400 });
    }

    const body = JSON.parse(textData);
    const message = body.message || "";
    const level = body.level || "Umum";

    if (!message) {
      return NextResponse.json({ success: false, error: "Pesan kosong." }, { status: 400 });
    }

    const databaseId = process.env.NOTION_DATABASE_ID;
    const notionToken = process.env.NOTION_TOKEN;
    if (!databaseId || !notionToken) {
      throw new Error("NOTION_DATABASE_ID atau NOTION_TOKEN belum diatur di .env.local");
    }

    // Ekstrak kata kunci dari pesan user
    let kataKunci = message;
    if (message.includes("Masalah saya:")) {
      const match = message.match(/Masalah saya:\s*([^.]+)/);
      if (match) kataKunci = match[1].trim();
    }

    const keywords = extractKeywords(kataKunci);
    console.log("Keywords extracted:", keywords);

    let foundPage: any = null;

    // Coba query dengan kalimat penuh dulu (normalized + restore alias)
    try {
      const fullPhrase = restoreAlias(normalizeText(kataKunci).replace(/[?.,!]/g, "").trim());
      const result = await queryNotion(databaseId, notionToken, fullPhrase);
      if (result.results?.length > 0) foundPage = result.results[0];
    } catch (_) {}

    // Kalau belum ketemu, coba tiap frasa secara berurutan (panjang → pendek)
    if (!foundPage) {
      for (const kw of keywords) {
        const queryKw = restoreAlias(kw);
        try {
          const result = await queryNotion(databaseId, notionToken, queryKw);
          if (result.results?.length > 0) {
            foundPage = result.results[0];
            break;
          }
        } catch (_) {}
      }
    }

    let aiReply = "";

    if (foundPage) {
      const propertiJawaban = foundPage.properties["Jawaban"];
      if (propertiJawaban?.rich_text?.length > 0) {
        aiReply = wrapReply(propertiJawaban.rich_text[0].plain_text);
      } else {
        aiReply = wrapReply(
          `Saya menemukan entri untuk **"${kataKunci}"** di database, namun kolom Jawaban masih kosong.`
        );
      }
    } else {
      aiReply = wrapReply(
        `Sistem belum menemukan FAQ untuk kendala **"${kataKunci}"** di kelas **${level}**.\n\n` +
        `**Saran penanganan awal:**\n` +
        `1. **Periksa Kabel:** Pastikan sambungan tidak longgar.\n` +
        `2. **Kesesuaian Pin:** Pastikan nomor pin di kode sama dengan fisik.\n` +
        `3. Coba kata kunci lebih pendek: *Motor, Sensor, Jalur, Belok, atau OLED*.`
      );
    }

    return NextResponse.json({ success: true, message: aiReply });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Kesalahan tidak diketahui.";
    console.error("Error internal backend:", errMsg);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}