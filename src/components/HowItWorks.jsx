import { STEPS } from '../data/content.js';
import SectionHeader from './SectionHeader.jsx';

export default function HowItWorks() {
  return (
    <section id="program" aria-labelledby="program-title" className="border-y border-line bg-paper-deep py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader id="program-title" title="How a partnership could take shape">
          <p>
            This is a proposed, illustrative process. Actual steps, timelines, and requirements are confirmed with the
            program team.
          </p>
        </SectionHeader>

        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connector line between step markers on desktop */}
          <span aria-hidden="true" className="absolute left-5 right-[calc(33%-1.25rem)] top-5 hidden h-px bg-navy-900/20 md:block" />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 md:block">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-[0.95rem] font-semibold text-white tabular ring-8 ring-paper-deep">
                {i + 1}
              </span>
              <div className="md:mt-6">
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2.5 max-w-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
