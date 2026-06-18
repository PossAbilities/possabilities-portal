import Link from "next/link";
import { notFound } from "next/navigation";
import { getEasyRead } from "@/lib/easyreads";
import { BookReader } from "@/components/BookReader";
import { FullscreenToggle } from "@/components/FullscreenToggle";
import { Icon } from "@/components/Icon";

// Standalone, chrome-free reader window (AppShell strips the portal chrome for
// this route). Fills the viewport and adapts to the device.
export default async function EasyReadViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getEasyRead(id);
  if (!item || !item.pdfUrl) notFound();

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <header className="flex items-center justify-between gap-4 px-4 md:px-6 h-16 shrink-0 border-b-2 border-outline-variant bg-surface-white">
        <Link
          href="/easy-reads"
          className="inline-flex items-center gap-2 text-brand-purple font-label-bold text-label-bold hover:underline min-h-touch-target-min"
        >
          <Icon name="close" />
          <span className="hidden sm:inline">Close</span>
        </Link>
        <h1 className="font-headline-md text-[18px] md:text-[24px] text-brand-purple truncate text-center flex-1">
          {item.title}
        </h1>
        <FullscreenToggle />
      </header>
      <div className="flex-1 min-h-0">
        <BookReader src={`/easy-reads/${id}/pdf`} title={item.title} />
      </div>
    </div>
  );
}
