import { useRef } from 'react';
import { GraduationCap, TrendingUp, Users } from 'lucide-react';
import { BENEFITS } from '../data/content.js';
import { EVENTS } from '../analytics/analytics.js';
import { useTrackOnView } from '../analytics/hooks.js';
import SectionHeader from './SectionHeader.jsx';

const ICONS = { users: Users, learning: GraduationCap, investment: TrendingUp };

export default function Benefits() {
  const ref = useRef(null);
  useTrackOnView(ref, EVENTS.EMPLOYER_BENEFITS_VIEW);

  return (
    <section id="benefits" ref={ref} aria-labelledby="benefits-title" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader id="benefits-title" title="What employers can explore">
          <p>
            A degree-connected apprenticeship is a way to get to know future talent through real work, while students
            connect what they study with what organizations need.
          </p>
        </SectionHeader>

        <ul className="grid md:grid-cols-3">
          {BENEFITS.map(({ icon, title, body }, i) => {
            const Icon = ICONS[icon];
            return (
              <li
                key={title}
                className={`border-line py-8 md:px-8 md:py-10 ${i > 0 ? 'border-t md:border-l md:border-t-0' : 'md:pl-0'} ${
                  i === BENEFITS.length - 1 ? 'md:pr-0' : ''
                }`}
              >
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
