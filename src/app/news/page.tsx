import Link from "next/link";
import { getNews } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { NewsThumb } from "@/components/NewsThumb";
import { PageHeader } from "@/components/PageHeader";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side">
      <PageHeader
        tone="purple"
        icon="newspaper"
        title="Community News"
        subtitle="Happy news and stories from across our community. Stay in the loop!"
      />

      {news.length === 0 && (
        <div className="bg-surface-container-low border-2 border-dashed border-brand-purple rounded-2xl p-stack-md text-center">
          <Icon name="newspaper" size={48} className="text-brand-purple/40 mx-auto" />
          <p className="font-body-lg text-body-lg text-on-surface mt-2">No community news just yet. Check back soon!</p>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
        {news.map((n) => (
          <Link
            key={n.id}
            href={`/news/${n.id}`}
            className="lift shadow-offset-purple bg-surface-white border-2 border-brand-purple rounded-2xl overflow-hidden group flex flex-col"
          >
            <NewsThumb post={n} />
            <div className="p-stack-sm flex flex-col gap-4 flex-1">
              <span className="self-start bg-brand-pink text-on-primary px-3 py-1 rounded-full font-label-bold text-caption uppercase">
                {n.category}
              </span>
              <h2 className="font-headline-md text-[24px] leading-tight">{n.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant flex-1">{n.excerpt}</p>
              <div className="flex items-center gap-2 text-brand-purple font-label-bold text-label-bold group-hover:gap-3 transition-all">
                Read the full story <Icon name="arrow_forward" size={20} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
