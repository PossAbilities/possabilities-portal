import Link from "next/link";
import { Icon } from "@/components/Icon";

export function Fab() {
  return (
    <Link
      href="/events"
      aria-label="Find an event"
      className="fixed bottom-28 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-brand-pink text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-40"
    >
      <Icon name="add" size={32} />
    </Link>
  );
}
