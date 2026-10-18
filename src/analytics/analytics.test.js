import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  EVENTS, track, trackOnce, getEvents, registerProvider, summarizeEvents, sanitizeProps, __resetForTests,
} from './analytics.js';

beforeEach(() => __resetForTests());

test('records allowed events newest-first', () => {
  track(EVENTS.LANDING_PAGE_VIEW);
  track(EVENTS.EMPLOYER_CTA_CLICKED, { cta_id: 'hero_primary' });
  const events = getEvents();
  assert.equal(events.length, 2);
  assert.equal(events[0].name, 'employer_cta_clicked');
  assert.ok(events[0].timestamp);
});

test('ignores unknown event names', () => {
  const originalWarn = console.warn;
  console.warn = () => {};
  assert.equal(track('made_up_event'), null);
  console.warn = originalWarn;
  assert.equal(getEvents().length, 0);
});

test('strips personal or unknown properties', () => {
  const clean = sanitizeProps({ cta_id: 'nav', email: 'a@b.com', name: 'Jo', wage: 22, field: 'hourlyWage' });
  assert.deepEqual(clean, { cta_id: 'nav', field: 'hourlyWage' });
});

test('trackOnce fires only once per key', () => {
  trackOnce(EVENTS.LANDING_PAGE_VIEW);
  trackOnce(EVENTS.LANDING_PAGE_VIEW);
  assert.equal(getEvents().length, 1);
});

test('forwards sanitized events to providers', () => {
  const received = [];
  registerProvider({ name: 'test', send: (e) => received.push(e) });
  track(EVENTS.INQUIRY_FORM_SUBMITTED_DEMO, { area_of_interest: 'Cost and budget planning', email: 'x@y.com' });
  assert.equal(received.length, 1);
  assert.deepEqual(received[0].props, { area_of_interest: 'Cost and budget planning' });
});

test('summarizes counts for the dev panel', () => {
  track(EVENTS.CALCULATOR_STARTED);
  track(EVENTS.CALCULATOR_UPDATED);
  track(EVENTS.CALCULATOR_COMPLETED);
  track(EVENTS.EMPLOYER_CTA_CLICKED);
  track(EVENTS.INQUIRY_FORM_SUBMITTED_DEMO);
  assert.deepEqual(summarizeEvents(getEvents()), {
    total: 5, calculatorInteractions: 3, ctaClicks: 1, demoSubmissions: 1,
  });
});
