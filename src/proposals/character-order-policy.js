// Executable proposal, not wired to NP. NP must read authoritative state and
// commit the result with order-state CAS; a preflight check alone is insufficient.
const nonempty = (v) => typeof v === 'string' && v.trim().length > 0;
const sameReference = (a, b) => a && b && ['characterId', 'characterVersion'].every(k => nonempty(a[k]) && a[k] === b[k]);
const result = (allowed, code) => ({ allowed, code });

export function pinOrderCharacter(appliedPublication) {
  if (!appliedPublication || appliedPublication.status !== 'published' ||
      !nonempty(appliedPublication.characterId) || !nonempty(appliedPublication.characterVersion) ||
      !Number.isSafeInteger(appliedPublication.stateVersion) || appliedPublication.stateVersion < 1) {
    throw new Error('CHARACTER_PUBLICATION_UNCONFIRMED');
  }
  return Object.freeze({ characterId: appliedPublication.characterId,
    characterVersion: appliedPublication.characterVersion, publicationStateVersion: appliedPublication.stateVersion });
}

export function assessCharacterDelivery({ order, generation, character }) {
  // This first slice supports PREPAY only. Postpay web/PDF entitlements stay with NP.
  if (!order || order.paymentPolicy !== 'PREPAY' || order.status !== 'awaiting_delivery' || order.paymentStatus !== 'paid' ||
      order.refundStatus !== 'none' || !Number.isSafeInteger(order.stateVersion) || order.stateVersion < 1) {
    return result(false, 'ORDER_NOT_DELIVERABLE');
  }
  if (!character || character.status !== 'published' || character.characterId !== order.fixedCharacter?.characterId) {
    return result(false, 'CHARACTER_NOT_ACTIVE');
  }
  if (!generation || !nonempty(order.orderId) || generation.orderId !== order.orderId ||
      !nonempty(generation.generationId) || !nonempty(generation.traceId) || generation.status !== 'succeeded' ||
      !sameReference(order.fixedCharacter, generation.usedCharacter)) {
    return result(false, 'CHARACTER_GENERATION_MISMATCH');
  }
  return result(true, 'DELIVERY_CAS_REQUIRED');
}
