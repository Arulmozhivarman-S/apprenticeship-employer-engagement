/**
 * Employer apprenticeship cost calculator: pure functions, no React.
 *
 * Keeping the math separate from the UI means it can be unit tested
 * (see calculator.test.js) and explained on its own.
 *
 * All defaults are ILLUSTRATIVE demo assumptions, not program data.
 */
import { formatCurrency, formatNumber } from './format.js';

export const CALCULATOR_FIELDS = [
  {
    id: 'apprentices',
    label: 'Number of apprentices',
    group: 'schedule',
    defaultValue: 5,
    min: 1,
    max: 500,
    step: 1,
    integer: true,
  },
  {
    id: 'hourlyWage',
    label: 'Hourly wage per apprentice',
    group: 'schedule',
    defaultValue: 22,
    min: 0,
    max: 200,
    step: 0.5,
    prefix: '$',
    suffix: 'per hour',
  },
  {
    id: 'hoursPerWeek',
    label: 'Hours per week',
    group: 'schedule',
    defaultValue: 20,
    min: 1,
    max: 60,
    step: 1,
    suffix: 'hours',
  },
  {
    id: 'programWeeks',
    label: 'Weeks in the program',
    group: 'schedule',
    defaultValue: 24,
    min: 1,
    max: 104,
    step: 1,
    integer: true,
    suffix: 'weeks',
  },
  {
    id: 'trainingCostPerApprentice',
    label: 'Training and onboarding cost per apprentice',
    group: 'support',
    defaultValue: 1500,
    min: 0,
    max: 100000,
    step: 50,
    prefix: '$',
  },
  {
    id: 'supervisorHoursPerWeek',
    label: 'Supervisor hours per apprentice, per week',
    group: 'support',
    defaultValue: 2,
    min: 0,
    max: 40,
    step: 0.5,
    suffix: 'hours',
  },
  {
    id: 'supervisorHourlyCost',
    label: 'Supervisor hourly cost',
    group: 'support',
    defaultValue: 55,
    min: 0,
    max: 500,
    step: 1,
    prefix: '$',
    suffix: 'per hour',
  },
];

export const FIELD_BY_ID = Object.fromEntries(CALCULATOR_FIELDS.map((f) => [f.id, f]));

/** Inputs are held as strings so users can clear a field while typing. */
export function getDefaultRawValues() {
  return Object.fromEntries(CALCULATOR_FIELDS.map((f) => [f.id, String(f.defaultValue)]));
}

/** Returns a user-facing error message, or null when the value is valid. */
export function validateField(field, raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return 'Enter a value to update the estimate.';
  const value = Number(text);
  if (!Number.isFinite(value)) return 'Enter a number, using digits only.';
  if (field.integer && !Number.isInteger(value)) return 'Enter a whole number.';
  if (value < field.min) return `Enter ${formatNumber(field.min)} or more.`;
  if (value > field.max) return `Enter ${formatNumber(field.max)} or less.`;
  return null;
}

/** Validates every field. `values` contains numbers only for valid fields. */
export function parseInputs(rawValues) {
  const values = {};
  const errors = {};
  for (const field of CALCULATOR_FIELDS) {
    const error = validateField(field, rawValues[field.id]);
    if (error) errors[field.id] = error;
    else values[field.id] = Number(String(rawValues[field.id]).trim());
  }
  return { values, errors, isValid: Object.keys(errors).length === 0 };
}

const roundCents = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Core formulas (from the program brief):
 *   wage cost       = apprentices × hourly wage × hours/week × weeks
 *   training cost   = apprentices × training cost per apprentice
 *   supervisor cost = apprentices × supervisor hrs/week × supervisor rate × weeks
 *   total           = wage + training + supervisor
 */
export function calculateProgramCost({
  apprentices,
  hourlyWage,
  hoursPerWeek,
  programWeeks,
  trainingCostPerApprentice,
  supervisorHoursPerWeek,
  supervisorHourlyCost,
}) {
  const wageCost = apprentices * hourlyWage * hoursPerWeek * programWeeks;
  const trainingCost = apprentices * trainingCostPerApprentice;
  const supervisorCost = apprentices * supervisorHoursPerWeek * supervisorHourlyCost * programWeeks;
  const totalCost = wageCost + trainingCost + supervisorCost;

  return {
    wageCost: roundCents(wageCost),
    trainingCost: roundCents(trainingCost),
    supervisorCost: roundCents(supervisorCost),
    totalCost: roundCents(totalCost),
    costPerApprentice: apprentices > 0 ? roundCents(totalCost / apprentices) : 0,
  };
}

/** Share of the total for each component (0 when the total is 0). */
export function getCostShares(results) {
  const { wageCost, trainingCost, supervisorCost, totalCost } = results;
  const share = (part) => (totalCost > 0 ? (part / totalCost) * 100 : 0);
  return {
    wage: share(wageCost),
    training: share(trainingCost),
    supervisor: share(supervisorCost),
  };
}

/** Human-readable formulas with the user's numbers substituted in. */
export function describeFormulas(v) {
  const n = formatNumber;
  const money = (x) => formatCurrency(x, { cents: !Number.isInteger(x) });
  return {
    wage: `${n(v.apprentices)} × ${money(v.hourlyWage)}/hr × ${n(v.hoursPerWeek)} hrs × ${n(v.programWeeks)} wks`,
    training: `${n(v.apprentices)} × ${money(v.trainingCostPerApprentice)}`,
    supervisor: `${n(v.apprentices)} × ${n(v.supervisorHoursPerWeek)} hrs × ${money(v.supervisorHourlyCost)}/hr × ${n(v.programWeeks)} wks`,
  };
}

/**
 * Optional scenario analysis using the EMPLOYER'S OWN benefit estimate.
 *   net benefit = estimated benefits − program cost
 *   ROI %       = net benefit ÷ program cost × 100
 * ROI is undefined (null) when the program cost is 0: we never divide by zero.
 */
export function calculateScenario(estimatedBenefits, totalCost) {
  const netBenefit = roundCents(estimatedBenefits - totalCost);
  const roiPercent = totalCost > 0 ? (netBenefit / totalCost) * 100 : null;
  return { netBenefit, roiPercent };
}

export function validateBenefitInput(raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return { value: null, error: null }; // empty = "not entered yet", not an error
  const value = Number(text);
  if (!Number.isFinite(value)) return { value: null, error: 'Enter a number, using digits only.' };
  if (value < 0) return { value: null, error: 'Enter 0 or more.' };
  if (value > 1e9) return { value: null, error: 'Enter 1,000,000,000 or less.' };
  return { value, error: null };
}

/** Plain-text summary an employer could paste into an internal email. */
export function buildEstimateSummary(values, results) {
  const f = describeFormulas(values);
  return [
    'Illustrative apprenticeship cost estimate (planning assumptions only)',
    '',
    `Wage cost: ${formatCurrency(results.wageCost)} (${f.wage})`,
    `Training and onboarding: ${formatCurrency(results.trainingCost)} (${f.training})`,
    `Supervisor time: ${formatCurrency(results.supervisorCost)} (${f.supervisor})`,
    `Estimated total program cost: ${formatCurrency(results.totalCost)}`,
    `Estimated cost per apprentice: ${formatCurrency(results.costPerApprentice)}`,
    '',
    'Actual costs depend on employer policies, program requirements, and other expenses.',
    'Wage costs are not necessarily incremental costs. This is not a guaranteed return on investment.',
  ].join('\n');
}
