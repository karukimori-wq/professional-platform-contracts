# P0 | Mercur Direct Charges Impact Matrix & Go/No-Go Criteria
**Prepared:** 2026-10-20
**Status:** Evidence-backed source inspection / technical proposal. **No NP, Stripe, or Mercur runtime was changed.**
**Upstream source pinned for assessment:** [mercurjs/mercur @ 9fe557067193e0ad4dd3b7fd37e212f0b352ab3c](https://github.com/mercurjs/mercur/tree/9fe557067193e0ad4dd3b7fd37e212f0b352ab3c).
**Design reference:** Numeria Place Notion 04 v1.2/v1.3 (seller = individual fortune teller, 1 order = 1 seller/product, Direct charges first choice, full postpay text access then paid PDF).

## Executive technical conclusion
Mercur's **standard** split-order payment and Stripe Connect payout flow are designed for platform-account charges plus later **Stripe Transfers**. Numeria Place's **preferred** Direct charges instead charge the **seller connected account** and pay NP an **application fee**. This changes provider account scope, webhook and customer identities, refund liability, payment state and payout handling; switching `capture` alone is insufficient.

Recommended decision: keep Mercur as a **conditional catalog/seller/order candidate**, but run a *time-boxed, isolated proof* for a Direct-charge adapter **before committing to Mercur's entire payment framework**. If its payment subsystem requires invasive ongoing forks, compare Medusa core + narrowly tailored NP commerce adapter or a lean NP-owned order service. Do not build two competing order ledgers in any option.

## Direct charge adaptation: inspected source-level change map
| ID | Upstream code (as inspected) | Verified behavior / why impacted | Direct charge change required | Risk |
|---|---|---|---|---|
| M01 | [`apps/api/medusa-config.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/apps/api/medusa-config.ts) + Medusa payment provider setup described in Stripe docs | Medusa Stripe provider is platform-centric under standard Mercur configuration | Register a seller-scoped payment provider/adapter and give it trusted connected-account context; never trust buyer-supplied acct ID | HIGH |
| M02 | [`packages/core/src/api/store/carts/[id]/complete/route.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/api/store/carts/%5Bid%5D/complete/route.ts) + [`complete-cart-with-split-orders.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/workflows/cart/workflows/complete-cart-with-split-orders.ts) | Cart finalization creates order group and seller-specific orders, and shares initial cart payment collection | Preserve 1 seller/1 item rule; create stable NP sourceOrderId only after safe order creation. Propagate seller account reference to payment safely | HIGH |
| M03 | [`process-payment.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/workflows/payment/workflows/process-payment.ts) + [`payment-webhook.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/subscribers/payment-webhook.ts) | Mercur processes provider actions and may complete split carts from webhooks; handles authorized/successful/autocapture branches | Verify seller-scoped Stripe events and order readiness before granting NP order paid. No duplicate Session creation under races | HIGH |
| M04 | [`split-order-payments.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/workflows/payment/workflows/split-order-payments.ts) + [`split-order-payment-captured.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/subscribers/split-order-payment-captured.ts) | Reconciles a captured **shared** cart charge into per-seller order payments; controls refunds and cancellations | Evaluate whether single-seller Direct can bypass/reuse split workflow without duplicate accounting; maintain Medusa refund compatibility | CRITICAL |
| M05 | [`packages/providers/payout-stripe-connect/src/services/stripe-connect.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/providers/payout-stripe-connect/src/services/stripe-connect.ts) | `createPayout` calls `stripe.transfers.create` to move platform funds to seller | Direct charges MUST NOT also transfer sale proceeds. Replace/disable sale-proceeds Transfer trigger while retaining Connect account onboarding/status only where applicable | CRITICAL |
| M06 | [`create-payout.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/workflows/payout/workflows/create-payout.ts) and [`payout-module-service.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/modules/payout/services/payout-module-service.ts) | Payout workflow calculates seller entitlement and calls provider payout service | In Direct, seller balance and bank payout are Stripe connected-account states; only record/report states. Avoid second transfer | HIGH |
| M07 | [`vendor/payments/[id]/refund/route.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/api/vendor/payments/%5Bid%5D/refund/route.ts) + Medusa refund workflow | Calls shared refund workflow for seller-controlled order payments | Refund the connected-account charge in the correct account context; refund NP application fee separately as policy dictates; check partial refund and webhook dedup | CRITICAL |
| M08 | [`packages/core/src/api/hooks/payment/[provider]/route.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/api/hooks/payment/%5Bprovider%5D/route.ts) + [`payout/route.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/packages/core/src/api/hooks/payout/route.ts) | Separate payment vs payout webhook paths with different consumers | Verify account-scoped signature, event's `account`, and order-seller mapping; explicitly differentiate Direct charge events and Connect account events | CRITICAL |
| M09 | [`integration-tests/http/payment/payment-webhook-cart-completion.spec.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/integration-tests/http/payment/payment-webhook-cart-completion.spec.ts) + [`split-order-payments.spec.ts`](https://github.com/mercurjs/mercur/blob/9fe5570/integration-tests/http/payment/split-order-payments.spec.ts) | Upstream contains tests for cart/webhook and split charge paths | Re-run these plus dedicated Direct tenant/refund/invoice tests pinned to actual provider version | HIGH |
| M10 | **New** NP seller-scoped invoice + Business delivery adapter (not present as turnkey Mercur behavior in inspected files) | Full postpay with buyer full-text web view and later payment is a product-specific workflow | New NP `postpay_invoice` state, seller Stripe Customer mapping, fresh Checkout/Invoice, verified buyer access and PDF release | CRITICAL |

**Risk labels are qualitative engineering-risk assessments, not time/cost estimates.** They are based on source paths and observed behavior; successful Direct integration is not verified.

## Direct charges vs default Separate charges and Transfers

| Dimension | A: Direct (first-choice product requirement) | B: Mercur Separate (OSS-native alternative) |
|---|---|---|
| Stripe charge location | Seller connected account | NP platform account |
| Merchant of record | Seller connected account | Platform by default; on_behalf_of can designate seller as settlement merchant subject to Stripe capabilities/terms |
| NP revenue | Application Fee | Difference between captured amount and Transfers |
| Seller payout | Stripe connected-account schedule; NP does **not** create separate sale Transfer | NP creates/reconciles Transfer; Stripe later pays seller's bank |
| Stripe refunds | Refund scoped to seller account; possibly separate application-fee refund | Platform charge refund separate from seller Transfer reversal |
| Stripe fee / negative-balance exposure | Depends on connected-account configurations/contract; cannot assume NP has no financial liability | Platform bears primary Stripe charge/refund/dispute balance exposure |
| Fit to current NP requirement | Better | Business/legal change and more platform risk |
| Main technical risk | Extensive replacement/adaptation of Mercur payment/payout layer | Long appraisal needs early capture change, postpay still custom, refund/reversal needed |

## Third option evaluation — no false re-platforming shortcuts
**C: Medusa core with direct-charge provider + custom seller/catalog/order authorization** removes Mercur's Transfer-oriented payout pipeline but loses Mercur's prebuilt seller/admin marketplace operations. Integration effort moves from payment fork to building marketplace seller boundaries and UI.

**D: Thin NP-owned commerce (single seller, one order, one reading product) with Stripe Direct** gives the simplest charge topology and postpay state machine but requires development of seller portal, product listing, orders, fulfillment, moderation, audits, search and admin. Do not select without a working authorization/security demonstration.

**Compare A/B/C/D only with measured PoC results; no invented hour/cost commitments.** Mercur's native marketplace admin features can still be valuable, but NP's privacy/security requirements and seller-of-record model are higher priorities.

## Direct payment lifecycle invariants (prepaid/postpaid)
- Server-owned `listingId → sellerId → stripeConnectedAccountId` mapping; immutable order price, plan and fulfillment snapshots. Never accept account ID from checkout body.
- 1 order = 1 seller / 1 product. If Mercur creates an order group, the NP canonical order mapping is explicit; no second mutable payment ledger.
- Buyer prepaid: create connected-account Direct Checkout, verify connected-account event and Stripe account, then mark `paid` exactly once and trigger NP or NS work. **No reliance on Checkout return page.**
- Buyer full postpay: create/accept order without card authorization, finalize/report preview after explicit buyer+seller terms, then issue **fresh** connected-account Checkout or hosted invoice and allow PDF only after provider-confirmed `paid`.
- Refund: refund connected account Charge/PaymentIntent; application fee refund is a separately audited business decision. No Mercur seller Transfer should be executed for Direct.
- Loss reserve, bankruptcy/negative-balance liability, Stripe fee payer and payout schedule must be verified per Connect account model; Direct != guarantee of zero platform liability.
- One and only one purchase execution: `sourceApp + orderId + listingId` maps to one NS Session. Exactly one active downloadable report version per order, with secure reissue.
- Refund/chargeback may revoke future PDF **download access** under documented policy, but cannot remotely erase already saved files.
- GE only receives financial projection allowlisted fields; no full report, birth details, payment method or bank account.

## PoC test matrix (all use synthetic identities and Stripe test-mode)
| Test | Scenario | Pass gate |
|---|---|---|
| D01 | Seller A Direct pay, fee and seller Dashboard ledger | Charge/account A, fee NP once, exact NP order mapping |
| D02 | Malicious request tampers `sellerId`, `stripeAccountId`, `orderId` | Reject and never create a charge on seller B |
| D03 | Retry checkout request and duplicate/concurrent webhook | One order, one succeeded payment, one NS Session |
| D04 | Payment webhook arrives before cart completion | No orphan charge/order; eventual reconciliation succeeds |
| D05 | Buyer cancels before capture / cancels after capture | Correct void/refund without orphan seller balance |
| D06 | Full/partial seller-account refund | NP order, Stripe Charge, application fee and GE projection agree |
| D07 | Payment dispute/negative balance | Correct owner and alerting for Stripe account model |
| D08 | Business seller linked vs NP-only seller | Only Business submits NS request; NP-only still works |
| D09 | Finalized postpay full-text preview without payment | Authenticated buyer can view text; PDF denied |
| D10 | Postpay fresh seller invoice + payment | Paid confirmation unlocks PDF once, including webhook retries |
| D11 | Postpay nonpayment / cancellation | No phantom paid status; seller risk and dispute policy visible |
| D12 | Seller A/buyer X attempt to fetch seller B/buyer Y report | 403, no private file URL revealed |
| D13 | Business downgrade with outstanding order | New integrations blocked; past order completed/refunded via controlled exception |
| D14 | NP or GE unavailable, queue retry and reconciliation | No double charge/order, eventual financial projection consistency |
| D15 | Alternate platform Separate charge | Platform refund and Transfer reversal reconciled separately, if B is pursued |
| D16 | Refund after transfer (Separate only) | Reversal failure remains open incident; never marked settled |

## Decisions required before G0
- [ ] Legal seller/merchant-of-record and Japanese tax/specified-commercial-transaction presentation approved.
- [ ] Stripe Connect account type and responsibilities chosen (Direct fees/losses, account access, Japan capabilities).
- [ ] Direct feasibility test against pinned Mercur version: M01–M10, D01–D14 with reproducible trace/artifacts.
- [ ] Refund policy for manual/AI readings, prepay/postpay and application fees; no payment until approved.
- [ ] Operational cost/maintainability comparison of A vs C/D (B only if merchant identity and liability are acceptable).
- [ ] Shared SaaS Pro/Business subscription canonical owner discrepancy resolved separately.
- [ ] Contract major version, schemas, tests and app migration prepared; draft PR does not mark G0 complete.

## Sources
- [Mercur Stripe Connect documentation](https://github.com/mercurjs/mercur/blob/9fe557067193e0ad4dd3b7fd37e212f0b352ab3/apps/docs/resources/integrations/stripe-connect.mdx)
- [Stripe Connect charge types](https://docs.stripe.com/connect/charges)
- [Stripe Separate Charges and Transfers](https://docs.stripe.com/connect/separate-charges-and-transfers)
- [Stripe Direct Checkout migration example](https://docs.stripe.com/payments/checkout/migration?locale=ja-JP)
- [Stripe Connect invoices](https://docs.stripe.com/connect/invoices)
- [NP Notion 04](https://app.notion.com/p/3f7e71121fed815b91a5ca543a44fc95)
- [P0 Draft PR](https://github.com/karukimori-wq/professional-platform-contracts/pull/4)
