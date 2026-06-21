import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-stack-md px-margin-side flex flex-col items-center text-center gap-stack-sm bg-primary border-t-8 border-brand-pink text-on-primary md:pl-[calc(16rem+2.5rem)]">
      <span className="font-headline-md text-headline-md font-black text-on-primary">
        PossAbilities Portal
      </span>
      <div className="flex flex-wrap justify-center gap-8 mt-2">
        <a className="text-on-primary opacity-90 font-label-bold text-label-bold hover:text-brand-pink transition-colors" href="mailto:Digital@PossAbilities.org.uk">
          Contact Us
        </a>
        <Link className="text-on-primary opacity-90 font-label-bold text-label-bold hover:text-brand-pink transition-colors" href="/privacy">
          Privacy Policy
        </Link>
        <Link className="text-on-primary opacity-90 font-label-bold text-label-bold hover:text-brand-pink transition-colors" href="/complaints">
          Complaints
        </Link>
      </div>
      <p className="font-body-md text-body-md opacity-90">
        © {new Date().getFullYear()} PossAbilities Portal. Live The Life You Choose.
      </p>
    </footer>
  );
}
