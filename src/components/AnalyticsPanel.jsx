import { useEffect, useState } from 'react';
import { Activity, Trash2, X } from 'lucide-react';
import { clearEvents, summarizeEvents } from '../analytics/analytics.js';
import { useAnalyticsEvents } from '../analytics/hooks.js';

const STORAGE_KEY = 'demo-analytics-panel-open'; // UI preference only, never event data

function readOpenPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });

/** Developer-only overlay. Rendered only when isAnalyticsPanelEnabled() is true. */
export default function AnalyticsPanel() {
  const [open, setOpen] = useState(readOpenPreference);
  const events = useAnalyticsEvents();
  const stats = summarizeEvents(events);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(open));
    } catch {
      /* storage unavailable: preference simply isn't remembered */
    }
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          id="analytics-panel"
          aria-label="Demo analytics, simulated data"
          className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-amber-500/60 bg-white text-ink shadow-[0_12px_40px_rgba(8,22,43,0.25)] motion-safe:animate-panel-in"
        >
          <header className="flex items-center justify-between gap-2 bg-amber-100 px-4 py-2.5">
            <h2 className="text-[0.78rem] font-bold tracking-wide text-amber-950">DEMO ANALYTICS — SIMULATED DATA</h2>
            <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-amber-950 hover:bg-amber-200">
              <X aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">Close analytics panel</span>
            </button>
          </header>

          <dl className="grid grid-cols-2 border-b border-line">
            {[
              ['Total events', stats.total],
              ['Calculator interactions', stats.calculatorInteractions],
              ['CTA clicks', stats.ctaClicks],
              ['Demo form submissions', stats.demoSubmissions],
            ].map(([label, value], i) => (
              <div key={label} className={`px-4 py-3 ${i % 2 ? 'border-l border-line' : ''} ${i > 1 ? 'border-t border-line' : ''}`}>
                <dt className="text-[0.72rem] text-ink-muted">{label}</dt>
                <dd className="text-xl font-semibold tabular">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center justify-between px-4 pt-3">
            <h3 className="text-[0.8rem] font-semibold">Recent events</h3>
            <button
              type="button"
              onClick={clearEvents}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.75rem] text-ink-muted hover:bg-paper-deep hover:text-ink"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          {events.length === 0 ? (
            <p className="px-4 pb-4 pt-2 text-[0.8rem] text-ink-muted">No events yet. Interact with the page to record some.</p>
          ) : (
            <ol className="max-h-56 overflow-y-auto px-4 pb-3 pt-1 text-[0.78rem]" aria-live="polite">
              {events.slice(0, 25).map((e) => (
                <li key={e.id} className="flex justify-between gap-3 border-b border-line/70 py-1.5 last:border-0">
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-ink">{e.name}</span>
                    {Object.keys(e.props).length > 0 && (
                      <span className="block truncate text-[0.7rem] text-ink-muted">
                        {Object.entries(e.props).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </span>
                    )}
                  </span>
                  <time dateTime={e.timestamp} className="shrink-0 text-ink-muted tabular">
                    {timeFmt.format(new Date(e.timestamp))}
                  </time>
                </li>
              ))}
            </ol>
          )}
          <p className="border-t border-line bg-paper px-4 py-2 text-[0.7rem] leading-snug text-ink-muted">
            Stored in memory and logged to the console only. No analytics service is connected.
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="analytics-panel"
        className="inline-flex items-center gap-2 rounded-full border border-amber-500/70 bg-amber-100 px-3.5 py-2 text-[0.8rem] font-semibold text-amber-950 shadow-md hover:bg-amber-200"
      >
        <Activity aria-hidden="true" className="h-4 w-4" />
        Analytics demo
        <span className="rounded-full bg-amber-950 px-1.5 text-[0.7rem] text-amber-50 tabular">{events.length}</span>
      </button>
    </div>
  );
}
