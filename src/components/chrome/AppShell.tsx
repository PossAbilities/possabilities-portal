"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { Fab } from "./Fab";

// The reader window (/easy-reads/<id>) renders chrome-free and full-viewport so
// it behaves like a standalone document viewer. Everything else gets the portal
// chrome (top nav, sidebar, mobile nav, footer, FAB).
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = /^\/easy-reads\/[^/]+$/.test(pathname);

  if (isReader) {
    return <div className="min-h-[100dvh] bg-background">{children}</div>;
  }

  return (
    <>
      <TopNav />
      <Sidebar />
      <main className="md:pl-64 pt-24 pb-32 md:pb-0 min-h-screen">{children}</main>
      <Footer />
      <MobileNav />
      <Fab />
    </>
  );
}
