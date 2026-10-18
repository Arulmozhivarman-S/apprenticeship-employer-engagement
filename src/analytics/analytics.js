/**
 * Lightweight, provider-agnostic analytics layer (DEMO / SIMULATED).
 *
 * - Every event goes to an in-memory log (shown in the dev Analytics panel).
 * - Every event is forwarded to registered "providers". Only a console
 *   provider is registered in this prototype; NO data leaves the browser.
 * - To add a real tool later (e.g. GA4, Segment), write a provider with a
 *   `send(event)` method and call `registerProvider()`. Nothing else changes.
 *
 * Privacy: event names are allow-listed and properties are filtered to a
 * small set of non-personal keys. Names, emails, messages, and calculator
 * values are never recorded.
 */

export const EVENTS = Object.freeze({
  LANDING_PAGE_VIEW: 'landing_page_view',
  EMPLOYER_BENEFITS_VIEW: 'employer_benefits_view',
  CALCULATOR_STARTED: 'calculator_started',
  CALCULATOR_UPDATED: 'calculator_updated',
  CALCULATOR_COMPLETED: 'calculator_completed',
  EMPLOYER_CTA_CLICKED: 'employer_cta_clicked',
  INQUIRY_FORM_STARTED: 'inquiry_form_started',
  INQUIRY_FORM_SUBMITTED_DEMO: 'inquiry_form_submitted_demo',
});

const ALLOWED_EVENTS = new Set(Object.values(EVENTS));

// Only these property keys may be attached to an event. Values are short
// labels describing *where* something happened, never what a user typed.
const ALLOWED_PROPS = new Set(['cta_id', 'location', 'field', 'area_of_interest']);

const MAX_LOG_SIZE = 200;

let eventLog = [];
let sequence = 0;
const listeners = new Set();
let providers = [];
const firedOnce = new Set();

export function sanitizeProps(props = {}) {
  const clean = {};
  for (const [key, value] of Object.entries(props)) {
    if (!ALLOWED_PROPS.has(key)) continue;
    if (typeof value === 'string') clean[key] = value.slice(0, 64);
    else if (typeof value === 'boolean') clean[key] = value;
  }
  return clean;
}

export function registerProvider(provider) {
  providers = [...providers, provider];
  return () => {
    providers = providers.filter((p) => p !== provider);
  };
}

export function track(name, props) {
  if (!ALLOWED_EVENTS.has(name)) {
    console.warn(`[analytics] Ignored unknown event "${name}".`);
    return null;
  }
  sequence += 1;
  const event = {
    id: sequence,
    name,
    props: sanitizeProps(props),
    timestamp: new Date().toISOString(),
  };
  // New array each time so useSyncExternalStore sees a changed snapshot.
  eventLog = [event, ...eventLog].slice(0, MAX_LOG_SIZE);

  for (const provider of providers) {
    try {
      provider.send(event);
    } catch (error) {
      console.warn(`[analytics] Provider "${provider.name}" failed.`, error);
    }
  }
  listeners.forEach((listener) => listener());
  return event;
}

/** Track an event at most once per page load (keyed by name + optional key). */
export function trackOnce(name, props, key = name) {
  if (firedOnce.has(key)) return null;
  firedOnce.add(key);
  return track(name, props);
}

export function getEvents() {
  return eventLog;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearEvents() {
  eventLog = [];
  listeners.forEach((listener) => listener());
}

/** Aggregate counts for the dev panel. */
export function summarizeEvents(events) {
  const count = (names) => events.filter((e) => names.includes(e.name)).length;
  return {
    total: events.length,
    calculatorInteractions: count([
      EVENTS.CALCULATOR_STARTED,
      EVENTS.CALCULATOR_UPDATED,
      EVENTS.CALCULATOR_COMPLETED,
    ]),
    ctaClicks: count([EVENTS.EMPLOYER_CTA_CLICKED]),
    demoSubmissions: count([EVENTS.INQUIRY_FORM_SUBMITTED_DEMO]),
  };
}

/** Test helper: reset all module state. */
export function __resetForTests() {
  eventLog = [];
  sequence = 0;
  providers = [];
  firedOnce.clear();
  listeners.clear();
}
