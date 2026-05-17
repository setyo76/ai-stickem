import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── NORMALIZE ────────────────────────────────────────────────────────────────
function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/stick\s*['\u2018\u2019`]?\s*em/gi, "stickem")
    .replace(/['\u2018\u2019`]/g, "'")
    .replace(/[?.,!]/g, "")
    .trim();
}

// ─── SCORING ──────────────────────────────────────────────────────────────────
function scoreMatch(query: string, pertanyaan: string): number {
  const q = normalizeText(query);
  const p = normalizeText(pertanyaan);

  if (!q || !p) return 0;

  let score = 0;

  if (p === q) score += 100;
  if (p.includes(q)) score += 50;
  if (q.includes(p)) score += 40;

  const qWords = q.split(/\s+/).filter(w => w.length > 1);
  const pWords = p.split(/\s+/).filter(w => w.length > 1);

  for (const qw of qWords) {
    if (pWords.some(pw => pw === qw)) score += 10;
    else if (pWords.some(pw => pw.includes(qw) || qw.includes(pw))) score += 5;
  }

  return score;
}

// ─── WRAP REPLY BERDASARKAN KATEGORI DATABASE ─────────────────────────────────
function wrapReply(core: string, kategori: string): string {
  const k = (kategori || "").toLowerCase();
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Salam / Greeting — langsung tampilkan jawaban, tanpa pengantar & closing
  if (
    k.includes("salam") ||
    k.includes("greeting") ||
    k.includes("halo") ||
    k.includes("perkenalan")
  ) {
    return core;
  }

  // Pilih Masalah Cepat — troubleshooting hardware/robot
  if (k.includes("pilih masalah")) {
    const opening = pick([
      "Tenang, ini yang perlu dicek:\n\n",
      "Jangan panik! Coba langkah berikut:\n\n",
      "Oke, ini yang harus kamu lakukan:\n\n",
    ]);
    const closing = pick([
      "\n\n---\n_Semoga masalahnya teratasi ya. Tetap semangat! 💪_",
      "\n\n---\n_Kalau masih ada kendala, tanya lagi ya. 🙌_",
    ]);
    return opening + core + closing;
  }

  // Stickem Academy — info & definisi platform
  if (k.includes("academy")) {
    const opening = pick([
      "Berikut penjelasannya:\n\n",
      "Ini dia info tentang Stickem Academy:\n\n",
      "Baik, ini penjelasan singkatnya:\n\n",
    ]);
    const closing = pick([
      "\n\n---\n_Semoga penjelasan ini membantu ya! 😊_",
      "\n\n---\n_Ada yang ingin ditanyakan lebih lanjut? 🙌_",
    ]);
    return opening + core + closing;
  }

  // Tutorial langkah-langkah
  if (
    k.includes("langkah awal") ||
    k.includes("menghubungkan") ||
    k.includes("coding blocks") ||
    k.includes("mengenal coding") ||
    k.includes("membuat program") ||
    k.includes("square the box")
  ) {
    const opening = pick([
      "Oke! Silahkan ikuti langkah berikut:\n\n",
      "Yuk ikuti cara berikut:\n\n",
      "Baik, ini langkah-langkahnya:\n\n",
    ]);
    const closing = pick([
      "\n\n---\n_Semoga berhasil! Kalau ada yang bingung, tanya lagi ya. 🚀_",
      "\n\n---\n_Dicoba dulu ya, semangat! 💪_",
    ]);
    return opening + core + closing;
  }

  // Materi pengetahuan / edukasi
  if (
    k.includes("steam") ||
    k.includes("manfaat") ||
    k.includes("robot mechanisms") ||
    k.includes("basic robot") ||
    k.includes("electronics") ||
    k.includes("problem solving") ||
    k.includes("masa depan")
  ) {
    const opening = pick([
      "Berikut informasinya:\n\n",
      "Ini penjelasannya:\n\n",
      "Baik, ini yang perlu kamu tahu:\n\n",
    ]);
    const closing = pick([
      "\n\n---\n_Semoga bermanfaat! 😊_",
      "\n\n---\n_Ada pertanyaan lain? Tanya saja ya. 🙌_",
    ]);
    return opening + core + closing;
  }

  // Default — umum
  const opening = pick([
    "Berikut jawabannya:\n\n",
    "Ini informasinya:\n\n",
  ]);
  const closing = pick([
    "\n\n---\n_Semoga membantu! 😊_",
    "\n\n---\n_Ada pertanyaan lain? Tanya saja ya. 🙌_",
  ]);
  return opening + core + closing;
}

// ─── QUERY NOTION ─────────────────────────────────────────────────────────────
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
      page_size: 20,
    }),
  });
  if (!res.ok) throw new Error(`Notion error ${res.status}`);
  return res.json();
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const textData = await request.text();
    if (!textData) {
      return NextResponse.json({ success: false, error: "Body kosong." }, { status: 400 });
    }

    const body = JSON.parse(textData);
    const message: string = body.message || "";
    const level: string   = body.level   || "Umum";

    if (!message) {
      return NextResponse.json({ success: false, error: "Pesan kosong." }, { status: 400 });
    }

    const notionToken = process.env.NOTION_TOKEN;
    const databaseIds = [
      process.env.NOTION_DATABASE_ID,
      process.env.NOTION_DATABASE_ID_2,
    ].filter(Boolean) as string[];

    if (!databaseIds.length || !notionToken) {
      throw new Error("Environment variables belum diatur.");
    }

    // Ekstrak kata kunci
    let kataKunci: string = message;
    if (message.includes("Masalah saya:")) {
      const match = message.match(/Masalah saya:\s*([^.]+)/);
      if (match) kataKunci = match[1].trim();
    }

    // Buat variasi query: kalimat penuh + tiap kata penting
    const normalized = normalizeText(kataKunci);
    const queryVariants: string[] = [
      kataKunci,
      normalized,
      ...normalized.split(/\s+/).filter(w => w.length >= 3),
    ].filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i);

    console.log("kataKunci:", kataKunci);
    console.log("queryVariants:", queryVariants);

    // Kumpulkan kandidat dari semua database
    type Candidate = { page: unknown; pertanyaan: string; kategori: string };
    const allCandidates: Candidate[] = [];
    const seenIds = new Set<string>();

    for (const dbId of databaseIds) {
      for (const variant of queryVariants) {
        try {
          const result = await queryNotion(dbId, notionToken, variant);
          for (const page of (result.results ?? [])) {
            const p = page as {
              id: string;
              properties: {
                Pertanyaan: { title: { plain_text: string }[] };
                Jawaban:    { rich_text: { plain_text: string }[] };
                Kategori:   { select: { name: string } };
              };
            };
            if (!seenIds.has(p.id)) {
              seenIds.add(p.id);
              const pertanyaan = p.properties["Pertanyaan"]?.title?.[0]?.plain_text  ?? "";
              const kategori   = p.properties["Kategori"]?.select?.name              ?? "";
              allCandidates.push({ page, pertanyaan, kategori });
            }
          }
        } catch (_) {}
      }
    }

    console.log("Total candidates:", allCandidates.length);

    // Scoring — pilih yang paling relevan
    let bestPage:     unknown = null;
    let bestScore:    number  = -1;
    let bestKategori: string  = "";

    for (const { page, pertanyaan, kategori } of allCandidates) {
      const score = scoreMatch(kataKunci, pertanyaan);
      console.log(`Score ${score} [${kategori}] — "${pertanyaan}"`);
      if (score > bestScore) {
        bestScore    = score;
        bestPage     = page;
        bestKategori = kategori;
      }
    }

    console.log("Best score:", bestScore, "| Kategori:", bestKategori);

    const MIN_SCORE = 5;
    let aiReply = "";

    if (bestPage && bestScore >= MIN_SCORE) {
      const p = bestPage as {
        properties: { Jawaban: { rich_text: { plain_text: string }[] } };
      };
      const propertiJawaban = p.properties["Jawaban"];
      if (propertiJawaban?.rich_text?.length > 0) {
        aiReply = wrapReply(propertiJawaban.rich_text[0].plain_text, bestKategori);
      } else {
        aiReply = wrapReply(
          `Saya menemukan entri untuk **"${kataKunci}"** di database, namun kolom Jawaban masih kosong.`,
          bestKategori
        );
      }
    } else {
      aiReply = wrapReply(
        `Sistem belum menemukan FAQ untuk kendala **"${kataKunci}"** di kelas **${level}**.\n\n` +
        `**Saran penanganan awal:**\n` +
        `1. **Periksa Kabel:** Pastikan sambungan tidak longgar.\n` +
        `2. **Kesesuaian Pin:** Pastikan nomor pin di kode sama dengan fisik.\n` +
        `3. Coba kata kunci lebih pendek: *Motor, Sensor, Jalur, Belok, atau OLED*.`,
        "umum"
      );
    }

    return NextResponse.json({ success: true, message: aiReply });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Kesalahan tidak diketahui.";
    console.error("Error:", errMsg);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}