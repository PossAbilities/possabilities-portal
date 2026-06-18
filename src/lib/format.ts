// Helpers to adapt the existing Supabase data to the UI.

// A small slice of the Tailwind palette — enough to render the gradient
// classes stored in news_posts.featured_image as real CSS gradients.
const TW: Record<string, string> = {
  "yellow-300": "#fde047", "yellow-400": "#facc15",
  "orange-300": "#fdba74", "orange-400": "#fb923c", "orange-500": "#f97316",
  "red-300": "#fca5a5", "red-400": "#f87171", "red-500": "#ef4444",
  "pink-300": "#f9a8d4", "pink-400": "#f472b6", "pink-500": "#ec4899",
  "purple-300": "#d8b4fe", "purple-400": "#c084fc", "purple-500": "#a855f7", "purple-600": "#9333ea",
  "blue-300": "#93c5fd", "blue-400": "#60a5fa", "blue-500": "#3b82f6", "blue-600": "#2563eb",
  "indigo-400": "#818cf8", "indigo-500": "#6366f1", "indigo-600": "#4f46e5",
  "green-300": "#86efac", "green-400": "#4ade80", "green-500": "#22c55e",
  "teal-300": "#5eead4", "teal-400": "#2dd4bf",
  "cyan-300": "#67e8f9", "cyan-400": "#22d3ee",
};

const DIR: Record<string, string> = {
  "to-r": "to right",
  "to-l": "to left",
  "to-t": "to top",
  "to-b": "to bottom",
  "to-tr": "to top right",
  "to-tl": "to top left",
  "to-br": "to bottom right",
  "to-bl": "to bottom left",
};

const BRAND_GRADIENT = "linear-gradient(to bottom right, #48065a, #ec008c)";

/**
 * Turns a stored featured_image value into something renderable.
 * Returns { url } for real images, or { gradient } (CSS) for Tailwind
 * gradient classes like "bg-gradient-to-br from-yellow-300 to-orange-400".
 */
export function resolveImage(value: string | null | undefined): {
  url?: string;
  gradient?: string;
} {
  const v = (value || "").trim();
  if (!v) return { gradient: BRAND_GRADIENT };
  if (v.startsWith("http") || v.startsWith("data:") || v.startsWith("/")) return { url: v };

  const dirKey = Object.keys(DIR).find((d) => v.includes(`gradient-${d} `) || v.includes(`${d} `));
  const dir = dirKey ? DIR[dirKey] : "to bottom right";
  const from = v.match(/from-([a-z]+-\d+)/)?.[1];
  const to = v.match(/to-([a-z]+-\d+)/)?.[1];
  const fromHex = from && TW[from];
  const toHex = to && TW[to];
  if (fromHex && toHex) return { gradient: `linear-gradient(${dir}, ${fromHex}, ${toHex})` };
  return { gradient: BRAND_GRADIENT };
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** ISO timestamp → { dateLabel: "Sunday, 15th September", timeLabel: "2:00 PM" } */
export function formatEventDate(iso: string | null | undefined): {
  dateLabel: string;
  timeLabel: string;
} {
  if (!iso) return { dateLabel: "", timeLabel: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { dateLabel: iso, timeLabel: "" };
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const month = d.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" });
  const day = d.getUTCDate();
  const dateLabel = `${weekday}, ${ordinal(day)} ${month}`;
  const timeLabel = d
    .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" })
    .toUpperCase()
    .replace(/\s/g, " ");
  return { dateLabel, timeLabel };
}
