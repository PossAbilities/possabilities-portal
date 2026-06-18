import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { TopNav } from "@/components/chrome/TopNav";
import { Sidebar } from "@/components/chrome/Sidebar";
import { MobileNav } from "@/components/chrome/MobileNav";
import { Footer } from "@/components/chrome/Footer";
import { Fab } from "@/components/chrome/Fab";

export const metadata: Metadata = {
  title: "PossAbilities Community Portal — Live The Life You Choose",
  description:
    "Your community, built for you. Access news, events, and support all in one happy, accessible place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&family=Atkinson+Hyperlegible+Next:wght@400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background text-on-surface min-h-full">
        <ToastProvider>
          <TopNav />
          <Sidebar />
          <main className="md:pl-64 pt-24 pb-32 md:pb-0 min-h-screen">{children}</main>
          <Footer />
          <MobileNav />
          <Fab />
        </ToastProvider>
      </body>
    </html>
  );
}
