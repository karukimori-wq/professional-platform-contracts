# P0 Decision Review: Mercur + Stripe Connect Payment Lifecycle (2026-10-19)

**Status:** Technical recommendation for review. No Stripe production credentials, seller accounts, NP/Mercur services or live payments have been configured.

## Verified platform constraints

- Mercur's published Stripe Connect integration uses **Separate Charges and Transfers**. The payment provider is Medusa Stripe; the payout provider is Mercur Connect. One customer PaymentIntent is linked to an order group and seller child orders. Reference: https://github.com/mercurjs/mercur/blob/main/apps/docs/resources/integrations/stripe-connect.mdx
- Default Mercur marketplace flow authorizes with `capture:false`, then captures after seller fulfillment or before authorization expiry. Published defaults include authorization window 604800000ms (7d), seller-action window 259200000ms (72h), safety buffer 86400000ms (24h). These are module settings, **not a promise that every Stripe payment method lasts 7 days**.
- Mercur docs now explicitly describe a cart-lock workflow for `payment_intent.amount_capturable_updated` and recommend keeping that webhook. A July 2026 issue about premature split-order creation was closed in September 2026. Pin the Mercur/Medusa version and reproduce the cart completion race in PoC; don't impose an old blanket disable rule.
- Stripe states that with Separate Charges and Transfers, charges and refunds are the platform account's responsibility. A customer refund **does not** reverse prior seller Transfers; the platform needs separate, authorized reversals and reconciliation. Reference: https://docs.stripe.com/connect/charges ; https://docs.stripe.com/connect/separate-charges-and-transfers
- Mercur's docs characterize its platform as Merchant of Record for this integration. **This conflicts with the desired legal model that each fortune-teller sells their own reading.** Merchant identity, invoice display, Stripe terms, tax treatment and Japanese legal obligations require operator/Stripe/legal review. Do not present seller-as-MoR as an implemented fact.

## Channel-scope decision for the NP MVP

- NP uses **one order, one product, one seller** at first, as previously selected. Mercur's multi-seller cart/split-order machinery must not create a second NP order ledger. Its order/group identifiers are mapped to platform-neutral `sourceOrderId`.
- Mercur itself is an OSS *candidate* until PoC 00 passes; adapters isolate its implementation from NS, GE, APC.
- Operate a single NP Stripe Connect platform (managed by NP); the legal seller and business of record need formal approval before live checkout.

## Proposed PREPAID flow (for readings taking days/weeks)

1. NP creates an order and immutable product/price/fulfillment snapshot.
2. Buyer explicitly pays using Stripe Checkout or supported payment form. Only signed, account-checked Stripe state transitions authorize fulfillment.
3. **Capture promptly when the checkout/order group is safely finalized**, rather than deferring capture until an unknown future reading completion. This **requires an explicit Mercur workflow adaptation** and regression tests; `capture:true` alone is not assumed safe.
4. Mark payment as `paid` only after confirmed capture (or confirmed success of an eligible asynchronous payment method). Queue NP-only manual work or Business-eligible NS work.
5. NS finalizes Report. NP checks buyer identity, order rights, report version and refund/hold state, and delivers.
6. Only then schedule seller transfer according to approved seller terms; ensure the customer charge and platform commission are reconcilable to Stripe Transfer and bank payout records.
7. Refund before/after seller transfer must work. Any reversal failures become visible reconciliation exceptions, never quietly completed.

**Why:** A seven-day authorization window is inadequate for many custom readings; capture and *seller settlement* are separate operations. Capturing early also means refund/chargeback cash-flow exposure for NP, which must be priced and contractually supported.

## Proposed FULL POSTPAY flow (no long-lived card authorization)

