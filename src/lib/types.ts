// Domain types for the PossAbilities Community Hub.

export interface NewsPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body?: string; // full article text (paragraphs split on blank lines); falls back to excerpt
  image: string; // image URL (empty when a gradient is used instead)
  gradient: string; // CSS gradient string (empty when an image URL is used)
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  image: string;
  free: boolean;
  price: string; // e.g. "£5.00" or "Free"
  startISO?: string; // raw ISO start (from Supabase) for calendar export
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  image: string;
  body: string;
}

// Unified item for the Support "Easy-Read" library — covers both the external
// API easy reads (pdfUrl/workshopUrl) and the Supabase policy fallback (body).
export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  pdfUrl?: string;
  workshopUrl?: string;
  body?: string;
  updatedAt?: string;
}

export type RequestKind = "NEWS" | "EVENT" | "FEEDBACK" | "CONCERN" | "COMPLIMENT";
export type RequestStatus = "Pending" | "Investigating" | "Resolved";

export interface RequestItem {
  id: string;
  kind: RequestKind;
  subject: string;
  submittedBy: string;
  status: RequestStatus;
  detail: Record<string, string>;
  createdAt: string;
}

// ---- Supabase row shapes ----
export interface RequestRow {
  id: string;
  kind: string;
  subject: string;
  submitted_by: string;
  status: string;
  detail: Record<string, string>;
  created_at?: string;
}
