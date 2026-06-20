import { getPhotos, getVideos } from "@/lib/media";
import { Icon } from "@/components/Icon";
import { PhotoGallery } from "@/components/PhotoGallery";

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
        {videos.length === 0 && (
          <p className="font-body-lg text-body-lg text-on-surface-variant">No videos to watch yet — check back soon!</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {videos.map((v) => (
            <div key={v.id} className="bg-surface-white border-2 border-brand-purple rounded-2xl overflow-hidden easy-read-shadow flex flex-col group">
              <div className="relative aspect-video w-full overflow-hidden bg-primary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover opacity-90" alt={v.title} src={v.thumb} loading="lazy" />
                <span className="absolute top-3 right-3 bg-brand-purple text-white font-label-bold text-caption px-3 py-1 rounded-full flex items-center gap-1">
                  <Icon name="schedule" size={16} /> Coming soon
                </span>
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
        <PhotoGallery photos={photos} />
      </section>
    </div>
  );
}
