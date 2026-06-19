import { NextResponse } from "next/server";
import { isAppleWalletConfigured } from "@/lib/env";
import { buildApplePass, type PassInput } from "@/lib/wallet/applePass";

export async function POST(req: Request) {
  if (!isAppleWalletConfigured()) {
    return NextResponse.json({ error: "Apple Wallet is not configured." }, { status: 501 });
  }

  let body: Partial<PassInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.reference || !body.event) {
    return NextResponse.json({ error: "Missing ticket details." }, { status: 400 });
  }

  try {
    const buffer = await buildApplePass({
      reference: String(body.reference),
      event: String(body.event),
      dateLabel: String(body.dateLabel ?? ""),
      timeLabel: String(body.timeLabel ?? ""),
      attendee: String(body.attendee ?? "Guest"),
      free: !!body.free,
      price: String(body.price ?? "Free"),
      startISO: body.startISO ? String(body.startISO) : undefined,
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="possabilities-${body.reference}.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("apple pass:", e);
    return NextResponse.json({ error: "Could not create the pass." }, { status: 500 });
  }
}
