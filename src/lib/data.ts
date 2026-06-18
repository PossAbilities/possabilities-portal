import "server-only";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./env";
import { formatEventDate, resolveImage } from "./format";
import {
  seedContent,
  seedEvents,
  seedNews,
  seedPolicies,
  seedRequests,
  type ContentItem,
} from "./seed";
import type {
  CommunityEvent,
  NewsPost,
  Policy,
  RequestItem,
  RequestRow,
  RequestStatus,
} from "./types";

export { isSupabaseConfigured };

// News, events and policies are curated content. They live in Supabase but
// fall back to the seed set until the project is connected / populated.
// The existing news_posts table stores featured_image as either a URL or a
// Tailwind gradient class, and may flag posts published/unpublished.
interface NewsRow {
  id: string;
  title?: string;
  excerpt?: string;
  category?: string;
  featured_image?: string;
  image?: string;
  published?: boolean;
}

function rowToNews(r: NewsRow): NewsPost {
  const resolved = resolveImage(r.featured_image ?? r.image);
  return {
    id: r.id,
    category: r.category || "News",
    title: r.title || "",
    excerpt: r.excerpt || "",
    image: resolved.url || "",
    gradient: resolved.gradient || "",
  };
}

export async function getNews(): Promise<NewsPost[]> {
  if (!isSupabaseConfigured()) return seedNews();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || !data.length) return seedNews();
    return (data as NewsRow[]).filter((r) => r.published !== false).map(rowToNews);
  } catch {
    return seedNews();
  }
}

// The existing events table stores a single ISO `date` and a `color` accent,
// with no explicit price (community events are free to express interest in).
interface EventRow {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  image?: string;
  color?: string;
  price?: string;
  free?: boolean;
}

function rowToEvent(r: EventRow): CommunityEvent {
  const { dateLabel, timeLabel } = formatEventDate(r.date);
  const free = r.free ?? !r.price;
  return {
    id: r.id,
    title: r.title || "",
    description: r.description || "",
    dateLabel,
    timeLabel,
    image: resolveImage(r.image).url || "",
    free,
    price: free ? "Free" : r.price || "Free",
  };
}

export async function getEvents(): Promise<CommunityEvent[]> {
  if (!isSupabaseConfigured()) return seedEvents();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (error || !data || !data.length) return seedEvents();
    return (data as EventRow[]).map(rowToEvent);
  } catch {
    return seedEvents();
  }
}

export async function getPolicies(): Promise<Policy[]> {
  if (!isSupabaseConfigured()) return seedPolicies();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("policies").select("*");
    if (error || !data || !data.length) return seedPolicies();
    return data as Policy[];
  } catch {
    return seedPolicies();
  }
}

export function getContent(): ContentItem[] {
  return seedContent();
}

function rowToRequest(r: RequestRow): RequestItem {
  return {
    id: r.id,
    kind: (r.kind as RequestItem["kind"]) || "FEEDBACK",
    subject: r.subject || "",
    submittedBy: r.submitted_by || "Anonymous",
    status: (r.status as RequestStatus) || "Pending",
    detail: r.detail || {},
    createdAt: r.created_at || "",
  };
}

export async function getRequests(): Promise<RequestItem[]> {
  if (!isSupabaseConfigured()) return seedRequests();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return seedRequests();
    if (!data || !data.length) return seedRequests();
    return (data as RequestRow[]).map(rowToRequest);
  } catch {
    return seedRequests();
  }
}
