"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";

const links = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/events", label: "Events", icon: "event" },
  { href: "/news", label: "News", icon: "feed" },
  { href: "/support", label: "Support", icon: "support_agent" },
];

export function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-24 px-4 pb-4 bg-surface-white border-t-4 border-brand-purple z-50 md:hidden rounded-t-xl">
      {links.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={
              active
                ? "flex flex-col items-center justify-center gap-0.5 bg-primary-container text-on-primary-container rounded-xl p-2 w-[72px] min-h-touch-target-min"
                : "flex flex-col items-center justify-center gap-0.5 text-on-surface-variant p-2 w-[72px] min-h-touch-target-min hover:bg-primary-fixed-dim rounded-xl transition-colors"
            }
          >
            <Icon name={l.icon} fill={active} />
            <span className="font-label-bold text-[12px] leading-tight">{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
