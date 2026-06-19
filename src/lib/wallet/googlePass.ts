import "server-only";
import { createSign } from "node:crypto";

export interface GooglePassInput {
  reference: string;
  event: string;
  dateLabel: string;
  timeLabel: string;
  attendee: string;
  free: boolean;
  price: string;
  startISO?: string;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function loadServiceAccount(): ServiceAccount {
  const raw = Buffer.from(process.env.GOOGLE_WALLET_SA_B64 || "", "base64").toString("utf8");
  const sa = JSON.parse(raw) as ServiceAccount;
  if (!sa.client_email || !sa.private_key) throw new Error("Invalid Google Wallet service account.");
  return sa;
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Object IDs must be `<issuerId>.<suffix>` where suffix is [a-zA-Z0-9_.-]. */
const idSuffix = (ref: string) => ref.replace(/[^a-zA-Z0-9_.-]/g, "-");

/**
 * Builds a signed "Save to Google Wallet" URL for a community event ticket.
 * The class + object are defined inline in the JWT (fat JWT), so no extra
 * REST calls or pre-created class are needed.
 */
export function buildGoogleSaveUrl(t: GooglePassInput): string {
  const sa = loadServiceAccount();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID as string;
  const classId = `${issuerId}.possabilities_event`;
  const objectId = `${issuerId}.${idSuffix(t.reference)}`;

  const eventTicketClass = {
    id: classId,
    issuerName: "PossAbilities",
    reviewStatus: "UNDER_REVIEW",
    eventName: { defaultValue: { language: "en-GB", value: t.event } },
    hexBackgroundColor: "#48065A",
  };

  const eventTicketObject = {
    id: objectId,
    classId,
    state: "ACTIVE",
    hexBackgroundColor: "#48065A",
    ticketHolderName: t.attendee,
    ticketNumber: t.reference,
    barcode: {
      type: "QR_CODE",
      value: `POSSABILITIES-TICKET|${t.reference}|${t.event}`,
      alternateText: t.reference,
    },
    textModulesData: [
      { id: "when", header: "When", body: `${t.dateLabel}${t.timeLabel ? ` · ${t.timeLabel}` : ""}` },
      { id: "ticket", header: "Ticket", body: t.free ? "Free entry" : t.price },
    ],
    ...(t.startISO
      ? { validTimeInterval: { start: { date: t.startISO } } }
      : {}),
  };

  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: sa.client_email,
    aud: "google",
    typ: "savetowallet",
    origins: ["https://portal.possabilities.org.uk"],
    payload: {
      eventTicketClasses: [eventTicketClass],
      eventTicketObjects: [eventTicketObject],
    },
  };

  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const signature = b64url(createSign("RSA-SHA256").update(signingInput).sign(sa.private_key));
  const jwt = `${signingInput}.${signature}`;

  return `https://pay.google.com/gp/v/save/${jwt}`;
}
