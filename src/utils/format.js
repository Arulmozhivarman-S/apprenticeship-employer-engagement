const currencyWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const currencyCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** Whole-dollar currency for totals. Pass { cents: true } for small unit amounts. */
export function formatCurrency(value, { cents = false } = {}) {
  if (!Number.isFinite(value)) return '—';
  // Avoid displaying "-$0" after rounding.
  const safe = Math.abs(value) < 0.005 ? 0 : value;
  return (cents ? currencyCents : currencyWhole).format(safe);
}

export function formatNumber(value) {
  return Number.isFinite(value) ? numberFmt.format(value) : '—';
}

export function formatPercent(value, digits = 1) {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(digits)}%`;
}
