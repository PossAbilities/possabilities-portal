import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Complaints — PossAbilities Community Portal" };

const steps = [
  { icon: "chat", heading: "1. Tell us", body: "Tell any member of staff, or use the report button on the Support page. You can ask a friend or family member to help you." },
  { icon: "search", heading: "2. We look into it", body: "We will listen carefully, find out what happened, and keep you updated along the way." },
  { icon: "done_all", heading: "3. We put it right", body: "We will tell you what we are going to do to fix things and make the portal better." },
];

export default function ComplaintsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-margin-side">
      <section className="mb-stack-md">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Making a Complaint
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          If you are not happy with something, you can tell us. You will never be in trouble for
          making a complaint.
        </p>
      </section>

      <div className="space-y-gutter">
        {steps.map((s) => (
          <div key={s.heading} className="bg-surface-white border-2 border-brand-purple rounded-2xl p-6 flex items-start gap-4">
            <div className="bg-brand-pink/10 text-brand-pink rounded-xl p-3 shrink-0">
              <Icon name={s.icon} fill size={28} />
            </div>
            <div>
              <h2 className="font-headline-md text-[22px] text-brand-purple mb-1">{s.heading}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-[1.7]">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-stack-md flex flex-col sm:flex-row gap-4">
        <Link href="/support" className="btn min-h-touch-target-min px-8 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary">
          <Icon name="report" /> Report something on the Support page
        </Link>
        <a href="mailto:Digital@PossAbilities.org.uk" className="btn min-h-touch-target-min px-8 bg-white border-2 border-brand-purple text-brand-purple rounded-xl font-label-bold text-label-bold hover:bg-brand-purple hover:text-white">
          <Icon name="mail" /> Email us
        </a>
      </div>
    </div>
  );
}
