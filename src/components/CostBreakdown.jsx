import { describeFormulas, getCostShares } from '../utils/calculator.js';
import { formatCurrency, formatPercent } from '../utils/format.js';

const PARTS = [
  { key: 'wage', resultKey: 'wageCost', label: 'Wage cost', swatch: 'bg-paper' },
  { key: 'training', resultKey: 'trainingCost', label: 'Training and onboarding', swatch: 'bg-accent-light' },
  { key: 'supervisor', resultKey: 'supervisorCost', label: 'Supervisor time', swatch: 'bg-accent' },
];

/**
 * A single stacked bar plus a legend table. A full charting library
 * isn't needed for three proportions, so this is plain CSS.
 */
export default function CostBreakdown({ values, results }) {
  const shares = getCostShares(results);
  const formulas = describeFormulas(values);
  const hasCost = results.totalCost > 0;

  return (
    <div>
      <div
        role="img"
        aria-label={
          hasCost
            ? `Cost breakdown: wages ${formatPercent(shares.wage)}, training ${formatPercent(shares.training)}, supervisor time ${formatPercent(shares.supervisor)}.`
            : 'Cost breakdown: no costs entered.'
        }
        className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-white/10"
      >
        {hasCost &&
          PARTS.map((p) =>
            shares[p.key] > 0 ? (
              <span
                key={p.key}
                className={`${p.swatch} h-full transition-[width] duration-300 ease-out motion-reduce:transition-none`}
                style={{ width: `${shares[p.key]}%` }}
              />
            ) : null,
          )}
      </div>

      <dl className="mt-5 divide-y divide-white/10">
        {PARTS.map((p) => (
          <div key={p.key} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 py-3">
            <span aria-hidden="true" className={`h-2.5 w-2.5 translate-y-[1px] rounded-sm ${p.swatch}`} />
            <dt className="min-w-0">
              <span className="block text-[0.95rem] text-white">{p.label}</span>
              <span className="mt-0.5 block break-words text-[0.78rem] text-white/55 tabular">{formulas[p.key]}</span>
            </dt>
            <dd className="text-right tabular">
              <span className="block font-semibold text-white">{formatCurrency(results[p.resultKey])}</span>
              <span className="block text-[0.78rem] text-white/55">{hasCost ? formatPercent(shares[p.key], 0) : '0%'}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
