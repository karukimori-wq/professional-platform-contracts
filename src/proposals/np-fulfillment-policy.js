// Draft-only pure policy; never substitute for server-side Stripe verification or
// the actual NP/NS authorization checks.
const PAYMENT_MODES = new Set(["prepaid", "postpay"]);
const PAYMENT_STATES = new Set(["not_started", "pending", "paid", "failed", "refunded", "disputed"]);
const READING_STATES = new Set(["not_started", "accepted", "in_progress", "finalized", "canceled"]);
const CHANNELS = new Set(["np_only", "business_ns"]);

function requireData(order) {
  if (!order || typeof order !== "object") throw new TypeError("order required");
  if (!PAYMENT_MODES.has(order.paymentMode)) throw new Error("invalid paymentMode");
  if (!PAYMENT_STATES.has(order.paymentState)) throw new Error("invalid paymentState");
  if (!READING_STATES.has(order.readingState)) throw new Error("invalid readingState");
  if (!CHANNELS.has(order.fulfillmentChannel)) throw new Error("invalid fulfillmentChannel");
  for (const field of ["buyerAuthenticated", "sellerOptedInPostpay", "linkAuthorizedAtIntake"]) {
    if (typeof order[field] !== "boolean") throw new Error("invalid " + field);
  }
  // buyer authorization only controls *access*, not whether a seller can fulfill.
  return order;
}

function isBlocked(o) {
  return o.readingState === "canceled" || o.paymentState === "refunded" ||
    o.paymentState === "disputed";
}

/**
 * NP-only is always allowed to work without Business. Business integrations
 * require authorized NS/NP seller-workspace link at intake, not merely plan labels.
 * An already accepted Business order can continue after entitlement expires.
 * This is only a preliminary policy, not the canonical service authorization.
 */
export function canStartNewReading(raw) {
  const o = requireData(raw);
  if (isBlocked(o) || o.readingState !== "accepted") return false;
  if (o.paymentMode === "prepaid" && o.paymentState !== "paid") return false;
  if (o.paymentMode === "postpay" && !o.sellerOptedInPostpay) return false;
  if (o.fulfillmentChannel === "business_ns" && !o.linkAuthorizedAtIntake) return false;
  return true;
}

/** Completed report can be *viewed* prepayment only for approved full postpay. */
export function canViewFullText(raw) {
  const o = requireData(raw);
  if (!o.buyerAuthenticated || isBlocked(o) || o.readingState !== "finalized") return false;
  if (o.paymentMode === "prepaid") return o.paymentState === "paid";
  return o.paymentState === "paid" || o.sellerOptedInPostpay;
}

/** PDF always requires a confirmed and still-entitled paid order. */
export function canDownloadPdf(raw) {
  const o = requireData(raw);
  return o.buyerAuthenticated && !isBlocked(o) &&
    o.readingState === "finalized" && o.paymentState === "paid";
}

/** Only a paid order is eligible to inform GE payment projection. */
export function canPublishPaidCommerceEvent(raw) {
  const o = requireData(raw);
  return o.paymentState === "paid";
}
