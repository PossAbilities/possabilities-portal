import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Privacy Policy — PossAbilities Portal" };

const sections = [
  {
    icon: "lock",
    heading: "Your information belongs to you",
    body: "We only keep the information we need to support you and run the portal. We never sell it or share it with other people without asking you first.",
  },
  {
    icon: "shield",
    heading: "We keep it safe",
    body: "Your information is stored securely. Only the people who need it to help you can see it.",
  },
  {
    icon: "visibility",
    heading: "You can see what we hold",
    body: "You can ask us at any time to see the information we keep about you, or to change or delete it.",
  },
  {
    icon: "cookie",
    heading: "How the website works",
    body: "We use a small amount of data to keep you signed in and to make the portal work. We do not use it to track you across other websites.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-[900px] mx-auto px-margin-side">
      <section className="mb-stack-md">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Privacy Policy
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          Easy-read information about how we look after your personal information.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {sections.map((s) => (
          <div key={s.heading} className="bg-surface-white border-2 border-brand-purple rounded-2xl p-6 flex items-start gap-4">
            <div className="bg-brand-teal/15 text-brand-teal rounded-xl p-3 shrink-0">
              <Icon name={s.icon} fill size={28} />
            </div>
            <div>
              <h2 className="font-headline-md text-[22px] text-brand-purple mb-2">{s.heading}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-[1.7]">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-stack-md bg-surface-container-low border-2 border-dashed border-brand-purple rounded-2xl p-stack-md flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h2 className="font-headline-md text-[22px] text-brand-purple mb-1">Have a question about your information?</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">We are happy to help — just get in touch.</p>
        </div>
        <a href="mailto:Digital@PossAbilities.org.uk" className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary shrink-0">
          <Icon name="mail" /> Contact us
        </a>
      </div>

      <div className="mt-stack-md">
        <Link href="/support" className="inline-flex items-center gap-2 text-brand-pink font-label-bold text-label-bold hover:underline min-h-touch-target-min">
          <Icon name="menu_book" /> See our Easy-Read policies
        </Link>
      </div>
    </div>
  );
}
