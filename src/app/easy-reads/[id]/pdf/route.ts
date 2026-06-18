import { NextResponse } from "next/server";
import { getEasyRead } from "@/lib/easyreads";

// Streams an easy read's PDF from the same origin, so the in-browser flipbook
// (pdf.js) can render it without cross-origin restrictions. Only serves PDFs
// that belong to a known easy read (id looked up via the API) — not arbitrary URLs.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await getEasyRead(id);
  if (!item?.pdfUrl) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstream = await fetch(item.pdfUrl, { next: { revalidate: 300 } });
  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Failed to load PDF", { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=300",
    },
  });
}
