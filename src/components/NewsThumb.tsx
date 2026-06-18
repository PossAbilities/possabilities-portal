import type { NewsPost } from "@/lib/types";

/** News thumbnail — renders the image URL, or the stored CSS gradient. */
export function NewsThumb({ post }: { post: NewsPost }) {
  return (
    <div className="aspect-video w-full overflow-hidden">
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={post.title}
          src={post.image}
        />
      ) : (
        <div
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          style={{ background: post.gradient }}
        />
      )}
    </div>
  );
}
