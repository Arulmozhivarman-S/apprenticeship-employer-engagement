import { Info } from 'lucide-react';

export default function PrototypeBanner() {
  return (
    <div className="bg-navy-950 text-[0.8rem] text-white/75">
      <p className="container-page flex items-start gap-2 py-2 sm:items-center">
        <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-light sm:mt-0" />
        <span>
          Independent interview prototype. Illustrative content only; not an official Northeastern University website.
        </span>
      </p>
    </div>
  );
}
