import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { calculateScenario, validateBenefitInput } from '../utils/calculator.js';
import { formatCurrency, formatPercent } from '../utils/format.js';

const FACTORS = [
  { title: 'Productivity', body: 'The value of work apprentices contribute during the program.' },
  { title: 'Recruiting', body: 'Any hiring costs you might avoid if apprentices later join your team.' },
  { title: 'Retention', body: 'Whether people who start as apprentices tend to stay longer.' },
  { title: 'Training', body: 'Onboarding you would otherwise spend on new hires.' },
];

/**
 * ROI is computed ONLY from a benefit figure the employer types in.
 * The page never supplies or suggests a benefit number of its own.
 */
export default function RoiScenario({ totalCost }) {
  const [raw, setRaw] = useState('');
  const { value: benefits, error } = validateBenefitInput(raw);
  const hasCost = totalCost !== null;
  const scenario = hasCost && benefits !== null ? calculateScenario(benefits, totalCost) : null;

  return (
    <section id="roi" aria-labelledby="roi-title" className="border-t border-line bg-white py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="roi-title" className="section-title">
            Weigh costs against your own assumptions
          </h2>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-muted">
            This page doesn’t estimate a return for you. Every organization values these factors differently, so compare
            the cost estimate with figures you’re confident in.
          </p>
          <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {FACTORS.map((f) => (
              <div key={f.title} className="border-l-2 border-accent pl-4">
                <dt className="font-semibold">{f.title}</dt>
                <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-muted">{f.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-xl border border-line bg-paper p-6 sm:p-8">
            <h3 className="text-xl font-semibold tracking-tight">Scenario analysis</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              Uses your assumptions, not verified data. The result is not a prediction or a guarantee.
            </p>

            <label htmlFor="roi-benefits" className="mt-6 block text-[0.95rem] font-medium">
              Your estimated monetary benefits over the program
            </label>
            <div className="relative mt-2">
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-muted">
                $
              </span>
              <input
                id="roi-benefits"
                type="number"
                inputMode="decimal"
                min="0"
                step="100"
                placeholder="e.g. 80000"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'roi-benefits-error' : undefined}
                className="field-input tabular pl-7"
              />
            </div>
            {error && (
              <p id="roi-benefits-error" className="mt-2 flex items-start gap-1.5 text-sm text-red-800">
                <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <div aria-live="polite" className="mt-6">
              {!hasCost && (
                <p className="text-sm text-ink-muted">Fix the calculator inputs above to compare against a cost estimate.</p>
              )}
              {hasCost && benefits === null && !error && (
                <p className="text-sm text-ink-muted">
                  Enter your own benefit estimate to compare it with the{' '}
                  <span className="font-semibold text-ink tabular">{formatCurrency(totalCost)}</span> cost estimate.
                </p>
              )}
              {scenario && (
                <dl className="divide-y divide-line border-y border-line">
                  <Row label="Your estimated benefits" value={formatCurrency(benefits)} />
                  <Row label="Estimated program cost" value={`− ${formatCurrency(totalCost)}`} />
                  <Row
                    label="Estimated net benefit"
                    value={formatCurrency(scenario.netBenefit)}
                    emphasis
                    tone={scenario.netBenefit < 0 ? 'negative' : 'neutral'}
                  />
                  <Row
                    label="Estimated ROI"
                    value={scenario.roiPercent === null ? 'Not defined' : formatPercent(scenario.roiPercent)}
                    emphasis
                    tone={scenario.roiPercent !== null && scenario.roiPercent < 0 ? 'negative' : 'neutral'}
                  />
                </dl>
              )}
              {scenario && scenario.roiPercent === null && (
                <p className="mt-3 text-sm text-ink-muted">ROI can’t be calculated when the estimated program cost is $0.</p>
              )}
            </div>

            <div className="mt-6 rounded-md bg-paper-deep px-4 py-3 text-[0.82rem] leading-relaxed text-ink-muted">
              <p className="font-medium text-ink">How this is calculated</p>
              <p className="mt-1 tabular">Net benefit = your estimated benefits − estimated program cost</p>
              <p className="tabular">ROI = (net benefit ÷ estimated program cost) × 100</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, emphasis = false, tone = 'neutral' }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className={emphasis ? 'font-medium text-ink' : 'text-ink-muted'}>{label}</dt>
      <dd className={`tabular ${emphasis ? 'text-lg font-semibold' : ''} ${tone === 'negative' ? 'text-red-800' : 'text-ink'}`}>
        {value}
      </dd>
    </div>
  );
}
