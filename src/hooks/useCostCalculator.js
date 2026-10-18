import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateProgramCost, getDefaultRawValues, parseInputs } from '../utils/calculator.js';
import { EVENTS, track } from '../analytics/analytics.js';

const UPDATE_DEBOUNCE_MS = 800;

/**
 * Owns calculator state. Lives in App so both the calculator and the
 * ROI scenario can read the same results.
 *
 * Analytics: `calculator_started` fires on the first edit, and
 * `calculator_updated` is debounced so typing "1500" is one event, not four.
 * Only the field NAME is tracked, never the value.
 */
export function useCostCalculator() {
  const [rawValues, setRawValues] = useState(getDefaultRawValues);
  const hasStarted = useRef(false);
  const updateTimer = useRef(null);

  const { values, errors, isValid } = useMemo(() => parseInputs(rawValues), [rawValues]);
  const results = useMemo(() => (isValid ? calculateProgramCost(values) : null), [isValid, values]);

  const setField = useCallback((fieldId, raw) => {
    setRawValues((prev) => ({ ...prev, [fieldId]: raw }));

    if (!hasStarted.current) {
      hasStarted.current = true;
      track(EVENTS.CALCULATOR_STARTED, { field: fieldId });
    }
    clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => {
      track(EVENTS.CALCULATOR_UPDATED, { field: fieldId });
    }, UPDATE_DEBOUNCE_MS);
  }, []);

  const reset = useCallback(() => setRawValues(getDefaultRawValues()), []);

  useEffect(() => () => clearTimeout(updateTimer.current), []);

  return { rawValues, values, errors, isValid, results, setField, reset };
}