1. NP creates `paymentMode=postpay`, `paymentState=not_started`, and an accepted order with explicit seller opt-in and buyer conditions. No stale PaymentIntent authorization.
2. General NP seller manually creates a report, or a Business seller receives an authenticated NP→NS work request *before payment* because that seller opted into postpay.
3. NS finalizes a formal Report or NP seller uploads their own file. NP exposes **authenticated full-text preview only**; the buyer cannot download a PDF yet.
4. Buyer clicks `Pay`, creating a **fresh** Checkout/PaymentIntent under NP, with the frozen order amount and seller reference. The buyer must actively authenticate and pay; there is no assumed future automatic charge.
5. Only Stripe-confirmed `paid` changes `deliveryState` to `download_available`. NP releases signed PDF access after rechecking buyer identity and refund restrictions.
6. The seller accepts the risk that a buyer can copy or screenshot the text without paying. Track preview views, reminders, order expiry and manual cancellation separately; seller terms must disclose nonpayment risk.

**Rule:** Mercur's manual capture flow is **not** reused as a week-long postpay reservation. Build a distinct order/workflow and treat the ability to view full text before payment as a product choice, not a payment guarantee.

## Refund and seller transfer cases

| Scenario | Customer refund | Seller transfer | NP outcome |
| --- | --- | --- | --- |
| Prepaid cancel before work/transfer | Stripe refund + NP audit | No transfer | `refunded`; NP delivery revoked if policy requires |
| Prepaid refund after completed work but before transfer | Stripe refund if terms allow | No transfer | explicit final liability decision |
| Refund after seller transfer | Stripe refund | Separate Transfer reversal or later offset | Keep transfer reversal pending until actually reconciled |
| Partial refund | partial Stripe refund | proportionate reversal/offset under seller terms | Separate refundRef and reversalRef; no double count |
| Dispute / chargeback | Stripe dispute workflow | recover from seller where contract permits | platform risk and reserve policy needed |
| Postpay buyer never pays | no refund, no charge | no transfer | preview may already have been seen; seller accepts risk |

**Event semantics:** `commerce.payment.refunded.v1` is NOT proof of seller transfer reversal. Use a separate payout/transfer-reversal state and event; a reversal may fail due to connected account balance.

## Webhook consistency and buyer access

- Confirm Stripe signatures and intended account and amounts, protect webhook deduplication by Stripe event IDs and payment IDs; reject unknown seller/order mappings.
- Current Mercur docs recommend distinct signing secrets for the Medusa payment endpoint and the Mercur payout endpoint. Do not treat their webhooks as interchangeable.
- Event consumer queues should be at-least-once, idempotent with reconciliation/replay. Never automatically create a second payment when a response times out.
- Entitlements: `prepaid` requires paid + Report finalized to view/download; `postpay` allows authenticated full-text preview after report finalization, and paid + Report finalized for PDF. Private file storage and short-lived access.
- NP general seller orders never require NS Business. Business integration requires active authorized seller–workspace link on new intake; existing accepted commitments remain fulfillable after subscription expiry.

## P0 blockers and PoC acceptance

- [ ] Merchant/seller of record and Stripe account/Connect charge type approved, including tax, returns, dispute, liability and Japanese seller disclosure.
- [ ] Verify pinned Mercur release behavior for capture timing, connected-account onboarding, order-group transaction boundary and webhook `amount_capturable_updated` race.
- [ ] Implement/test an **early capture** option and delayed transfer without breaking Mercur's commission/payout invariants.
- [ ] Implement/test **fresh postpay checkout** after Report finalization, including refusal/nonpayment and eventual completion.
- [ ] Test Stripe refund vs Transfer reversal (before/after transfer; full/partial).
- [ ] Test multiple seller/other buyer access denial, PDF private-object authorization, NP↔NS Business link protection.
- [ ] Confirm NS SaaS subscription owner discrepancy separately; no migration implied by this document.
- [ ] Record successful security PoC evidence in Notion 09 / PoC 00. No real customer data in test.

**Recommendation:** Mercur remains the conditional preferred NP commerce base for PoC, not yet an approved production dependency. No G0 acceptance or G1 release claim until above gates are passed.
