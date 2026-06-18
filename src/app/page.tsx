import Link from "next/link";
import { getNews } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { NewsThumb } from "@/components/NewsThumb";

const G = "https://lh3.googleusercontent.com/aida-public/";
const FEATURE_VIDEO =
  G +
  "AB6AXuBlA2zWlEluR6U4BtN0jixhPH6pRFRVdQdnDVcv7HFZ7sfh3ueRoGjhvEAgnBqY9T8PC3r7jG_gGy3hPjEDXb6HhEGUCoHJy5AsSoR029yyiUDqesb3IU3WWPryKpJ3n8TavNKlB-sphpJPoNpMFiac__HgWdu6tIgJLRDB_o_zfc3FUSGr8AjXsGdF9IEUtFMNHeC4WnXShohWyp9rfnckXSUt4y1WHu5iV5NnT8n5C1BV7YveD8PMeYFtuLcJTOCfJAYv2ux35oZC";

export default async function HomePage() {
  const news = await getNews();

  return (
    <>
      {/* Hero */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-primary px-margin-side py-stack-lg overflow-hidden">
        <div className="relative z-10 text-center max-w-4xl flex flex-col items-center gap-stack-sm">
          <span className="bg-brand-pink text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold animate-bounce">
            Welcome to the Portal
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary">
            Live The Life You Choose
          </h1>
          <p className="font-statement-text text-statement-text text-white opacity-90 leading-relaxed max-w-2xl">
            Our community is built for you. Access news, events, and support all in one happy,
            accessible place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="min-h-[56px] flex items-center px-10 bg-brand-teal text-on-tertiary-fixed font-label-bold text-label-bold rounded-xl border-4 border-transparent hover:scale-105 transition-transform"
            >
              Explore Now
            </Link>
            <Link
              href="/support"
              className="min-h-[56px] flex items-center px-10 border-2 border-white text-white font-label-bold text-label-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-margin-side py-stack-lg bg-surface-bright">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <Link
            href="/events"
            className="flex flex-col items-center justify-center gap-4 p-10 bg-brand-purple text-on-primary rounded-2xl easy-read-shadow hover:translate-y-[-4px] active:scale-95 transition-all"
          >
            <Icon name="event" size={48} />
            <span className="font-headline-md text-headline-md">Join an Event</span>
          </Link>
          <Link
            href="/news"
            className="flex flex-col items-center justify-center gap-4 p-10 bg-brand-teal text-on-tertiary-fixed rounded-2xl easy-read-shadow hover:translate-y-[-4px] active:scale-95 transition-all"
          >
            <Icon name="share" size={48} />
            <span className="font-headline-md text-headline-md">Share News</span>
          </Link>
          <Link
            href="/support"
            className="flex flex-col items-center justify-center gap-4 p-10 bg-brand-pink text-on-primary rounded-2xl easy-read-shadow hover:translate-y-[-4px] active:scale-95 transition-all"
          >
            <Icon name="support_agent" size={48} />
            <span className="font-headline-md text-headline-md">Get Help</span>
          </Link>
        </div>
      </section>

      {/* Latest updates */}
      <section className="px-margin-side py-stack-lg border-t-2 border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-end mb-stack-md gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md text-brand-purple">Latest Updates</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Stay in the loop with our happy community news.
            </p>
          </div>
          <Link
            href="/news"
            className="font-label-bold text-label-bold text-brand-pink flex items-center gap-2 hover:underline"
          >
            View All News <Icon name="arrow_forward" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {news.map((n) => (
            <div key={n.id} className="bg-surface-white border-2 border-brand-purple rounded-2xl overflow-hidden group">
              <NewsThumb post={n} />
              <div className="p-stack-sm flex flex-col gap-4">
                <span className="text-brand-pink font-label-bold text-label-bold uppercase">{n.category}</span>
                <h3 className="font-headline-md text-headline-md leading-tight">{n.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{n.excerpt}</p>
                <Link
                  href="/news"
                  className="mt-2 min-h-touch-target-min flex items-center justify-center bg-surface-container-high text-brand-purple font-label-bold text-label-bold rounded-lg hover:bg-brand-teal transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multimedia hub */}
      <section className="px-margin-side py-stack-lg bg-primary-container text-on-primary-container rounded-t-[40px] mt-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-primary-container mb-stack-md flex items-center gap-4">
          <Icon name="play_circle" size={40} className="text-brand-teal" />
          Multimedia Hub
        </h2>
        <div className="flex flex-col lg:flex-row gap-gutter">
          <div className="flex-[2] bg-primary rounded-3xl overflow-hidden border-4 border-brand-teal relative group min-h-[280px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity absolute inset-0" alt="Community showcase" src={FEATURE_VIDEO} />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-24 h-24 bg-brand-teal rounded-full flex items-center justify-center text-primary-container active:scale-90 transition-transform shadow-lg" aria-label="Play video">
                <Icon name="play_arrow" size={64} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-stack-sm bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-headline-md text-headline-md text-white">Community Highlights: 2024 Showcase</h4>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-stack-sm">
            <div className="bg-surface-white/10 p-stack-sm rounded-2xl border-2 border-white/20">
              <h5 className="font-label-bold text-label-bold mb-4 flex items-center gap-2">
                <Icon name="image" /> Image Galleries
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square rounded-xl bg-white/10 border border-white/20" />
                <div className="aspect-square rounded-xl bg-white/10 border border-white/20" />
                <div className="aspect-square rounded-xl bg-white/10 border border-white/20" />
                <div className="aspect-square relative rounded-xl overflow-hidden bg-brand-pink border border-white/20 flex items-center justify-center">
                  <span className="font-headline-md text-headline-md">+12</span>
                </div>
              </div>
            </div>
            <Link
              href="/news"
              className="w-full min-h-touch-target-min flex items-center justify-center bg-brand-pink text-white font-label-bold text-label-bold rounded-xl hover:bg-on-secondary-container transition-colors"
            >
              Open Multimedia Library
            </Link>
          </div>
        </div>
      </section>

      {/* Participation hub */}
      <section className="px-margin-side py-stack-lg">
        <div className="bg-surface-container-low border-2 border-dashed border-brand-purple rounded-[40px] p-stack-md flex flex-col gap-stack-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-teal rounded-full flex items-center justify-center text-on-tertiary-fixed">
              <Icon name="hub" size={32} />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-brand-purple">Participation Hub</h2>
              <p className="font-body-lg text-body-lg">Special projects you can join today!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-4">
            <div className="bg-surface-white p-6 rounded-2xl border-2 border-brand-purple flex items-start gap-4 hover:border-brand-teal transition-colors group">
              <div className="bg-brand-pink/10 p-3 rounded-xl text-brand-pink">
                <Icon name="volunteer_activism" fill />
              </div>
              <div>
                <h4 className="font-headline-md text-[24px] mb-2 group-hover:text-brand-pink transition-colors">Volunteer Voices</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Help us make the portal better by sharing your feedback in a quick 5-minute chat.
                </p>
                <Link href="/support" className="mt-4 text-brand-purple font-label-bold text-label-bold flex items-center gap-2">
                  Start Here <Icon name="chevron_right" />
                </Link>
              </div>
            </div>
            <div className="bg-surface-white p-6 rounded-2xl border-2 border-brand-purple flex items-start gap-4 hover:border-brand-teal transition-colors group">
              <div className="bg-brand-teal/10 p-3 rounded-xl text-brand-teal">
                <Icon name="emoji_events" fill />
              </div>
              <div>
                <h4 className="font-headline-md text-[24px] mb-2 group-hover:text-brand-pink transition-colors">Skill Swap</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Do you have a talent to share? Teach others and learn something new from your friends.
                </p>
                <Link href="/events" className="mt-4 text-brand-purple font-label-bold text-label-bold flex items-center gap-2">
                  Learn More <Icon name="chevron_right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
