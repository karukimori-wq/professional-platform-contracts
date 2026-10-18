# ADR 0002 (PROPOSED): Channel-scoped Commerce Ownership for Numeria Place

## Status

Proposed — NOT adopted; existing live contracts and application code remain authoritative until a major-version migration is approved.

## Context

Current architecture and `docs/contracts/app-responsibilities.md`, `docs/contracts/data-ownership.md`, `docs/contracts/platform-boundaries.md`, and `docs/contracts/plan-contract.md` assign customer-facing Business Payment, Payment, Sales, and most publishing duties to Growth Engine (GE).

The new product model has three distinct purchases:

1. Numeria Place (NP): customers buy a third-party fortune-teller's product from NP. The seller is the fortune teller; NP owns the marketplace order and Stripe Connect integration.
2. Numeria Studio (NS) official AI reading: a customer buys a Numeria-operated product at `/ai-reading` through ordinary Stripe integration owned by NS.
3. SaaS subscription: a professional pays for NS Free/Pro/future Business access. This is NOT an end-customer divination purchase.

Existing `docs/contracts/subscription-contract.md` explicitly says the subscribed app owns the SaaS subscription until a separately contracted shared Billing service is introduced. This conflicts with the recent Numeria Place Notion design's assumption that GE already owns NS SaaS subscriptions. Preserve the existing GitHub contract pending a deliberate billing decision; do not silently move SaaS ownership to GE.

## Proposed decision

- A selling application is the **canonical transaction owner** of the customer-facing orders, product price snapshots, payment/refund state, merchant/provider references, fee and transfer records for sales it executes.
- NP owns seller/shop/listing, marketplace ordering, payment and Stripe Connect, refunds, sales-channel attribution, fulfillment release, and buyer entitlement. NP supports sellers independently of NS subscriptions.
- NS owns only its **official** `/ai-reading` customer-sale order/payment state, plus every NS divination calculation, Session, Character, formal Report/Report Snapshot and PDF. NS does not own marketplace purchase or payout records.
- GE remains canonical for the shared **Customer** master and cross-application customer/transaction reporting projection (and retains any independently contracted GE-owned sales and reservation flows). It must not duplicate NP's or NS's payment ledger as canonical state.
- AI Platform Core remains canonical for AI runtime, prompts, knowledge versioning, usage/activity; it does not become the order or Report owner.
- The source app's records are the reconciliation authority. GE must recover from missed event delivery by replay and source-side status query.
- Existing SaaS subscription ownership remains with the subscribed app according to `subscription-contract.md` until a separate explicit billing ADR changes it.
- Formal adoption requires a **major contract version**, updates to all conflicting contract files, schema/test changes, and per-repository rollout. Until then this is design only.

## Seller tiers and entry points

- NP has no NS Business plan prerequisite for seller registration. A general seller uploads their own PDF or manually fulfills via NP email/dedicated forms.
- NS Business *enables integration*, not the right to be a seller. Business subscription does not auto-create a published NP shop.
- An NS Business seller can connect an existing NP shop or onboard a new shop after server-side ownership verification.
- Marketplace shop `/p/{publicSlug}` and Business-only personal landing page `/lp/{publicSlug}` both point to one NP listing/order/checkout; `salesChannel` records acquisition path.
- All NP customer payments are handled by NP's Connect platform, even when the purchase originates at the Business landing page.
- NS `/app` remains the practitioner's workbench; `/ai-reading` remains separate from NP and handles Numeria's own AI-reading sales.

## Payment and delivery decision boundaries

- Default prepaid order: Stripe-signed event confirms paid, NP triggers NS Session only for a seller with an active, authorized link/entitlement, NS finalizes Report, NP authenticates buyer and releases delivery.
- The previously planned NP **full postpay** mode needs its own lifecycle: a buyer may see the completed reading text after authorization before paying, but may not download the PDF before verified settlement. No postpay automatic charging without customer authorization. Full text can be copied/screen-captured; product/legal policy must acknowledge this risk.
- `orderId` is not an authorization token. NP must recheck seller/workspace/order ownership, delivery entitlement, cancellation/refund status and buyer identity on every retrieval.
- Do not send the full consultation, birth details, report text/PDF, connected-account secrets, raw Stripe payloads or card data to GE. For AI generation, scoped professional inputs may go from NS to APC per the AI contract.
- NS stores formal Report; NP can store minimum delivery/access metadata and only temporary protected rendering artifacts where essential and explicitly contracted.
- Business downgrade/termination stops **new** automated NS requests, but existing paid or accepted commitments must complete or be manually transferred/refunded in NP. NP shop and historic buyer access are not deleted.

## Options considered

**Keep all commerce in GE:** simplest centralized finance rules; breaks per-marketplace Connect isolation, couples every new product to GE.

**Separate commerce owners with no GE projection:** good isolation; poor cross-app customer analysis and audit.

**Channel-scoped commerce owner + GE projection (preferred):** independent payment accounts, lower blast radius, single cross-app customer view; requires canonical event contracts, reconciliation, shared authorization and integration tests.

## Consequences and compatibility

- This is a **breaking ownership change** for future NP and NS official customer sales compared with several current docs. It does not automatically migrate any existing GE order/payment or SaaS plan records.
- Split event families into professional/session events and seller-commerce events; do not reinterpret `studio.report.generated.v1` as a delivery-authorization event without checking prior consumers.
- Support future Studio products through source-app scoped identifiers (`sourceApp`, `sourceOrderId`) rather than hardcoding NP-specific IDs into GE.
- Draft contracts and required validation are in `docs/proposals/numeria-place-commerce-contract-v1.md`.

## Approval gates before Accepted

- [ ] Identify the actual operator/merchant of record in Japan, refund/chargeback responsibility, Connect account model and seller agreement.
- [ ] Resolve NS SaaS Billing owner against the Notion 07/09 documents (existing GitHub contract currently says NS, not GE).
- [ ] Approve prepaid and full-postpay order lifecycle, refund conditions, buyer access policy, and fee rules.
- [ ] Update `app-responsibilities`, `data-ownership`, `platform-boundaries`, `architecture`, `plan-contract`, `subscription-contract` and any affected docs *consistently* in a major-version change.
- [ ] Publish v1 schemas, API/events catalog, privacy tests, tenant authorization tests and idempotency/reconciliation tests.
- [ ] Run tests and verify cross-app regression in NS, NP and GE on preview before any production migration.
## 2026-10-19 payment-method decision context

The product design in Numeria Place Notion 04 v1.2/v1.3 already identifies each fortune teller as the contractual seller and **Direct charges as the preferred Connect configuration**, with one order per seller. Mercur's default Separate Charges and Transfers is an implementation alternative that requires business-of-record and risk review; do not silently replace the seller-as-MoR requirement with the Mercur default.

If Direct charges are used, card charges and refunds occur in seller connected-account context, application fees accrue to NP, and seller payouts are handled by Stripe account schedule. If Separate charges are used, NP's platform account faces refund and dispute balance exposure, plus separate Transfer reversal reconciliation. No production charge type is finally approved by this proposed ADR.

Technical comparison and PoC requirements: [Stripe / Mercur lifecycle proposal](../proposals/numeria-place-stripe-mercur-payment-lifecycle.md).
