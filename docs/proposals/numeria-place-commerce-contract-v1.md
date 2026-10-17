# P0 Proposal: Numeria Place Commerce and Numeria Studio Business Link Contract v1

**Status:** Draft for review only. No deployed app consumes these names yet. **Reference:** ADR 0002 (Proposed); Numeria Place Notion 04/06/07/09.

## 1. Non-negotiable invariants

| Area | Canonical owner | Consumers |
| --- | --- | --- |
| Shared Customer master and cross-app sales projection | Growth Engine | NP/NS by IDs; projections are not payment authority |
| NP seller/shop/listing, price/sale terms, customer order, payment/refund/fee/payout state | Numeria Place | GE projection; NS minimum order reference |
| Numeria-operated `/ai-reading` sale | Numeria Studio | GE projection |
| Professional NS Session, calculation, Character, Report, PDF | Numeria Studio | NP delivery by authorized report reference only |
| AI execution, Prompt, knowledge and Usage | AI Platform Core | NS only by capability contract |
| NS SaaS Pro/Business subscription | Existing subscribed-app billing contract | server-side entitlement to NP/NS where needed; billing owner pending explicit decision |

Do NOT treat Business plan enrollment as NP shop enrollment. An NP-only seller can transact and manually fulfill without an NS account.

## 2. Tenant / identity model

- `userId` / `ownerUserId`: identity subject; Clerk auth by itself never confers shop ownership.
- `workspaceId`: NS professional tenant; resource access always checks workspace owner or authorized member.
- `sellerId` / `shopId`: NP merchant and storefront, not identical to `workspaceId`. `publicSlug` may change; never use as access grant.
- `linkId`: NP-managed relationship `sellerId <-> workspaceId`, with `linkStatus` and `linkedByUserId`. Server verifies both sides; prohibit email-only matching.
- `listingId`: NP canonical listing. For Business product it includes an immutable-at-order-time `readingConfigRef` and fulfillment mode.
- `sourceApp` + `sourceOrderId`: key for GE commerce projection; GE `customerId` remains canonical customer key when linked.
- `paymentProviderAccountRef`: namespace the Stripe connected account and transaction IDs to avoid collisions; never log tokens or bank data.
- `correlationId` and `eventId`: end-to-end correlation, auditable deduplication.

NP order fulfillment must remain operable when GE Customer projection is temporarily unavailable. NP may keep the *minimum buyer contact and verification data* legally and operationally necessary for checkout/delivery, but does not create a competing cross-product Customer master. Backfill GE mapping asynchronously under purpose and consent restrictions.

## 3. Sale routing (paths proposed, public URLs not yet deployed)

| Path owner | Path | Purpose |
| --- | --- | --- |
| NS | `/app/*` | Seller's reading workbench |
| NS | `/ai-reading/*` | Official AI reading and NS-owned ordinary Stripe checkout |
| NP | `/place/*` | Marketplace discovery |
| NP | `/p/{publicSlug}` | All NP seller shops |
| NP | `/lp/{publicSlug}` | Business personal landing page |
| NP | NP checkout and delivery routes | Stripe Connect, authenticated fulfillment |

Cloudflare path-level routing must run before the existing NS SPA fallback, preserve `original.html`, and isolate static assets and callback paths. Both seller channels share one NP listing and checkout; `salesChannel=marketplace|seller_lp` is order metadata, not a second listing or ledger.

## 4. API operation proposals

| Operation | Caller -> Owner | Preconditions / effects |
| --- | --- | --- |
| `PlaceSellerLink.Create` | NS backend -> NP | Effective Business entitlement, signed caller, verified management rights at NP and NS. Idempotently link 1 shop to 1 workspace for MVP |
| `PlaceSellerLink.Get` | NS -> NP | Return masked connection/Connect status without bank/verification data |
| `PlaceSellerLink.Disconnect` | NS -> NP | Stop new synced orders but preserve shop, Connect account and prior purchase rights |
| `PlaceCheckout.Create` | NP buyer -> NP | Validate listing visibility, seller charge eligibility, price snapshot, tax/fees and terms |
| `PlaceReadingRequest.Create` | NP internal -> NS | Verified order eligible for fulfillment; authenticated service; correct seller/workspace/link, snapshot reading config |
| `PlaceReportDelivery.Prepare` | NS backend -> NP | Report formally finalized, reportVersion unique, link and order verified |
| `PlaceDelivery.Get` | NP buyer -> NP | Authenticated buyer, product and payment-mode release rules |
| `CommerceProjection.Upsert` | Source sale app -> GE | Idempotent source-scoped reporting; GE must not accept this as an instruction to charge or refund |

