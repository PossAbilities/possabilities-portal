import { Icon } from "@/components/Icon";

type Tone = "purple" | "teal" | "pink";

const TONES: Record<Tone, string> = {
  purple: "bg-brand-purple text-on-primary",
  teal: "bg-brand-teal text-on-tertiary-fixed",
  pink: "bg-brand-pink text-on-primary",
};

/** Bold, decorated page banner — gives every inner page a lively, consistent
 *  header instead of plain text on white. */
export function PageHeader({
  title,
  subtitle,
  icon,
  tone = "purple",
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  tone?: Tone;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[32px] px-6 md:px-stack-md py-stack-md mb-stack-lg shadow-offset-dark ${TONES[tone]}`}
    >
      {/* decorative shapes + dotted texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="dot-grid absolute inset-0 opacity-[0.12]" />
        <span className="floaty absolute -top-8 right-[8%] w-28 h-28 rounded-full bg-white/15" />
        <span className="floaty-slow absolute -bottom-10 right-[26%] w-24 h-24 rounded-3xl rotate-12 bg-white/15" />
        <span className="floaty absolute top-1/2 -translate-y-1/2 right-8 w-16 h-16 rounded-full bg-white/15" />
      </div>

      <div className="relative flex items-center gap-5">
        {icon && (
          <span className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/25 items-center justify-center shrink-0">
            <Icon name={icon} fill size={36} />
          </span>
        )}
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="font-statement-text text-statement-text opacity-90 mt-2 max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
