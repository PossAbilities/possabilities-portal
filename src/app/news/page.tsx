import { getNews } from "@/lib/data";
import { Icon } from "@/components/Icon";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side">
      <section className="mb-stack-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Community News
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          Happy news and stories from across our community. Stay in the loop!
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
        {news.map((n) => (
          <article key={n.id} className="bg-surface-white border-2 border-brand-purple rounded-2xl overflow-hidden group flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={n.title} src={n.image} />
            </div>
            <div className="p-stack-sm flex flex-col gap-4 flex-1">
              <span className="text-brand-pink font-label-bold text-label-bold uppercase">{n.category}</span>
              <h2 className="font-headline-md text-headline-md leading-tight">{n.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant flex-1">{n.excerpt}</p>
              <div className="flex items-center gap-2 text-brand-purple font-label-bold text-label-bold">
                <Icon name="schedule" size={18} /> Just now
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
