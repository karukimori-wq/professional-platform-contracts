import test from 'node:test';
import assert from 'node:assert/strict';
import { pinOrderCharacter, assessCharacterDelivery } from '../src/proposals/character-order-policy.js';

const publication = () => ({ characterId: 'c1', characterVersion: 'v1', stateVersion: 2, status: 'published' });
function input() { return {
  order: { orderId: 'o1', paymentPolicy: 'PREPAY', status: 'awaiting_delivery', stateVersion: 4, paymentStatus: 'paid', refundStatus: 'none', fixedCharacter: pinOrderCharacter(publication()) },
  character: { characterId: 'c1', characterVersion: 'v9', status: 'published' },
  generation: { orderId: 'o1', generationId: 'g1', traceId: 't1', status: 'succeeded', usedCharacter: { characterId: 'c1', characterVersion: 'v1' } },
}; }
test('order uses NP applied version, detached from subsequent NS publication updates', () => {
  const p = publication(); const fixed = pinOrderCharacter(p); p.characterVersion = 'v2';
  assert.equal(fixed.characterVersion, 'v1'); assert.ok(Object.isFrozen(fixed));
  assert.equal(assessCharacterDelivery(input()).allowed, true);
});
test('unconfirmed, stopped or incomplete publications cannot start an order', () => {
  for (const patch of [{ status: 'pending' }, { status: 'stopped' }, { characterVersion: '' }, { stateVersion: 0 }]) {
    assert.throws(() => pinOrderCharacter({ ...publication(), ...patch }), /UNCONFIRMED/);
  }
});
test('APC mismatches and absent actual-use evidence prohibit delivery', () => {
  for (const patch of [{ usedCharacter: { characterId: 'c1', characterVersion: 'v2' } }, { usedCharacter: { characterId: 'other', characterVersion: 'v1' } }, { usedCharacter: undefined }, { orderId: 'other' }, { traceId: '' }, { generationId: '' }, { status: 'failed' }]) {
    const i = input(); Object.assign(i.generation, patch);
    assert.equal(assessCharacterDelivery(i).allowed, false);
  }
});
test('cancellation, all refund states, hold and unpaid states fail closed without mutations', () => {
  for (const patch of [{ paymentPolicy: 'FULL_POSTPAY' }, { paymentPolicy: 'PREVIEW_POSTPAY' }, { status: 'cancelled' }, { status: 'held' }, { status: 'completed' }, { paymentStatus: 'unpaid' }, ...['requested', 'processing', 'refunded', 'failed'].map(refundStatus => ({ refundStatus }))]) {
    const i = input(); Object.assign(i.order, patch); const before = structuredClone(i);
    assert.equal(assessCharacterDelivery(i).allowed, false); assert.deepEqual(i, before);
  }
});
test('stopped/deleted/wrong Character prohibits generation-result delivery', () => {
  for (const patch of [{ status: 'stopped' }, { status: 'deleted' }, { characterId: 'other' }]) {
    const i = input(); Object.assign(i.character, patch); assert.equal(assessCharacterDelivery(i).allowed, false);
  }
});
