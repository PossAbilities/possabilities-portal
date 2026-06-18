import { getContent, getEvents, getNews, getRequests } from "@/lib/data";
import { getEasyReads, isEasyReadsConfigured } from "@/lib/easyreads";
import { Icon } from "@/components/Icon";
import { AdminInbox } from "@/components/admin/AdminInbox";
import { ContentLibrary } from "@/components/admin/ContentLibrary";

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export default async function AdminDashboardPage() {
  const [news, events, requests, easyReads] = await Promise.all([
    getNews(),
    getEvents(),
    getRequests(),
    getEasyReads(),
  ]);
  const content = getContent();
  const easyReadsConfigured = isEasyReadsConfigured();

  const pendingCount = requests.filter((r) => r.status !== "Resolved").length;
  const alertCount = requests.filter((r) => r.kind === "CONCERN").length;

  return (
    <div className="px-margin-side">
      {/* Welcome */}
      <section className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-stack-sm">
          Good morning, Admin
        </h1>
        <p className="font-statement-text text-statement-text text-on-surface-variant max-w-2xl">
          Here is what&apos;s happening in the Community Portal today. You have{" "}
          <span className="text-brand-pink font-bold underline">{pendingCount} pending requests</span> that
          need your attention.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <div className="bg-surface-white p-6 rounded-xl border-2 border-outline-variant hover:border-brand-purple transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <Icon name="feed" size={36} className="text-brand-purple group-hover:scale-110 transition-transform" />
            <span className="bg-brand-teal/10 text-brand-teal font-label-bold px-3 py-1 rounded-full text-caption">News</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-md text-headline-md block">{news.length}</span>
            <span className="font-label-bold text-label-bold text-on-surface-variant">News Posts</span>
          </div>
        </div>
        <div className="bg-surface-white p-6 rounded-xl border-2 border-outline-variant hover:border-brand-purple transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <Icon name="event" size={36} className="text-brand-purple group-hover:scale-110 transition-transform" />
            <span className="bg-brand-pink/10 text-brand-pink font-label-bold px-3 py-1 rounded-full text-caption">Live</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-md text-headline-md block">{events.length}</span>
            <span className="font-label-bold text-label-bold text-on-surface-variant">Live Events</span>
          </div>
        </div>
        <div className="bg-surface-white p-6 rounded-xl border-2 border-outline-variant hover:border-brand-purple transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <Icon name="pending_actions" size={36} className="text-brand-purple group-hover:scale-110 transition-transform" />
            <span className="bg-brand-purple/10 text-brand-purple font-label-bold px-3 py-1 rounded-full text-caption">Priority</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-md text-headline-md block">{pendingCount}</span>
            <span className="font-label-bold text-label-bold text-on-surface-variant">Requests</span>
          </div>
        </div>
        <div className="bg-brand-purple p-6 rounded-xl border-2 border-brand-teal flex flex-col justify-between group text-surface-white">
          <div className="flex justify-between items-start">
            <Icon name="security" fill size={36} className="text-brand-teal group-hover:rotate-12 transition-transform" />
            <span className="bg-surface-white/20 text-surface-white font-label-bold px-3 py-1 rounded-full text-caption">Encrypted</span>
          </div>
          <div className="mt-4">
            <span className="font-headline-md text-headline-md block">{pad2(alertCount)}</span>
            <span className="font-label-bold text-label-bold opacity-90">Security Alerts</span>
          </div>
        </div>
      </div>

      {/* Inbox + Safeguarding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <div className="lg:col-span-2 flex flex-col gap-stack-sm">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-headline-md text-headline-md text-brand-purple">Request Inbox</h3>
          </div>
          <AdminInbox requests={requests} />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest border-4 border-brand-pink p-gutter rounded-xl h-full shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform">
              <Icon name="lock" size={140} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-stack-sm">
                <Icon name="gavel" size={36} className="text-brand-pink" />
                <h3 className="font-headline-md text-label-bold text-brand-pink">Safe Guarding</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface mb-stack-md">
                Private and sensitive Whistleblowing Reports. These require authorized clearance to view.
              </p>
              <div className="space-y-4">
                <div className="bg-surface-white border-2 border-outline-variant p-4 rounded-lg flex items-center gap-4 hover:border-brand-pink cursor-pointer transition-colors">
                  <Icon name="priority_high" className="text-brand-pink" />
                  <div>
                    <p className="font-label-bold text-label-bold">Report #1042</p>
                    <p className="text-caption text-on-surface-variant">Received: 2 hours ago</p>
                  </div>
                </div>
                <div className="bg-surface-white border-2 border-outline-variant p-4 rounded-lg flex items-center gap-4 opacity-60">
                  <Icon name="check_circle" className="text-on-surface-variant" />
                  <div>
                    <p className="font-label-bold text-label-bold">Report #1039</p>
                    <p className="text-caption text-on-surface-variant">Resolved: Yesterday</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full bg-brand-pink text-surface-white font-label-bold text-label-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md">
                <Icon name="key" />
                Authorize Access
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Easy Reads (read-only — managed on the external platform) */}
      <section className="mt-stack-lg">
        <div className="flex items-end justify-between gap-gutter mb-6">
          <div>
            <h3 className="font-headline-md text-headline-md text-brand-purple flex items-center gap-3">
              <Icon name="menu_book" className="text-brand-teal" />
              Easy Reads
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Easy-read guides synced from your Easy Reads platform.
            </p>
          </div>
          <span className="bg-brand-purple text-on-primary font-headline-md text-[24px] px-5 py-2 rounded-xl">
            {easyReads.length}
          </span>
        </div>
        <div className="bg-surface-white rounded-xl border-2 border-outline-variant overflow-hidden">
          {easyReads.length > 0 ? (
            <ul className="divide-y-2 divide-outline-variant">
              {easyReads.map((er) => (
                <li key={er.id} className="flex items-center gap-4 p-4">
                  <span className="w-10 h-10 rounded-lg bg-brand-teal/15 text-brand-teal flex items-center justify-center flex-shrink-0">
                    <Icon name="picture_as_pdf" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-bold text-label-bold truncate">{er.title}</p>
                    <p className="text-caption text-on-surface-variant truncate">{er.description}</p>
                  </div>
                  {er.pdfUrl && (
                    <a
                      href={er.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface-container-high p-2 rounded-lg hover:bg-brand-teal hover:text-on-tertiary-fixed transition-all flex flex-shrink-0"
                      aria-label={`Open ${er.title}`}
                    >
                      <Icon name="open_in_new" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <Icon name="cloud_off" size={40} className="text-outline" />
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                {easyReadsConfigured
                  ? "No easy reads returned from the API yet."
                  : "Easy Reads API not connected — add EASY_READS_API_URL to show guides here."}
              </p>
            </div>
          )}
        </div>
      </section>

      <ContentLibrary items={content} />
    </div>
  );
}
