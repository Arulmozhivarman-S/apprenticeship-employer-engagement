import { Plus } from 'lucide-react';
import { FAQS } from '../data/content.js';
import SectionHeader from './SectionHeader.jsx';

/** Native <details> gives keyboard and screen-reader support for free. */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader id="faq-title" title="Frequently asked questions">
          <p>
            These answers are general. Program policies and requirements should always be confirmed with the program
            team.
          </p>
        </SectionHeader>
        <div className="mx-auto max-w-3xl md:ml-auto md:mr-0">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold tracking-tight hover:text-accent">
                {q}
                <Plus
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-prose pb-7 pr-10 leading-relaxed text-ink-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
