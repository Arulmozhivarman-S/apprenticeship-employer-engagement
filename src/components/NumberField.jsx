import { memo } from 'react';
import { CircleAlert } from 'lucide-react';
import { formatNumber } from '../utils/format.js';

/**
 * Labeled numeric input with optional $ prefix / unit suffix.
 * Value is a string (controlled), so users can clear and retype freely.
 * memo() keeps the other six fields from re-rendering on each keystroke.
 */
function NumberField({ field, value, error, onChange }) {
  const inputId = `calc-${field.id}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId} className="block text-[0.95rem] font-medium text-ink">
        {field.label}
      </label>
      <div className="relative mt-2">
        {field.prefix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-muted">
            {field.prefix}
          </span>
        )}
        <input
          id={inputId}
          name={field.id}
          type="number"
          inputMode={field.integer ? 'numeric' : 'decimal'}
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${errorId} ${hintId}` : hintId}
          className={`field-input tabular ${field.prefix ? 'pl-7' : ''} ${field.suffix ? 'pr-24' : ''}`}
        />
        {field.suffix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-muted">
            {field.suffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-red-800">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
      <p id={hintId} className="mt-1.5 text-[0.8rem] text-ink-muted">
        Range {field.prefix ?? ''}
        {formatNumber(field.min)} to {field.prefix ?? ''}
        {formatNumber(field.max)}
      </p>
    </div>
  );
}

export default memo(NumberField);
