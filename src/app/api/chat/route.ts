export const runtime = "nodejs";
import { NextResponse } from "next/server";

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

    let kataKunci = message;
    if (message.includes("Masalah saya:")) {
      const match = message.match(/Masalah saya:\s*([^.]+)/);
      if (match) kataKunci = match[1].trim();
    }

    // Gunakan fetch langsung ke Notion REST API
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Pertanyaan",
          title: {
            contains: kataKunci,
          },
        },
      }),
    });

    if (!notionRes.ok) {
      const errBody = await notionRes.text();
      throw new Error(`Notion API error ${notionRes.status}: ${errBody}`);
    }

    const responseNotion = await notionRes.json();

    let aiReply = "";

    if (responseNotion.results && responseNotion.results.length > 0) {
      const page = responseNotion.results[0];
      const propertiJawaban = page.properties["Jawaban"];

      if (propertiJawaban?.rich_text?.length > 0) {
        aiReply = propertiJawaban.rich_text[0].plain_text;
      } else {
        aiReply = `Saya menemukan kendala **${kataKunci}** di database, namun kolom Jawaban pada Notion masih kosong.`;
      }
    } else {
      aiReply =
        `### 🤖 Halo! Solusi Spesifik Belum Tersedia\n` +
        `Sistem belum menemukan FAQ untuk kendala **"${kataKunci}"** di kelas **${level}**.\n\n` +
        `**Saran penanganan awal:**\n` +
        `1. **Periksa Kabel:** Pastikan sambungan tidak longgar.\n` +
        `2. **Kesesuaian Pin:** Pastikan nomor pin di kode sama dengan fisik.\n` +
        `3. Coba kata kunci lebih pendek: *Motor, Sensor, Jalur, Belok, atau OLED*.`;
    }

    return NextResponse.json({ success: true, message: aiReply });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Kesalahan tidak diketahui.";
    console.error("Error internal backend:", errMsg);
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: 500 }
    );
  }
}