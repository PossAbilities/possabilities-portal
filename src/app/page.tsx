import Link from "next/link";
import { getNews } from "@/lib/data";
import { FEATURE_VIDEO, GALLERY } from "@/lib/media";
import { Icon } from "@/components/Icon";
import { NewsThumb } from "@/components/NewsThumb";

const STATS = [
  { icon: "groups", label: "A friendly, welcoming community", chip: "bg-brand-teal text-on-tertiary-fixed" },
  { icon: "event_available", label: "New events every week", chip: "bg-brand-pink text-on-primary" },
  { icon: "menu_book", label: "Free Easy Reads to enjoy", chip: "bg-brand-purple text-on-primary" },
  { icon: "support_agent", label: "Help whenever you need it", chip: "bg-brand-teal text-on-tertiary-fixed" },
];

export default async function HomePage() {
  const news = await getNews();

  return (
    <>
      {/* Hero */}
      <section className="relative w-full min-h-[66vh] flex items-center justify-center bg-primary px-margin-side pt-stack-lg pb-32 overflow-hidden">
        {/* decorative floating shapes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="floaty absolute top-12 left-[8%] w-24 h-24 rounded-full bg-brand-teal/30" />
          <span className="floaty-slow absolute top-20 right-[12%] w-32 h-32 rounded-full bg-brand-pink/30" />
          <span className="floaty absolute bottom-36 left-[18%] w-16 h-16 rounded-2xl rotate-12 bg-brand-teal/20" />
          <span className="floaty-slow absolute bottom-44 right-[22%] w-20 h-20 rounded-full bg-primary-fixed/20" />
        </div>

        <div className="relative z-10 text-center max-w-4xl flex flex-col items-center gap-stack-sm">
          <span className="bg-brand-pink text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold inline-flex items-center gap-2 shadow-offset-dark">
            <Icon name="celebration" fill /> Welcome to your Portal
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary">
            Live The Life You Choose
          </h1>
          <p className="font-statement-text text-statement-text text-white opacity-90 leading-relaxed max-w-2xl">
            Your community, built for you. Find news, events, and support — all in one happy,
            accessible place.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="lift min-h-[56px] flex items-center gap-2 px-10 bg-brand-teal text-on-tertiary-fixed font-label-bold text-label-bold rounded-2xl shadow-offset-dark"
            >
              <Icon name="explore" fill /> Explore Now
            </Link>
            <Link
              href="/support"
              className="min-h-[56px] flex items-center gap-2 px-10 bg-white/10 border-2 border-white text-white font-label-bold text-label-bold rounded-2xl hover:bg-white/20 transition-colors"
            >
              <Icon name="favorite" fill /> Get Help
            </Link>
          </div>
        </div>

        {/* wave divider into the next section */}
        <svg
          aria-hidden
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-[56px] md:h-[90px]"
        >
          <path
            fill="var(--color-surface-bright)"
            d="M0,64 C240,118 480,8 720,40 C960,72 1200,118 1440,72 L1440,120 L0,120 Z"
          />
        </svg>
      </section>

      {/* Stats / welcome band */}
      <section className="px-margin-side pt-stack-md bg-surface-bright">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-surface-white border-2 border-brand-purple rounded-2xl p-stack-sm flex flex-col items-center text-center gap-3 shadow-offset-purple"
            >
              <span className={`w-14 h-14 rounded-full flex items-center justify-center ${s.chip}`}>
                <Icon name={s.icon} fill size={28} />
              </span>
              <span className="font-label-bold text-label-bold text-on-surface leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-margin-side py-stack-lg bg-surface-bright">
        <h2 className="font-headline-md text-headline-md text-brand-purple text-center mb-stack-md">
          What would you like to do?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <Link
            href="/events"
            className="lift relative overflow-hidden flex flex-col items-center justify-center gap-4 p-10 bg-brand-purple text-on-primary rounded-3xl shadow-offset-pink"
          >
            <span aria-hidden className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
            <span className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center">
              <Icon name="event" size={44} />
            </span>
            <span className="font-headline-md text-headline-md">Join an Event</span>
          </Link>
          <Link
            href="/news"
            className="lift relative overflow-hidden flex flex-col items-center justify-center gap-4 p-10 bg-brand-teal text-on-tertiary-fixed rounded-3xl shadow-offset-purple"
          >
            <span aria-hidden className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/20" />
            <span className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
              <Icon name="newspaper" size={44} />
            </span>
            <span className="font-headline-md text-headline-md">Read the News</span>
          </Link>
          <Link
            href="/support"
            className="lift relative overflow-hidden flex flex-col items-center justify-center gap-4 p-10 bg-brand-pink text-on-primary rounded-3xl shadow-offset-purple"
          >
            <span aria-hidden className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
            <span className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center">
              <Icon name="support_agent" size={44} />
            </span>
            <span className="font-headline-md text-headline-md">Get Help</span>
          </Link>
        </div>
      </section>

      {/* Latest updates */}
      <section className="px-margin-side py-stack-lg bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-md gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md text-brand-purple">Latest Updates</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Stay in the loop with our happy community news.
            </p>
          </div>
          <Link
            href="/news"
            className="min-h-touch-target-min font-label-bold text-label-bold text-brand-pink flex items-center gap-2 hover:underline"
          >
            View all news <Icon name="arrow_forward" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {news.slice(0, 3).map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.id}`}
              className="lift bg-surface-white border-2 border-brand-purple rounded-2xl overflow-hidden group flex flex-col shadow-offset-purple"
            >
              <NewsThumb post={n} />
              <div className="p-stack-sm flex flex-col gap-3 flex-1">
                <span className="self-start bg-brand-pink text-on-primary px-3 py-1 rounded-full font-label-bold text-caption uppercase">
                  {n.category}
                </span>
                <h3 className="font-headline-md text-[24px] leading-tight">{n.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 flex-1">{n.excerpt}</p>
                <span className="mt-1 text-brand-purple font-label-bold text-label-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read the full story <Icon name="arrow_forward" size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Multimedia hub */}
      <section className="px-margin-side py-stack-lg bg-primary-container text-on-primary relative overflow-hidden">
        <span aria-hidden className="floaty-slow pointer-events-none absolute -top-10 right-[6%] w-36 h-36 rounded-full bg-brand-teal/15" />
        <h2 className="font-headline-md text-headline-md text-white mb-stack-md flex items-center gap-4 relative">
          <span className="w-12 h-12 rounded-full bg-brand-teal text-on-tertiary-fixed flex items-center justify-center">
            <Icon name="play_circle" fill size={28} />
          </span>
          Multimedia Hub
        </h2>
        <div className="flex flex-col lg:flex-row gap-gutter relative">
          <div className="flex-[2] flex flex-col gap-stack-sm">
            <Link href="/media#videos" className="lift relative flex-1 min-h-[280px] bg-primary rounded-3xl overflow-hidden border-4 border-brand-teal group block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity absolute inset-0" alt="Community showcase" src={FEATURE_VIDEO} loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-24 h-24 bg-brand-teal rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-lg">
                  <Icon name="play_arrow" fill size={64} />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-stack-sm bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-headline-md text-[24px] text-white">Community Highlights: 2024 Showcase</h3>
              </div>
            </Link>
            <Link
              href="/media#videos"
              className="min-h-touch-target-min flex items-center justify-center gap-2 bg-brand-teal text-on-tertiary-fixed font-label-bold text-label-bold rounded-xl hover:brightness-110 transition-all"
            >
              See more videos <Icon name="arrow_forward" />
            </Link>
          </div>
          <div className="flex-1 flex flex-col gap-stack-sm">
            <div className="bg-white/10 p-stack-sm rounded-2xl border-2 border-white/20">
              <h3 className="font-label-bold text-label-bold mb-4 flex items-center gap-2 text-white">
                <Icon name="image" fill /> Photo Galleries
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {GALLERY.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/10 border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover" alt="Community gallery" src={src} loading="lazy" />
                  </div>
                ))}
                <div className="aspect-square relative rounded-xl overflow-hidden bg-brand-pink border border-white/20 flex items-center justify-center text-white">
                  <span className="font-headline-md text-headline-md">+12</span>
                </div>
              </div>
            </div>
            <Link
              href="/media#photos"
              className="min-h-touch-target-min flex items-center justify-center gap-2 bg-brand-pink text-on-primary font-label-bold text-label-bold rounded-xl hover:brightness-110 transition-all"
            >
              See more photos <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>
      </section>

      {/* Participation hub */}
      <section className="px-margin-side py-stack-lg bg-surface-bright">
        <div className="flex items-center gap-4 mb-stack-md">
          <span className="w-16 h-16 bg-brand-teal rounded-2xl flex items-center justify-center text-on-tertiary-fixed shadow-offset-purple">
            <Icon name="hub" fill size={32} />
          </span>
          <div>
            <h2 className="font-headline-md text-headline-md text-brand-purple">Get Involved</h2>
            <p className="font-body-lg text-body-lg text-on-surface">Special projects you can join today!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="lift bg-surface-white p-stack-sm rounded-2xl border-2 border-brand-purple flex items-start gap-4 shadow-offset-pink group">
            <span className="bg-brand-pink text-on-primary p-3 rounded-xl shrink-0">
              <Icon name="volunteer_activism" fill size={28} />
            </span>
            <div>
              <h3 className="font-headline-md text-[24px] mb-2">Volunteer Voices</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Help us make the portal better by sharing your feedback in a quick 5-minute chat.
              </p>
              <Link href="/support" className="mt-4 min-h-touch-target-min text-brand-purple font-label-bold text-label-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Start here <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
          <div className="lift bg-surface-white p-stack-sm rounded-2xl border-2 border-brand-purple flex items-start gap-4 shadow-offset-teal group">
            <span className="bg-brand-teal text-on-tertiary-fixed p-3 rounded-xl shrink-0">
              <Icon name="emoji_events" fill size={28} />
            </span>
            <div>
              <h3 className="font-headline-md text-[24px] mb-2">Skill Swap</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Do you have a talent to share? Teach others and learn something new from your friends.
              </p>
              <Link href="/events" className="mt-4 min-h-touch-target-min text-brand-purple font-label-bold text-label-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn more <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-margin-side pb-stack-lg bg-surface-bright">
        <div className="relative overflow-hidden bg-brand-purple text-on-primary rounded-[40px] p-stack-lg text-center flex flex-col items-center gap-stack-sm">
          <span aria-hidden className="floaty pointer-events-none absolute -top-8 -left-6 w-28 h-28 rounded-full bg-brand-teal/25" />
          <span aria-hidden className="floaty-slow pointer-events-none absolute -bottom-10 -right-6 w-36 h-36 rounded-full bg-brand-pink/25" />
          <h2 className="font-headline-md text-headline-md text-white relative">Come and say hello</h2>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl relative">
            There is always something happening. Find your next event and join the fun.
          </p>
          <Link
            href="/events"
            className="lift relative min-h-[56px] flex items-center gap-2 px-10 bg-brand-teal text-on-tertiary-fixed font-label-bold text-label-bold rounded-2xl shadow-offset-dark"
          >
            <Icon name="event" fill /> See what&apos;s on
          </Link>
        </div>
      </section>
    </>
  );
}