Internal HTTP URLs are implementation details; operation names and schemas are the canonical contract. The client browser cannot call the internal NS intake/report APIs directly.

## 5. Event proposals and required envelope

All events use existing envelope fields: `eventId`, `eventType`, `occurredAt`, `workspaceId` (when tenant-scoped), `sourceSystem`, `correlationId`, and `data`. Future buyer-only official sales must define a documented scope if they do not yet have an NS workspace; do not fabricate a workspace just to satisfy a schema.

| Event type (PROPOSED) | Publisher | Audience | Data only |
| --- | --- | --- | --- |
| `place.seller.linked.v1` | NP | NS | `linkId`, `sellerId`, `workspaceId`, `linkStatus` |
| `place.order.paid.v1` | NP | NP workflow + audit | `orderId`, `sellerId`, `listingId`, `paymentMode`, `paymentState` |
| `studio.session.started.v1` | NS | Existing subscribers | Maintain existing payload and meaning |
| `studio.session.completed.v1` | NS | Existing subscribers | Maintain existing payload and meaning |
| `studio.report.generated.v1` | NS | Existing subscribers | Preserve generated semantics; NOT equivalent to buyer delivery availability |
| `studio.report.ready_for_delivery.v1` | NS | NP | `orderRef`, `reportId`, `reportVersion`, `deliveryMode` |
| `place.delivery.available.v1` | NP | GE projection + NP notifications | `orderId`, `deliveryId`, `deliveryStatus` |
| `commerce.order.created.v1` | NP / NS official shop | GE | `sourceApp`, `sourceOrderId`, `salesChannel`, `sellerRef`, `amountMinor`, `currency` |
| `commerce.payment.completed.v1` | NP / NS official shop | GE | `sourceApp`, `sourceOrderId`, `paymentState`, `amountMinor`, `currency` |
| `commerce.payment.refunded.v1` | NP / NS official shop | GE | `sourceApp`, `sourceOrderId`, `refundState`, `amountMinor`, `currency` |
| `commerce.payout.updated.v1` | NP | GE summary | `sourceApp`, `sourceOrderId`, `payoutState`, `currency` |

Note that `commerce.*` events have multiple publishers: signature and `sourceSystem` validation must enforce the *authorized owner* of the referenced transaction. No sender may impersonate another seller or application.

## 6. Payment/fulfillment modes

| Mode | Order sequence | Reading access | PDF access |
| --- | --- | --- | --- |
| Prepaid | submit -> checkout -> Stripe-confirmed paid -> NS or NP work -> delivered | After finalized and paid | After finalized and paid |
| Full postpay (previously selected in NP design) | submit -> accepted -> NS or NP work -> protected full-text preview -> customer payment | After finalized and buyer authentication, before payment if seller opted in | Only after Stripe-confirmed paid |

**Full postpay security tradeoff:** a visible reading can be saved/captured by a buyer; viewing-only cannot technically guarantee payment. Seller must explicitly opt in and see the risk disclosure; refund/cancellation policies must address it. Prepayment is preferable for unattended AI fulfillment until policy is finalized.

NP order dimensions should be independent, not one overloaded status:

- `paymentState`: `not_required|pending|paid|failed|refunded|partially_refunded|disputed`.
- `fulfillmentState`: `not_started|queued|in_progress|awaiting_seller|finalized|delivered|canceled`.
- `deliveryState`: `unavailable|preview_available|download_available|revoked`.

Payment success return-page alone is never authoritative: NP verifies Stripe signatures and provider amount/account/currency, handles retries, out-of-order events and refunds. Buyer entitlement is re-evaluated at read time.

## 7. Transactional reliability and privacy

- NP saves order + outbox atomically, processes authenticated queues, and retries at least once with persistent failure visibility.
- Unique `sourceApp + orderId + listingId` for NS intake, `reportId + reportVersion` for NP delivery, `eventId` for GE projection.
- Never process a prepaid order before Stripe confirms payment; postpay work requires explicit seller policy and separate authorization.
- Reconciliation compares NP authoritative orders to GE projection by source-scoped key; backfill lost events and record audit trail.
- NS must keep original Report and immutable completion snapshot. NP may cache a temporary protected rendering artifact only if explicitly contracted and subject to retention/access policy.
- NP Connect secrets, full Stripe event payloads and bank details never enter NS, GE, APC or public logs.
- GE commerce projection allows amount, currency, sellerRef, sourceOrderId, status and occurredAt, but *never* full consultation, birth data, PDF or report text. This must be a **separate projection allowlist**, not a weakening of the existing professional-data growthShareAllowlist.
- NP seller-only and buyer-only scopes must be enforced by server authentication and tenant checks. Email receipt links alone must not grant unrestricted access.

