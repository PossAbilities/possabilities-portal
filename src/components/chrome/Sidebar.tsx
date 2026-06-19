"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/lib/auth-actions";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";

interface Item {
  label: string;
  icon: string;
  href?: string;
  comingSoon?: boolean;
}

const items: Item[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Content", icon: "edit_document", href: "/admin#content-library" },
  { label: "Requests", icon: "feedback", href: "/admin#request-inbox" },
  { label: "Settings", icon: "settings", href: "/admin/settings" },
  { label: "Easy Read", icon: "menu_book", href: "/easy-reads" },
  { label: "Watch", icon: "play_circle", href: "/media" },
];

export function Sidebar() {
  const pathname = usePathname();
  const toast = useToast();
  const [, startTransition] = useTransition();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r-2 border-outline-variant pt-24 z-40">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-teal rounded-xl flex items-center justify-center">
            <Icon name="hub" fill size={24} className="text-on-tertiary-fixed" />
          </div>
          <div>
            <p className="font-label-bold text-label-bold text-brand-purple">Main Menu</p>
            <p className="text-caption font-caption text-on-surface-variant">Explore Community</p>
          </div>
        </div>
        <Link
          href="/admin/new"
          className="w-full bg-brand-purple text-on-primary py-3 px-4 rounded-xl font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95"
        >
          <Icon name="add_circle" />
          New Post
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map((it) => {
          const base = (it.href ?? "").split("#")[0];
          const active =
            it.label === "Dashboard"
              ? pathname === "/admin"
              : !!base && base !== "/admin" && pathname.startsWith(base);
          const cls = active
            ? "bg-brand-teal text-on-tertiary-fixed font-bold rounded-lg m-2 px-4 py-3 flex items-center gap-3"
            : "text-on-surface-variant hover:bg-surface-container-high rounded-lg m-2 px-4 py-3 flex items-center gap-3 transition-all";
          return it.comingSoon ? (
            <button
              key={it.label}
              onClick={() => toast.show("Coming soon")}
              className={cls + " w-[calc(100%-1rem)] text-left"}
            >
              <Icon name={it.icon} fill={active} />
              <span className="font-label-bold text-label-bold">{it.label}</span>
            </button>
          ) : (
            <Link key={it.label} href={it.href!} className={cls}>
              <Icon name={it.icon} fill={active} />
              <span className="font-label-bold text-label-bold">{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t-2 border-outline-variant">
        <button
          onClick={() => startTransition(() => signOut())}
          className="w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-3 flex items-center gap-3 transition-all"
        >
          <Icon name="logout" />
          <span className="font-label-bold text-label-bold">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
