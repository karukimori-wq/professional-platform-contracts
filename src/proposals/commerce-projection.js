// PROPOSAL ONLY: not exported from the active platform contract.
export const commercePaymentSources = Object.freeze(["numeria-place", "numeria-studio"]);
export const commerceChannels = Object.freeze(["marketplace", "seller_lp", "official_ai"]);

const paidFields = new Set([
  "sourceApp", "sourceOrderId", "sellerRef", "salesChannel",
  "amountMinor", "currency", "paymentState", "customerId",
]);

const refundFields = new Set([
  "sourceApp", "sourceOrderId", "sellerRef", "refundRef",
  "amountMinor", "currency", "refundState", "transferReversalState",
]);

function checkFields(value, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Commerce projection data must be a plain object");
  }
  const extras = Object.keys(value).filter((k) => !allowed.has(k));
  if (extras.length) {
    throw new Error(`Commerce projection fields not allowed: ${extras.join(", ")}`);
  }
}

function nonEmpty(value, field) {
  if (typeof value !== "string" || value.length < 1 || value.length > 128) {
    throw new Error(`Invalid ${field}`);
  }
}
function assertShared(value) {
  if (!commercePaymentSources.includes(value.sourceApp)) {
    throw new Error("Unknown sourceApp");
  }
  nonEmpty(value.sourceOrderId, "sourceOrderId");
  nonEmpty(value.sellerRef, "sellerRef");
  if (!Number.isSafeInteger(value.amountMinor) || value.amountMinor < 0) {
    throw new Error("Invalid minor-unit amount");
  }
  if (typeof value.currency !== "string" || !/^[A-Z]{3}$/.test(value.currency)) {
    throw new Error("Invalid ISO currency");
  }
}
export function createPaidCommerceProjectionData(value) {
  checkFields(value, paidFields);
  assertShared(value);
  if (value.paymentState !== "paid") throw new Error("Not an authoritative paid event");
  if (!commerceChannels.includes(value.salesChannel)) throw new Error("Unknown salesChannel");
  if (value.sourceApp === "numeria-studio" && value.salesChannel !== "official_ai") {
    throw new Error("NS official sale requires official_ai");
  }
  if (value.sourceApp === "numeria-place" && value.salesChannel === "official_ai") {
    throw new Error("NP sale cannot use official_ai");
  }
  if (value.customerId !== undefined && !/^cus_[A-Za-z0-9_-]+$/.test(value.customerId)) {
    throw new Error("Invalid customerId");
  }
  return Object.fromEntries([...paidFields].filter((field) => Object.hasOwn(value, field)).map((field) => [field, value[field]]));
}
export function createRefundCommerceProjectionData(value) {
  checkFields(value, refundFields);
  assertShared(value);
  nonEmpty(value.refundRef, "refundRef");
  if (value.amountMinor < 1) throw new Error("Refund amount must be positive");
  if (!["pending", "succeeded", "failed"].includes(value.refundState)) {
    throw new Error("Invalid refundState");
  }
  if (value.transferReversalState !== undefined &&
      !["not_required", "not_started", "pending", "succeeded", "failed"].includes(value.transferReversalState)) {
    throw new Error("Invalid transferReversalState");
  }
  return Object.fromEntries([...refundFields].filter((field) => Object.hasOwn(value, field)).map((field) => [field, value[field]]));
}
