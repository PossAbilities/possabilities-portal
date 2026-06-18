import { getLibrary } from "@/lib/easyreads";
import { EasyReadLibrary } from "@/components/EasyReadLibrary";
import { Icon } from "@/components/Icon";

export default async function EasyReadsPage() {
  const library = await getLibrary();

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side">
      <section className="mb-stack-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Easy Reads
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          Clear, easy-to-read guides you can read on screen or save to your device.
        </p>
      </section>

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
