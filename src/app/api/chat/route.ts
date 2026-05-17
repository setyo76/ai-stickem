import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/stick\s*['\u2018\u2019`]?\s*em/gi, "stickem")
    .replace(/['\u2018\u2019`]/g, "'")
    .replace(/[?.,!]/g, "")
    .trim();
}

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

type KonteksJawaban =
  | "salam"
  | "definisi"
  | "masalah"
  | "tutorial"
  | "harga"
  | "umum";

function deteksiKonteks(pertanyaan: string): KonteksJawaban {
  const q = (pertanyaan || "").toLowerCase().trim();

  // Salam — kata pendek tanpa tanda tanya, tidak mengandung kata teknis
  const isSalamMurni =
    /^(halo|hai|hi|hello|hey|selamat pagi|selamat siang|selamat sore|selamat malam|pagi|siang|sore|malam|assalamualaikum|hola|yo|sup)[\s!.]*$/.test(q);
  if (isSalamMurni) return "salam";

  // Pertanyaan harga / langganan
  if (/harga|biaya|bayar|berlangganan|beli|gratis|subscribe|free/.test(q)) return "harga";

  // Pertanyaan masalah / troubleshooting
  if (/tidak bisa|tidak jalan|tidak nyala|tidak muncul|tidak terbaca|tidak bergerak|tidak konek|tidak tersambung|error|mati|blank|rusak|gagal|kenapa|mengapa|tolong|help|bantuin|bantuan/.test(q)) return "masalah";

  // Pertanyaan tutorial / cara melakukan sesuatu
  if (/cara|langkah|bagaimana|gimana|mulai|buat|pasang|hubungkan|konek|install|setting|konfigurasi|upload|download|daftar|registrasi|login/.test(q)) return "tutorial";

  // Pertanyaan definisi / pengertian
  if (/apa itu|apa sih|apakah|pengertian|definisi|adalah|apa yang dimaksud|ceritakan|jelaskan|maksud|artinya|fungsi|kegunaan|manfaat/.test(q)) return "definisi";

  return "umum";
}

function wrapReply(core: string, pertanyaan: string): string {
  const konteks = deteksiKonteks(pertanyaan);

  // Salam — tidak perlu pengantar atau closing, langsung jawab natural
  if (konteks === "salam") {
    return core;
  }

  let opening = "";
  let closing  = "";
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  switch (konteks) {

    case "definisi":
      opening = pick([
        "Berikut penjelasannya:\n\n",
        "Ini dia penjelasannya:\n\n",
        "Baik, ini penjelasan singkatnya:\n\n",
      ]);
      closing = pick([
        "\n\n---\n_Semoga penjelasan ini membantu ya! 😊_",
        "\n\n---\n_Ada yang ingin ditanyakan lebih lanjut? 🙌_",
      ]);
      break;

    case "masalah":
      opening = pick([
        "Tenang, ini yang perlu dicek:\n\n",
        "Oke, ini langkah yang bisa dicoba:\n\n",
        "Jangan panik! Coba ikuti langkah berikut:\n\n",
      ]);
      closing = pick([
        "\n\n---\n_Semoga masalahnya teratasi ya. Tetap semangat! 💪_",
        "\n\n---\n_Kalau masih ada kendala, tanya lagi ya. 🙌_",
      ]);
      break;

    case "tutorial":
      opening = pick([
        "Oke! Silahkan ikuti langkah berikut:\n\n",
        "Baik, ini langkah-langkahnya:\n\n",
        "Yuk ikuti cara berikut:\n\n",
      ]);
      closing = pick([
        "\n\n---\n_Semoga berhasil! Kalau ada yang bingung, tanya lagi ya. 🚀_",
        "\n\n---\n_Dicoba dulu ya, semangat! 💪_",
      ]);
      break;

    case "harga":
      opening = pick([
        "Ini informasi terkait harga dan akses:\n\n",
        "Berikut info langganan Stickem:\n\n",
      ]);
      closing = pick([
        "\n\n---\n_Ada pertanyaan lain seputar akses? Tanya saja ya! 😊_",
      ]);
      break;

    default: // "umum"
      opening = pick([
        "Ini informasinya:\n\n",
        "Berikut jawabannya:\n\n",
      ]);
      closing = pick([
        "\n\n---\n_Semoga membantu! 😊_",
        "\n\n---\n_Ada pertanyaan lain? Tanya saja ya. 🙌_",
      ]);
      break;
  }

  return opening + core + closing;
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
      page_size: 20,
    }),
  });
  if (!res.ok) throw new Error(`Notion error ${res.status}`);
  return res.json();
}

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
    console.log("konteks:", deteksiKonteks(kataKunci));
    console.log("queryVariants:", queryVariants);

    // Kumpulkan kandidat dari semua database
    const allCandidates: { page: unknown; pertanyaan: string }[] = [];
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
                Jawaban: { rich_text: { plain_text: string }[] };
              };
            };
            if (!seenIds.has(p.id)) {
              seenIds.add(p.id);
              const pertanyaan = p.properties["Pertanyaan"]?.title?.[0]?.plain_text ?? "";
              allCandidates.push({ page, pertanyaan });
            }
          }
        } catch (_) {}
      }
    }

    console.log("Total candidates:", allCandidates.length);

    // Scoring — pilih yang paling relevan
    let bestPage: unknown = null;
    let bestScore         = -1;

    for (const { page, pertanyaan } of allCandidates) {
      const score = scoreMatch(kataKunci, pertanyaan);
      console.log(`Score ${score} — "${pertanyaan}"`);
      if (score > bestScore) {
        bestScore = score;
        bestPage  = page;
      }
    }

    console.log("Best score:", bestScore);

    const MIN_SCORE = 5;
    let aiReply = "";

    if (bestPage && bestScore >= MIN_SCORE) {
      const p = bestPage as {
        properties: { Jawaban: { rich_text: { plain_text: string }[] } };
      };
      const propertiJawaban = p.properties["Jawaban"];
      if (propertiJawaban?.rich_text?.length > 0) {
        aiReply = wrapReply(propertiJawaban.rich_text[0].plain_text, kataKunci);
      } else {
        aiReply = wrapReply(
          `Saya menemukan entri untuk **"${kataKunci}"** di database, namun kolom Jawaban masih kosong.`,
          kataKunci
        );
      }
    } else {
      aiReply = wrapReply(
        `Sistem belum menemukan FAQ untuk kendala **"${kataKunci}"** di kelas **${level}**.\n\n` +
        `**Saran penanganan awal:**\n` +
        `1. **Periksa Kabel:** Pastikan sambungan tidak longgar.\n` +
        `2. **Kesesuaian Pin:** Pastikan nomor pin di kode sama dengan fisik.\n` +
        `3. Coba kata kunci lebih pendek: *Motor, Sensor, Jalur, Belok, atau OLED*.`,
        kataKunci
      );
    }

    return NextResponse.json({ success: true, message: aiReply });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Kesalahan tidak diketahui.";
    console.error("Error:", errMsg);
    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }
}