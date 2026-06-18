import "server-only";
import type { LibraryItem } from "./types";

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
      headers["Authorization"] = `Bearer ${key}`;
      headers["apikey"] = key; // harmless if unused; covers Supabase-style APIs
    }

    const res = await fetch(url, { headers, next: { revalidate: 300 } });
    if (!res.ok) {
      console.error("getEasyReads:", res.status, res.statusText);
      return [];
    }
    const json = await res.json();
    const rows: EasyReadApi[] = Array.isArray(json) ? json : json?.data ?? [];

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
