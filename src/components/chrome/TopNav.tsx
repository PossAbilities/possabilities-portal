"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/support", label: "Support" },
];

export function TopNav() {
  const pathname = usePathname();
  const toast = useToast();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-white border-b-2 border-outline-variant flex justify-between items-center px-margin-side h-touch-target-min md:h-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-statement-text text-statement-text font-black text-brand-purple">
          Community Portal
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-8 h-full">
        {links.map((l) =>
          isActive(l.href) ? (
            <Link
              key={l.href}
              href={l.href}
              className="relative h-full flex items-center text-brand-purple border-b-4 border-brand-teal font-label-bold text-label-bold"
            >
              {l.label}
            </Link>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              className="text-on-surface-variant font-label-bold text-label-bold hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg"
            >
              {l.label}
            </Link>
          ),
        )}
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href="/support"
          aria-label="Help"
          className="text-primary w-12 h-12 hover:bg-surface-container-high rounded-full flex items-center justify-center"
        >
          <Icon name="help" />
        </Link>
        <button
          aria-label="Notifications"
          onClick={() => toast.show("You're all caught up — no new notifications")}
          className="text-primary w-12 h-12 hover:bg-surface-container-high rounded-full flex items-center justify-center"
        >
          <Icon name="notifications" />
        </button>
        <Link
          href="/admin"
          aria-label="Account"
          className="w-12 h-12 rounded-full bg-brand-teal flex items-center justify-center overflow-hidden border-2 border-brand-purple"
        >
          <Icon name="person" fill size={22} className="text-on-tertiary-fixed" />
        </Link>
      </div>
    </header>
  );
}
