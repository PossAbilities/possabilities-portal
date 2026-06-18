import Link from "next/link";
import { notFound } from "next/navigation";
import { getEasyRead } from "@/lib/easyreads";
import { PdfFlipbook } from "@/components/PdfFlipbook";
import { Icon } from "@/components/Icon";

export default async function EasyReadViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getEasyRead(id);
  if (!item || !item.pdfUrl) notFound();

  return (
    <div className="max-w-[1100px] mx-auto px-margin-side">
      <Link
        href="/easy-reads"
        className="inline-flex items-center gap-2 mb-stack-sm text-brand-purple font-label-bold text-label-bold hover:underline min-h-touch-target-min"
      >
        <Icon name="arrow_back" />
        Back to Easy Reads
      </Link>

      <section className="mb-stack-md">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-3">
          {item.title}
        </h1>
        {item.description && (
          <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
            {item.description}
          </p>
        )}
      </section>

      <section className="bg-surface-container-low rounded-2xl border-2 border-outline-variant p-stack-sm md:p-stack-md mb-stack-md">
        <PdfFlipbook src={`/easy-reads/${id}/pdf`} />
      </section>

      {item.workshopUrl && (
        <a
          href={item.workshopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-touch-target-min px-8 bg-brand-pink text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-secondary active:scale-95 transition-all mb-stack-lg"
        >
          <Icon name="school" />
          Join the workshop for this guide
        </a>
      )}
    </div>
  );
}
