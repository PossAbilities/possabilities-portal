import { NextResponse } from "next/server";
import { isGoogleWalletConfigured } from "@/lib/env";
import { buildGoogleSaveUrl, type GooglePassInput } from "@/lib/wallet/googlePass";

export async function POST(req: Request) {
  if (!isGoogleWalletConfigured()) {
    return NextResponse.json({ error: "Google Wallet is not configured." }, { status: 501 });
  }

  let body: Partial<GooglePassInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.reference || !body.event) {
    return NextResponse.json({ error: "Missing ticket details." }, { status: 400 });
  }

  try {
    const url = buildGoogleSaveUrl({
      reference: String(body.reference),
      event: String(body.event),
      dateLabel: String(body.dateLabel ?? ""),
      timeLabel: String(body.timeLabel ?? ""),
      attendee: String(body.attendee ?? "Guest"),
      free: !!body.free,
      price: String(body.price ?? "Free"),
      startISO: body.startISO ? String(body.startISO) : undefined,
    });

    return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("google pass:", e);
    return NextResponse.json({ error: "Could not create the pass." }, { status: 500 });
  }
}
