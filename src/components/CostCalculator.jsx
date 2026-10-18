import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { CALCULATOR_FIELDS, buildEstimateSummary } from '../utils/calculator.js';
import { formatCurrency } from '../utils/format.js';
import { EVENTS, track } from '../analytics/analytics.js';
import NumberField from './NumberField.jsx';
import CostBreakdown from './CostBreakdown.jsx';
import Button from './Button.jsx';

const GROUPS = [
  { id: 'schedule', legend: 'Apprentices and schedule' },
  { id: 'support', legend: 'Training and supervision' },
];

export const DISCLAIMER =
  'Illustrative planning estimate only. Actual costs depend on employer policies, program requirements, and other expenses. Wage costs are not necessarily incremental costs, and this estimate does not represent a guaranteed return on investment.';

export default function CostCalculator({ calculator }) {
  const { rawValues, values, errors, isValid, results, setField, reset } = calculator;
  const [copyStatus, setCopyStatus] = useState('idle'); // idle | copied | failed

  // "Completed" = the employer took the estimate away with them.
  const handleCopy = async () => {
    if (!results) return;
    track(EVENTS.CALCULATOR_COMPLETED, { location: 'calculator' });
    try {
      await navigator.clipboard.writeText(buildEstimateSummary(values, results));
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    window.setTimeout(() => setCopyStatus('idle'), 3500);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-5 border-b border-line pb-8 md:grid-cols-12 md:gap-8">
          <h2 id="calculator-title" className="section-title md:col-span-6">
            Estimate the cost of hosting apprentices
          </h2>
          <p className="text-lg leading-relaxed text-ink-muted md:col-span-6 md:pt-1">
            Every figure below is an illustrative, editable assumption. Change any value and the estimate updates
            immediately.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Inputs */}
          <form className="lg:col-span-7" onSubmit={(e) => e.preventDefault()} noValidate aria-describedby="calc-assumptions">
            {/* Small screens: keep the running total visible while editing (results panel sits below). */}
            <div
              aria-hidden="true"
              className="sticky top-[4.5rem] z-20 -mx-5 mb-6 flex items-center justify-between border-b border-navy-700 bg-navy-900 px-5 py-3 text-white sm:-mx-8 sm:px-8 lg:hidden"
            >
              <span className="text-sm text-white/70">Estimated total</span>
              <span className="text-lg font-semibold tabular">{isValid ? formatCurrency(results.totalCost) : 'Paused'}</span>
            </div>
            <p id="calc-assumptions" className="mb-8 rounded-md border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink-muted">
              Demo defaults: 5 apprentices at $22 an hour for 20 hours a week over 24 weeks, with $1,500 of training each
              and 2 hours of weekly supervision at $55 an hour. Replace them with your own numbers.
            </p>
            {GROUPS.map((group) => (
              <fieldset key={group.id} className="mb-10 last:mb-6">
                <legend className="mb-5 text-lg font-semibold tracking-tight">{group.legend}</legend>
                <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                  {CALCULATOR_FIELDS.filter((f) => f.group === group.id).map((field) => (
                    <NumberField
                      key={field.id}
                      field={field}
                      value={rawValues[field.id]}
                      error={errors[field.id]}
                      onChange={setField}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover hover:underline"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reset to demo defaults
            </button>
          </form>

          {/* Results */}
          <aside aria-labelledby="results-title" className="lg:col-span-5">
            <div className="on-navy rounded-xl bg-navy-900 p-6 text-white sm:p-8 lg:sticky lg:top-24">
              <h3 id="results-title" className="text-[0.95rem] font-medium text-white/70">
                Estimated total program cost
              </h3>

              {isValid ? (
                <>
                  <div aria-live="polite" aria-atomic="true">
                    <p className="mt-2 text-[2.6rem] font-bold leading-none tracking-tight tabular sm:text-5xl">
                      {formatCurrency(results.totalCost)}
                    </p>
                    <p className="mt-3 text-white/75 tabular">
                      {formatCurrency(results.costPerApprentice)} per apprentice
                    </p>
                  </div>

                  <div className="mt-8">
                    <CostBreakdown values={values} results={results} />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Button variant="light" onClick={handleCopy} className="flex-1">
                      {copyStatus === 'copied' ? (
                        <Check aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <Copy aria-hidden="true" className="h-4 w-4" />
                      )}
                      {copyStatus === 'copied' ? 'Summary copied' : 'Copy estimate summary'}
                    </Button>
                    <Button href="#inquiry" variant="outlineLight" ctaId="discuss_estimate" ctaLocation="calculator" className="flex-1">
                      Discuss this estimate
                    </Button>
                  </div>
                  <p role="status" className="mt-2 min-h-[1.25rem] text-[0.8rem] text-white/60">
                    {copyStatus === 'copied' && 'A plain-text summary is on your clipboard.'}
                    {copyStatus === 'failed' && 'Copying isn’t available in this browser. The figures above are your summary.'}
                  </p>
                </>
              ) : (
                <div role="status" className="mt-4 rounded-md border border-white/15 p-4">
                  <p className="font-medium text-white">Estimate paused</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    {errorCount === 1 ? 'One field needs' : `${errorCount} fields need`} a valid value. Fix the highlighted{' '}
                    {errorCount === 1 ? 'field' : 'fields'} and the estimate will update.
                  </p>
                </div>
              )}

              <p className="mt-5 border-t border-white/10 pt-5 text-[0.8rem] leading-relaxed text-white/60">{DISCLAIMER}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
