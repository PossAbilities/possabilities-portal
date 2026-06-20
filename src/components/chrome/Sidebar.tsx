"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/lib/auth-actions";
import { Icon } from "@/components/Icon";

interface Item {
  label: string;
  icon: string;
  href: string;
}

// Public menu — shown to everyone on the public site.
const PUBLIC_ITEMS: Item[] = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Events", icon: "event", href: "/events" },
  { label: "News", icon: "feed", href: "/news" },
  { label: "Support", icon: "support_agent", href: "/support" },
  { label: "Easy Reads", icon: "menu_book", href: "/easy-reads" },
  { label: "Watch & Listen", icon: "play_circle", href: "/media" },
];

// Admin menu — only shown inside /admin (which requires a signed-in user).
const ADMIN_ITEMS: Item[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Content", icon: "edit_document", href: "/admin#content-library" },
  { label: "Requests", icon: "feedback", href: "/admin#request-inbox" },
  { label: "Settings", icon: "settings", href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [, startTransition] = useTransition();
  const items = isAdmin ? ADMIN_ITEMS : PUBLIC_ITEMS;

  const isItemActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return pathname === "/";
    if (base === "/admin") return pathname === "/admin";
    return pathname.startsWith(base);
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r-2 border-outline-variant pt-24 z-40">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-teal rounded-xl flex items-center justify-center">
            <Icon name={isAdmin ? "shield_person" : "hub"} fill size={24} className="text-on-tertiary-fixed" />
          </div>
          <div>
            <p className="font-label-bold text-label-bold text-brand-purple">{isAdmin ? "Admin Menu" : "Main Menu"}</p>
            <p className="text-caption font-caption text-on-surface-variant">
              {isAdmin ? "Manage the portal" : "Explore Community"}
            </p>
          </div>
        </div>
        {isAdmin && (
          <Link
            href="/admin/new"
            className="w-full min-h-touch-target-min bg-brand-purple text-on-primary py-3 px-4 rounded-xl font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95"
          >
            <Icon name="add_circle" />
            New Post
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((it) => {
          const active = isItemActive(it.href);
          const cls = active
            ? "bg-brand-teal text-on-tertiary-fixed font-bold rounded-lg m-2 px-4 py-3 min-h-touch-target-min flex items-center gap-3"
            : "text-on-surface-variant hover:bg-surface-container-high rounded-lg m-2 px-4 py-3 min-h-touch-target-min flex items-center gap-3 transition-all";
          return (
            <Link key={it.label} href={it.href} className={cls}>
              <Icon name={it.icon} fill={active} />
              <span className="font-label-bold text-label-bold">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out + return to public site — admin only */}
      {isAdmin && (
        <div className="p-4 border-t-2 border-outline-variant space-y-1">
          <Link
            href="/"
            className="w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-3 min-h-touch-target-min flex items-center gap-3 transition-all"
          >
            <Icon name="public" />
            <span className="font-label-bold text-label-bold">View site</span>
          </Link>
          <button
            onClick={() => startTransition(() => signOut())}
            className="w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-3 min-h-touch-target-min flex items-center gap-3 transition-all"
          >
            <Icon name="logout" />
            <span className="font-label-bold text-label-bold">Log Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
