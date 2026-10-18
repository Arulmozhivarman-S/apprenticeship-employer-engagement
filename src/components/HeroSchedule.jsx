/**
 * Hero illustration: an *illustrative* term showing how coursework,
 * on-the-job work, and mentoring could interleave, and how applied
 * skills build over time. Pure HTML/CSS, so it scales and loads reliably.
 */
const WEEKS = 12;

// Intensity per week: 0 = none, 1 = light, 2 = heavy. Illustrative only.
const ROWS = [
  { id: 'coursework', label: 'Coursework', who: 'Student', levels: [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0], tone: 'blue' },
  { id: 'onthejob', label: 'On-the-job work', who: 'Employer', levels: [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2], tone: 'white' },
  { id: 'mentoring', label: 'Mentoring', who: 'Program team', levels: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1], tone: 'dot' },
];

const TONES = {
  blue: ['bg-white/[0.06]', 'bg-accent-light/45', 'bg-accent-light'],
  white: ['bg-white/[0.06]', 'bg-white/45', 'bg-paper'],
};

const delay = (col, row) => ({ animationDelay: `${200 + col * 45 + row * 40}ms` });

function Cell({ level, tone, col, row }) {
  if (tone === 'dot') {
    return (
      <div className="flex h-6 items-center justify-center">
        <span
          style={delay(col, row)}
          className={`block h-2 w-2 rounded-full motion-safe:animate-cell-in ${level ? 'bg-accent-light' : 'bg-white/[0.12]'}`}
        />
      </div>
    );
  }
  return <div style={delay(col, row)} className={`h-6 rounded-[3px] motion-safe:animate-cell-in ${TONES[tone][level]}`} />;
}

export default function HeroSchedule() {
  return (
    <figure className="rounded-xl border border-white/10 bg-navy-800/70 p-5 sm:p-6">
      <div aria-hidden="true">
        {/* Who is involved */}
        <div className="mb-6 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center text-[0.78rem] leading-tight text-white/85 sm:text-sm">
          <span className="rounded-md border border-white/15 px-2 py-2">Your organization</span>
          <span className="h-px w-4 bg-white/30 sm:w-8" />
          <span className="rounded-md bg-paper px-2 py-2 font-semibold text-navy-900">Student apprentice</span>
          <span className="h-px w-4 bg-white/30 sm:w-8" />
          <span className="rounded-md border border-white/15 px-2 py-2">Program team</span>
        </div>

        {/* Illustrative term */}
        <div className="space-y-2.5">
          {ROWS.map((row, r) => (
            <div key={row.id} className="grid grid-cols-[5.75rem_1fr] items-center gap-3 sm:grid-cols-[7.5rem_1fr]">
              <div className="text-[0.78rem] leading-tight sm:text-sm">
                <span className="block text-white">{row.label}</span>
                <span className="block text-white/50">{row.who}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {row.levels.map((level, c) => (
                  <Cell key={c} level={level} tone={row.tone} col={c} row={r} />
                ))}
              </div>
            </div>
          ))}

          {/* Skills applied: rises across the term */}
          <div className="grid grid-cols-[5.75rem_1fr] items-end gap-3 pt-2 sm:grid-cols-[7.5rem_1fr]">
            <div className="text-[0.78rem] leading-tight sm:text-sm">
              <span className="block text-white">Skills applied</span>
              <span className="block text-white/50">Workforce</span>
            </div>
            <div className="grid h-12 grid-cols-12 items-end gap-1 border-b border-white/15">
              {Array.from({ length: WEEKS }, (_, c) => (
                <div
                  key={c}
                  style={{ ...delay(c, 3), height: `${18 + (c / (WEEKS - 1)) * 82}%`, transformOrigin: 'bottom' }}
                  className="rounded-t-[2px] bg-gradient-to-t from-accent/60 to-accent-light motion-safe:animate-cell-in"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[5.75rem_1fr] gap-3 text-[0.72rem] text-white/45 sm:grid-cols-[7.5rem_1fr]">
            <span />
            <div className="flex justify-between">
              <span>Week 1</span>
              <span>Week 12</span>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mt-5 border-t border-white/10 pt-4 text-[0.82rem] leading-relaxed text-white/65">
        An illustrative term: how coursework, on-the-job work, and mentoring might share time as skills build. Real
        schedules are agreed with the program team.
      </figcaption>
    </figure>
  );
}
