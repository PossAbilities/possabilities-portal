import { getPhotos, getVideos } from "@/lib/media";
import { Icon } from "@/components/Icon";

export default function MediaPage() {
  const videos = getVideos();
  const photos = getPhotos();

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side">
      <section className="mb-stack-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Multimedia Library
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          Watch videos and look at photos from across our community.
        </p>
      </section>

      {/* Videos */}
      <section id="videos" className="mb-stack-lg scroll-mt-24">
        <h2 className="font-headline-md text-headline-md text-brand-purple mb-stack-sm flex items-center gap-2">
          <Icon name="play_circle" fill className="text-brand-pink" />
          Videos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {videos.map((v) => (
            <div key={v.id} className="bg-surface-white border-2 border-brand-purple rounded-2xl overflow-hidden easy-read-shadow flex flex-col group">
              <div className="relative aspect-video w-full overflow-hidden bg-primary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={v.title} src={v.thumb} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 bg-brand-teal rounded-full flex items-center justify-center text-primary-container shadow-lg">
                    <Icon name="play_arrow" size={40} />
                  </span>
                </div>
              </div>
              <div className="p-stack-sm">
                <h3 className="font-headline-md text-[24px] text-brand-purple leading-tight">{v.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photos */}
      <section id="photos" className="mb-stack-lg scroll-mt-24">
        <h2 className="font-headline-md text-headline-md text-brand-purple mb-stack-sm flex items-center gap-2">
          <Icon name="photo_library" fill className="text-brand-teal" />
          Photo Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {photos.map((p) => (
            <a
              key={p.id}
              href={p.src}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square rounded-2xl overflow-hidden border-2 border-brand-purple easy-read-shadow group focus-visible:outline-4"
              aria-label={`Open photo: ${p.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.title} src={p.src} />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
