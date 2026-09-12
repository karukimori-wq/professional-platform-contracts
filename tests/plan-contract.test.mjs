import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const plan = readFileSync('docs/contracts/plan-contract.md', 'utf8');
const migration = readFileSync('docs/release-readiness/plan-migration-guide.md', 'utf8');
const rollout = readFileSync('docs/release-readiness/free-pro-release-implementation-requests.md', 'utf8');
const responsibilities = readFileSync('docs/contracts/app-responsibilities.md', 'utf8');
const ownership = readFileSync('docs/contracts/data-ownership.md', 'utf8');
const api = readFileSync('docs/contracts/api-catalog.md', 'utf8');
const events = readFileSync('docs/contracts/event-catalog.md', 'utf8');

test('plan contract defines canonical plan and release types', () => {
  for (const marker of ['PlanId', 'free', 'pro', 'business', 'SubscriptionStatus', 'trialing', 'active', 'past_due', 'canceled', 'expired', 'ReleaseStatus', 'preparing', 'unavailable', 'AppContractStatus']) {
    assert.match(plan, new RegExp(marker));
  }
});

test('Numeria Free Pro release rules are explicit', () => {
  assert.match(plan, /20 completed appraisals per month/);
  assert.match(plan, /appraisal completion button/);
  assert.match(plan, /Session start alone does not consume/);
  assert.match(plan, /1 saved in-progress appraisal/);
  assert.match(plan, /3 appraisal client profiles/);
  assert.match(plan, /latest 3 history items/);
  assert.match(plan, /PDF output with platform logo/);
});

test('Velvet Free Pro release boundary is explicit', () => {
  assert.match(plan, /Basic registration and per-date\/per-record review/);
  assert.match(plan, /Integrated timeline/);
  assert.match(plan, /AI-assisted organization\/suggestions/);
  assert.match(plan, /Business remains unavailable\/preparing/);
});

test('Business remains future and not purchasable', () => {
  assert.match(plan, /Business is not purchasable/);
  assert.match(plan, /future cross-application business plan/);
  assert.match(migration, /Business: future running development, not purchasable now/);
  assert.match(rollout, /Business remains unavailable\/preparing and not purchasable/);
});

test('AI Platform Core safe payload boundaries are present', () => {
  assert.match(plan, /All application AI usage must go through AI Platform Core/);
  assert.match(plan, /Full appraisal text/);
  assert.match(plan, /Secret prompts/);
});

test('Feedback Hub and Platform Admin release contracts are present', () => {
  assert.match(plan, /Free and Pro users must both be able to submit inquiries/);
  assert.match(plan, /Platform Admin should monitor/);
  assert.match(api, /\/release\/status/);
  assert.match(api, /\/auth\/status/);
});

test('Growth Engine and source of truth boundaries are preserved', () => {
  assert.match(plan, /Growth Engine is the Source of Truth/);
  assert.match(responsibilities, /Business is future running development/);
  assert.match(ownership, /Plan support does not change Source of Truth ownership/);
});

test('shared plan and release events are stable', () => {
  for (const eventName of ['plan.subscription.changed.v1', 'plan.entitlement.checked.v1', 'plan.usage.recorded.v1', 'plan.usage_limit.reached.v1', 'release.status.checked.v1', 'app.contract.status.checked.v1']) {
    assert.match(events, new RegExp(eventName.replaceAll('.', '\\.')));
  }
});
