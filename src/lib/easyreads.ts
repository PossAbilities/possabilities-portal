import "server-only";
import type { LibraryItem } from "./types";
import { getPolicies } from "./data";

export type { LibraryItem };

// Raw shape from the external Easy Reads platform.
interface EasyReadApi {
  id: string;
  title?: string;
  description?: string;
  pdf_url?: string;
  cover_image_url?: string;
  workshop_url?: string;
  display_order?: number;
  updated_at?: string;
}

export function isEasyReadsConfigured(): boolean {
  return !!process.env.EASY_READS_API_URL;
}

/**
 * Fetches easy reads from the external platform. Auth is sent as
 * `Authorization: Bearer <EASY_READS_API_KEY>` when a key is set. Returns []
 * on any failure so the Support page can fall back to Supabase policies.
 */
export async function getEasyReads(): Promise<LibraryItem[]> {
  const url = process.env.EASY_READS_API_URL;
  if (!url) return [];

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const key = process.env.EASY_READS_API_KEY;
    if (key) {
      // The platform accepts either; X-API-Key avoids clashing with the
      // Supabase Edge Function gateway's own Authorization handling.
      headers["X-API-Key"] = key;
      headers["Authorization"] = `Bearer ${key}`;
    }

    const res = await fetch(url, { headers, next: { revalidate: 300 } });
    if (!res.ok) {
      console.error("getEasyReads:", res.status, res.statusText);
      return [];
    }
    const json = await res.json();
    // Accept a bare array, { data: [...] } (list) or { data: {...} } (single).
    const raw = Array.isArray(json) ? json : json?.data;
    const rows: EasyReadApi[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

    return rows
      .slice()
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((r) => ({
        id: r.id,
        title: r.title || "",
        description: r.description || "",
        image: r.cover_image_url || "",
        pdfUrl: r.pdf_url || undefined,
        workshopUrl: r.workshop_url || undefined,
        updatedAt: r.updated_at || undefined,
      }));
  } catch (e) {
    console.error("getEasyReads:", e);
    return [];
  }
}

/**
 * The library shown on the Support page and the Easy Reads page: API easy reads
 * when available, otherwise the Supabase policies so it's never empty.
 */
export async function getLibrary(): Promise<LibraryItem[]> {
  const easyReads = await getEasyReads();
  if (easyReads.length) return easyReads;
  const policies = await getPolicies();
  return policies.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    body: p.body,
  }));
}