## 8. Plan/expiry behavior

- NS Business is checked before making a **new** NP-to-NS integration request; NP sellers without Business retain all NP functionality.
- Existing accepted/paid orders need fulfillment rights until delivered or settled by NP manual fulfillment/refund even if Business lapses.
- Revoking a shop link must not delete buyer files, the Connect relationship or sales history.
- Numeria's general Free/Pro reading and report authoring remains independent of NP/GE outages.

## 9. Required contract migration work (after ADR Accepted)

1. Amend `docs/architecture.md` and app/data ownership/platform boundary tables using *sales-channel-specific* rows. Keep older GE direct-business-sales records scoped, not blindly reassigned.
2. Clarify `docs/contracts/subscription-contract.md` and `plan-contract.md` together; today they say NS (not GE) is canonical for NS SaaS subscriptions. Any move to GE is a **separate** ADR and migration.
3. Add proposed event types and API operations to catalogs and `src/contracts.js`, using versioning rules; do not change existing event meaning silently.
4. Publish event JSON Schemas, sample envelopes, privacy validation and tests. Add a new GE commerce-projection payload builder with a narrow allowlist; do not send `paymentStatus`/`salesAmount` through the professional report-sharing payload builder.
5. Implement NP Stripe/Shop, NS link/readings/delivery, GE projection, then run cross-app authorization, idempotency, payment and regression tests.
6. After compatibility testing and explicit approval, bump the major contract version and deploy incrementally.

## 10. P0 acceptance checklist

- [ ] Seller of record, Connect fee/charge option, Japan legal/tax and refund responsibilities approved.
- [ ] SaaS Billing owner ambiguity resolved and recorded without assuming GE owns subscriptions.
- [ ] Customer master / NP minimum delivery contact exception documented and privacy reviewed.
- [ ] Postpay preview/charge/delivery policy and risk accepted.
- [ ] Event envelope compatibility and NS original event consumers audited.
- [ ] Provisional schemas, catalog updates, independent application test plan, migration/rollback signed off.

**Approval state:** NOT READY to publish as the active platform contract; ADR approval is prerequisite.
## 11. Mercur implementation adapter (conditional; NOT selected by this ADR)

Numeria Place Notion `PoC 00 — Mercur × AWS Security Preflight (2026-10-13)` considers a Mercur/Medusa-based marketplace hosted in an isolated AWS environment; actual testing and acceptance are outstanding.

- If Mercur is selected, **Mercur's commerce/order/payment records are the NP transaction system of record** (not a parallel, competing custom NP ledger). An adapter publishes the same platform-neutral NP events and runs the same NS integration commands.
- If Mercur is not selected, NP may implement an equivalent commerce backend, but consumers must not depend on Mercur-specific identifiers or API shapes. Keep `sourceOrderId` namespaced with a source and provider mapping.
- Mercur's documented Stripe Connect method uses Separate Charges and Transfers, and its manual payment authorization/capture lifecycle may be unsuitable for readings that take many days. Verify the version and actual payment provider implementation in the isolated PoC; do not assume a Stripe authorization can be held indefinitely.
- A **prepaid** reading may require verified capture *before* lengthy appraisal starts; capture after an authorization hold expires is not a safe default.
- **Full postpay** is a separate purchase flow and cannot be simulated by keeping a long-lived manual-capture authorization open. The buyer must explicitly authorize and complete a later payment; text preview and PDF release are distinct entitlements.
- Verify transfer reversal / refund reconciliation after funds have been transferred, without assuming that refunding the charge always reverses the seller transfer.
- Run multi-tenant access, private-PDF, webhook replays, refund/reversal, NS Business revocation and GE projection tests on an isolated AWS Tokyo sandbox using synthetic customers and test Stripe accounts only.
- Do not deploy Mercur or alter the existing NS / GE production routes until PoC acceptance criteria pass.

Reference: https://app.notion.com/p/3f8e71121fed81139c45dc3353e6a948