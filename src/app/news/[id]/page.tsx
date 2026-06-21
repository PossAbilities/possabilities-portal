import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsPost } from "@/lib/data";
import { Icon } from "@/components/Icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getNewsPost(id);
  if (!post) return { title: "News — PossAbilities Portal" };
  return { title: `${post.title} — PossAbilities Portal`, description: post.excerpt };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsPost(id);
  if (!post) notFound();

  const paragraphs = (post.body || post.excerpt).split(/\n\n+/).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-margin-side">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 min-h-touch-target-min text-brand-purple font-label-bold text-label-bold hover:underline mb-stack-sm"
      >
        <Icon name="arrow_back" />
        Back to all news
      </Link>

      <article>
        <span className="text-brand-pink font-label-bold text-label-bold uppercase">{post.category}</span>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple leading-tight mt-2 mb-stack-sm">
          {post.title}
        </h1>

        <div className="aspect-video w-full overflow-hidden rounded-2xl border-2 border-brand-purple easy-read-shadow mb-stack-md">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="w-full h-full object-cover" alt={post.title} src={post.image} />
          ) : (
            <div className="w-full h-full" style={{ background: post.gradient }} />
          )}
        </div>

        <div className="space-y-stack-sm">
          {paragraphs.map((para, i) => (
            <p key={i} className="font-body-lg text-body-lg text-on-surface leading-[1.8]">
              {para}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-stack-lg pt-stack-md border-t-2 border-outline-variant">
        <Link
          href="/news"
          className="inline-flex items-center justify-center gap-2 min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary active:scale-95 transition-all"
        >
          <Icon name="arrow_back" />
          Read more community news
        </Link>
      </div>
    </div>
  );
}
