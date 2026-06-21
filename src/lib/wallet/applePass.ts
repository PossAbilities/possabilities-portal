import "server-only";
import { PKPass } from "passkit-generator";
import { PASS_ICON, PASS_ICON_2X, PASS_LOGO, PASS_LOGO_2X } from "./images";

export interface PassInput {
  reference: string;
  event: string;
  dateLabel: string;
  timeLabel: string;
  attendee: string;
  free: boolean;
  price: string;
  startISO?: string;
}

const b64 = (v: string) => Buffer.from(v, "base64");

/** Builds a signed Apple Wallet .pkpass for a community event ticket. */
export async function buildApplePass(t: PassInput): Promise<Buffer> {
  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID,
    teamIdentifier: process.env.APPLE_TEAM_ID,
    organizationName: "PossAbilities",
    description: `Ticket for ${t.event}`,
    serialNumber: t.reference,
    logoText: "PossAbilities",
    foregroundColor: "rgb(255,255,255)",
    backgroundColor: "rgb(72,6,90)",
    labelColor: "rgb(102,204,204)",
    ...(t.startISO ? { relevantDate: t.startISO } : {}),
    eventTicket: {
      primaryFields: [{ key: "event", label: "EVENT", value: t.event }],
      secondaryFields: [
        { key: "date", label: "WHEN", value: t.dateLabel },
        { key: "time", label: "TIME", value: t.timeLabel },
      ],
      auxiliaryFields: [
        { key: "name", label: "NAME", value: t.attendee },
        { key: "price", label: "TICKET", value: t.free ? "Free" : t.price },
      ],
      backFields: [
        { key: "ref", label: "Reference", value: t.reference },
        { key: "org", label: "Organiser", value: "PossAbilities Portal" },
        { key: "note", label: "Notes", value: "Show this pass when you arrive. Live The Life You Choose." },
      ],
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: `POSSABILITIES-TICKET|${t.reference}|${t.event}`,
        messageEncoding: "iso-8859-1",
        altText: t.reference,
      },
    ],
  };

  const pass = new PKPass(
    {
      "pass.json": Buffer.from(JSON.stringify(passJson)),
      "icon.png": b64(PASS_ICON),
      "icon@2x.png": b64(PASS_ICON_2X),
      "logo.png": b64(PASS_LOGO),
      "logo@2x.png": b64(PASS_LOGO_2X),
    },
    {
      wwdr: b64(process.env.APPLE_WWDR_B64 || "").toString("utf8"),
      signerCert: b64(process.env.APPLE_PASS_CERT_B64 || "").toString("utf8"),
      signerKey: b64(process.env.APPLE_PASS_KEY_B64 || "").toString("utf8"),
    },
  );

  return pass.getAsBuffer();
}
