import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CALCULATOR_FIELDS, FIELD_BY_ID, calculateProgramCost, calculateScenario, getCostShares,
  getDefaultRawValues, parseInputs, validateField, validateBenefitInput,
} from './calculator.js';
import { validateInquiry, EMPTY_INQUIRY, isLikelyPersonalEmail } from './inquiryValidation.js';

test('default demo inputs produce the expected totals', () => {
  const { values, isValid } = parseInputs(getDefaultRawValues());
  assert.ok(isValid);
  const r = calculateProgramCost(values);
  assert.equal(r.wageCost, 52800);       // 5 × 22 × 20 × 24
  assert.equal(r.trainingCost, 7500);    // 5 × 1500
  assert.equal(r.supervisorCost, 13200); // 5 × 2 × 55 × 24
  assert.equal(r.totalCost, 73500);
  assert.equal(r.costPerApprentice, 14700);
});

test('single apprentice, decimal wage and hours', () => {
  const r = calculateProgramCost({
    apprentices: 1, hourlyWage: 18.75, hoursPerWeek: 15.5, programWeeks: 10,
    trainingCostPerApprentice: 0, supervisorHoursPerWeek: 1.5, supervisorHourlyCost: 40,
  });
  assert.equal(r.wageCost, 2906.25);     // 18.75 × 15.5 × 10
  assert.equal(r.supervisorCost, 600);   // 1.5 × 40 × 10
  assert.equal(r.totalCost, 3506.25);
  assert.equal(r.costPerApprentice, 3506.25);
});

test('large cohort', () => {
  const r = calculateProgramCost({
    apprentices: 120, hourlyWage: 30, hoursPerWeek: 40, programWeeks: 52,
    trainingCostPerApprentice: 4000, supervisorHoursPerWeek: 3, supervisorHourlyCost: 80,
  });
  assert.equal(r.wageCost, 7488000);
  assert.equal(r.trainingCost, 480000);
  assert.equal(r.supervisorCost, 1497600);
  assert.equal(r.totalCost, 9465600);
  assert.equal(r.costPerApprentice, 78880);
});

test('all-zero optional costs yields zero total and zero shares', () => {
  const r = calculateProgramCost({
    apprentices: 3, hourlyWage: 0, hoursPerWeek: 10, programWeeks: 8,
    trainingCostPerApprentice: 0, supervisorHoursPerWeek: 0, supervisorHourlyCost: 0,
  });
  assert.equal(r.totalCost, 0);
  assert.deepEqual(getCostShares(r), { wage: 0, training: 0, supervisor: 0 });
});

test('cost shares sum to 100', () => {
  const r = calculateProgramCost(parseInputs(getDefaultRawValues()).values);
  const s = getCostShares(r);
  assert.ok(Math.abs(s.wage + s.training + s.supervisor - 100) < 1e-9);
});

test('validation catches empty, non-numeric, fractional, and out-of-range values', () => {
  const apprentices = FIELD_BY_ID.apprentices;
  assert.match(validateField(apprentices, ''), /Enter a value/);
  assert.match(validateField(apprentices, 'abc'), /number/);
  assert.match(validateField(apprentices, '2.5'), /whole number/);
  assert.match(validateField(apprentices, '0'), /1 or more/);
  assert.match(validateField(apprentices, '501'), /500 or less/);
  assert.equal(validateField(apprentices, ' 12 '), null);
  assert.match(validateField(FIELD_BY_ID.hourlyWage, '-1'), /0 or more/);
});

test('parseInputs reports only invalid fields', () => {
  const raw = { ...getDefaultRawValues(), hoursPerWeek: '', programWeeks: '200' };
  const { isValid, errors } = parseInputs(raw);
  assert.equal(isValid, false);
  assert.deepEqual(Object.keys(errors).sort(), ['hoursPerWeek', 'programWeeks']);
  assert.equal(CALCULATOR_FIELDS.length, 7);
});

test('scenario: positive, negative, and zero-cost ROI', () => {
  assert.deepEqual(calculateScenario(100000, 73500), { netBenefit: 26500, roiPercent: (26500 / 73500) * 100 });
  const loss = calculateScenario(50000, 73500);
  assert.equal(loss.netBenefit, -23500);
  assert.ok(loss.roiPercent < 0);
  assert.deepEqual(calculateScenario(1000, 0), { netBenefit: 1000, roiPercent: null });
});

test('benefit input validation', () => {
  assert.deepEqual(validateBenefitInput(''), { value: null, error: null });
  assert.equal(validateBenefitInput('-5').error, 'Enter 0 or more.');
  assert.equal(validateBenefitInput('12000').value, 12000);
});

test('inquiry validation', () => {
  const errors = validateInquiry(EMPTY_INQUIRY);
  assert.deepEqual(Object.keys(errors).sort(), ['area', 'email', 'name', 'organization']);
  const ok = validateInquiry({
    ...EMPTY_INQUIRY, name: 'Sam Lee', email: 'sam@acme.co', organization: 'Acme', area: 'Something else',
  });
  assert.deepEqual(ok, {});
  assert.ok(validateInquiry({ ...EMPTY_INQUIRY, email: 'sam@acme' }).email);
  assert.ok(isLikelyPersonalEmail('x@gmail.com'));
  assert.ok(!isLikelyPersonalEmail('x@acme.com'));
});
