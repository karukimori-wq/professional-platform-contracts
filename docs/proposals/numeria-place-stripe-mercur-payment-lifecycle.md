# P0 Decision Review: Mercur + Stripe Connect Payment Lifecycle (2026-10-19)

**Status:** Technical recommendation for review. No Stripe production credentials, seller accounts, NP/Mercur services or live payments have been configured.


## Approved product direction versus open implementation choice

The Numeria Place Notion "04" v1.2/v1.3 records **the individual fortune teller as contractual seller, one order/one seller, and Direct charges as the first candidate**, including a connected-account invoice for full postpay. The underlying Stripe Connect charge model is **not yet finally approved**. This direction takes precedence over Mercur's default Separate Charges and Transfers implementation.

- **Option A (first-choice target): Direct charges** on each seller's Stripe connected account. The seller is the Stripe Merchant of Record and ordinarily bears payment fees/refund/chargeback deductions; platform collects application fees. Stripe Invoicing supports invoices under connected accounts with their own Stripe Customer references. NP/NS/GE do not receive card details. However, the NP platform's overall negative-balance liability depends on Connect account/loss-responsibility settings and cannot be assumed away.
- **Option B (Mercur-native technical alternative): Separate Charges and Transfers.** Mercur's documented default makes NP platform MoR unless the payment is explicitly configured with an appropriate `on_behalf_of` setting and Stripe capability; under this type, the platform still bears charge/refund/dispute balance exposure. Validate both Stripe acceptance and legal display. NP sends funds to sellers via separate Transfers.
- **Decision gate:** First estimate the Mercur/Medusa changes needed for Direct charges end-to-end (account-context Checkout, seller-scoped invoices and customer IDs, webhook routing, fees, order completion, payout, refunds/disputes). Compare with building a compatible custom commerce adapter, and get Stripe/Japan legal acceptance before committing to Option B.

Official refs: https://docs.stripe.com/connect/charges ; https://docs.stripe.com/connect/merchant-of-record ; https://docs.stripe.com/connect/invoices .

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

## Proposed PREPAID flow (Direct first; Mercur-native alternative requires changes)

1. NP creates an order and immutable product/price/fulfillment snapshot.
2. Buyer explicitly pays using connected-account Direct charge (preferred), or a platform charge in the reviewed Mercur-native alternative. Confirm `stripeAccountId` and seller/order mapping server-side; only provider-confirmed payment permits prepaid fulfillment.
3. Capture the customer's prepayment promptly after the checkout/order is safely established. Under Direct, replace/adapt Mercur's default payment integration to charge within the connected-account context. Under Mercur Separate, adapt the capture workflow after safe order-group creation instead of waiting days for report fulfillment; changing `capture:true` alone is not proven safe.
4. Mark payment as `paid` only after confirmed capture (or confirmed success of an eligible asynchronous payment method). Queue NP-only manual work or Business-eligible NS work.
5. NS finalizes Report. NP checks buyer identity, order rights, report version and refund/hold state, and delivers.
6. **Direct:** the seller's connected account receives the charge balance and Stripe handles payout according to its schedule; there is no NP-created seller Transfer to delay. **Separate:** NP schedules and reconciles seller Transfer based on approved terms; bank payout is yet another state. Do not promise that direct-charge cash is held until reading delivery.
7. **Direct:** seller-balance refund and optional application-fee refund must be reconciled. **Separate:** charge refund and seller Transfer reversal are separate and reversal failure stays visible.

**Why:** A limited manual-authorization window is inadequate for many custom readings. In Direct charges the seller account ordinarily bears initial fee/refund/chargeback deductions (the platform's additional loss liability depends on account settings). In Separate charges NP carries charge/refund/dispute exposure; that difference drives the final design.

## Proposed FULL POSTPAY flow (no long-lived card authorization)

1. NP creates `paymentMode=postpay`, `paymentState=not_started`, and an accepted order with explicit seller opt-in and buyer conditions. No stale PaymentIntent authorization.
2. General NP seller manually creates a report, or a Business seller receives an authenticated NP→NS work request *before payment* because that seller opted into postpay.
3. NS finalizes a formal Report or NP seller uploads their own file. NP exposes **authenticated full-text preview only**; the buyer cannot download a PDF yet.
4. Buyer clicks `Pay`, creating a **fresh** Checkout/PaymentIntent under NP, with the frozen order amount and seller reference. The buyer must actively authenticate and pay; there is no assumed future automatic charge.
5. Only Stripe-confirmed `paid` changes `deliveryState` to `download_available`. NP releases signed PDF access after rechecking buyer identity and refund restrictions.
6. The seller accepts the risk that a buyer can copy or screenshot the text without paying. Track preview views, reminders, order expiry and manual cancellation separately; seller terms must disclose nonpayment risk.

**Rule:** Mercur's manual capture flow is **not** reused as a week-long postpay reservation. Build a distinct order/workflow and treat the ability to view full text before payment as a product choice, not a payment guarantee.

## Refund and seller transfer cases (Separate charges); Direct uses seller-account refunds

| Scenario | Customer refund | Seller transfer | NP outcome |
| --- | --- | --- | --- |
| Prepaid cancel before work/transfer | Stripe refund + NP audit | No transfer | `refunded`; NP delivery revoked if policy requires |
| Prepaid refund after completed work but before transfer | Stripe refund if terms allow | No transfer | explicit final liability decision |
| Refund after seller transfer | Stripe refund | Separate Transfer reversal or later offset | Keep transfer reversal pending until actually reconciled |
| Partial refund | partial Stripe refund | proportionate reversal/offset under seller terms | Separate refundRef and reversalRef; no double count |
| Dispute / chargeback | Stripe dispute workflow | recover from seller where contract permits | platform risk and reserve policy needed |
| Postpay buyer never pays | no refund, no charge | no transfer | preview may already have been seen; seller accepts risk |

**Event semantics:** `commerce.payment.refunded.v1` is NOT proof of seller Transfer reversal under Separate. Under Direct, there may be no seller Transfer to reverse, but application-fee refund and connected-account balance liability need separate reconciliation.

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

**Recommendation:** Evaluate Mercur as an OSS candidate, with **Direct charges as the preferred business design**, not as an approved production dependency. Confirm whether Mercur customization is worth its cost compared with another payment adapter. No G0 acceptance or G1 release claim until the above gates pass.
