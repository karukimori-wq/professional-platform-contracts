import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const plan = readFileSync('docs/contracts/plan-contract.md', 'utf8');
const migration = readFileSync('docs/release-readiness/plan-migration-guide.md', 'utf8');
const responsibilities = readFileSync('docs/contracts/app-responsibilities.md', 'utf8');
const ownership = readFileSync('docs/contracts/data-ownership.md', 'utf8');
const events = readFileSync('docs/contracts/event-catalog.md', 'utf8');

test('plan contract defines canonical plan types', () => {
  for (const marker of ['PlanId', 'free', 'pro', 'business', 'SubscriptionStatus', 'trialing', 'active', 'past_due', 'canceled', 'expired']) {
    assert.match(plan, new RegExp(marker));
  }
});

test('Numeria and Velvet Free Pro limits are explicit', () => {
  assert.match(plan, /20 appraisals per month/);
  assert.match(plan, /3 appraisal subjects/);
  assert.match(plan, /30 customers/);
  assert.match(plan, /3 months of history visibility/);
  assert.match(plan, /Numeria Studio Pro and Velvet Pro are separately purchasable/);
});

test('Business remains future cross application plan', () => {
  assert.match(plan, /Business is not purchasable/);
  assert.match(plan, /future cross-application plan/);
  assert.match(migration, /coming soon/);
});

test('plan support preserves source of truth boundaries', () => {
  assert.match(plan, /Customer master/);
  assert.match(plan, /Reservation, Payment, and Sales/);
  assert.match(responsibilities, /Plan support does not change application responsibilities/);
  assert.match(ownership, /Plan support does not change Source of Truth ownership/);
});

test('shared plan events are stable', () => {
  for (const eventName of ['plan.subscription.changed.v1', 'plan.entitlement.checked.v1', 'plan.usage.recorded.v1', 'plan.usage_limit.reached.v1']) {
    assert.match(events, new RegExp(eventName.replaceAll('.', '\\.')));
  }
});
