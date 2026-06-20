import { getLibrary } from "@/lib/easyreads";
import { EasyReadLibrary } from "@/components/EasyReadLibrary";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";

export default async function EasyReadsPage() {
  const library = await getLibrary();

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side">
      <PageHeader
        tone="pink"
        icon="menu_book"
        title="Easy Reads"
        subtitle="Clear, easy-to-read guides you can read on screen or save to your device."
      />

      <section className="mb-stack-lg">
        <h2 className="font-headline-md text-headline-md text-brand-purple mb-stack-sm flex items-center gap-2">
          <Icon name="menu_book" fill className="text-brand-pink" />
          Guides &amp; Information
        </h2>
        <EasyReadLibrary items={library} />
      </section>
    </div>
  );
}
