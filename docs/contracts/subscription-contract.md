# SaaS Subscription / Billing Responsibility Contract

This contract separates Stripe-backed payment domains for the Professional Platform.

It supersedes any interpretation that makes Growth Engine the canonical owner of every Stripe or Billing concern.

## Two Payment Domains

| Domain | Payer | Payee / purpose | Canonical owner | Release scope |
| --- | --- | --- | --- | --- |
| SaaS Subscription | Professional application user | Pays AITEC for app access such as Numeria Studio Pro or Velvet Pro. | The subscribed application until a shared Billing service is created. | Free / Pro release scope. |
| Business Payment | Professional's customer | Pays the professional for appraisal, consultation, reservation, or service fees. | Growth Engine. | Future Business scope. |

Stripe may be used by both domains, but Stripe usage does not make the domains share ownership, data models, webhooks, or source-of-truth records.

## SaaS Subscription Ownership

SaaS Subscription includes:

- Free to Pro upgrade.
- Pro monthly subscription.
- Subscription renewal.
- Payment state reflected into subscription status.
- Cancellation.
- Payment failure.
- Downgrade or fallback to Free.

Numeria Studio owns the Numeria Studio SaaS subscription path for the Free / Pro release.

Velvet owns the Velvet SaaS subscription path when Velvet Free / Pro subscription is released.

Future Professional applications may own their own SaaS subscription path, while preserving this shared contract and keeping an extraction path toward a common Billing module or Billing service.

Applications must not invent local plan names or subscription statuses. They must use the shared Plan Contract values for `PlanId`, `SubscriptionStatus`, `Entitlement`, `UsageLimit`, `UsagePeriod`, and `FeatureKey`.

## Numeria Studio Release Rule

For the Numeria Studio Free / Pro release, the required flow is:

`Numeria Studio user -> Stripe -> Pro Subscription established -> shared Plan Contract -> planId=pro / Entitlement -> Pro features unlocked`

Rules:

- `productCode = numeria-studio`.
- Existing users default to `planId = free` unless a valid Pro subscription says otherwise.
- `trialing` and `active` can unlock Pro entitlement.
- `past_due` behavior must be explicit and server enforced.
- `canceled`, `expired`, or no valid subscription falls back to Free.
- Server-side entitlement checks are required; UI gating alone is not enough.
- Business must not be purchasable or active in this release path.
- Numeria must not persist raw Stripe objects, card data, payment details, Stripe Secret, webhook secrets, or customer-facing Business Payment records.

Current Numeria Studio Pro commercial setting:

- Pro: 2,980 JPY excluding tax.

Pricing is commercial configuration, not the identity of the plan. Code and contracts must key behavior from `productCode`, `planId`, `SubscriptionStatus`, `Entitlement`, and `FeatureKey`, not from a hard-coded price.

## Velvet Release Rule

For Velvet Free / Pro:

- `productCode = velvet`.
- Velvet Pro is independent from Numeria Studio Pro.
- Existing users default to `planId = free` unless a valid Velvet Pro subscription says otherwise.
- Business remains unavailable until the Business release contract is activated.
- Velvet must not use Growth Engine Payment/Sales as the source of truth for Velvet Pro entitlement.

## Identity Mapping

SaaS subscription records must be safely scoped by:

- `workspaceId`.
- `userId` / `ownerUserId`.
- Auth provider user reference, for example Clerk user ID where used by the app.
- Stripe Customer reference.
- Stripe Subscription reference.
- `productCode`.

Stripe references may be stored by the owning SaaS application or a future shared Billing service for reconciliation. They must not be exposed to unrelated apps as raw provider objects.

`professionalId` is not required for the MVP billing contract.

## Webhook Responsibility

SaaS subscription webhooks belong to the app that owns that SaaS subscription until a common Billing service is introduced.

- Numeria Studio owns Numeria SaaS subscription webhook handling for the Free / Pro release.
- Velvet owns Velvet SaaS subscription webhook handling when Velvet Pro billing is released.
- Growth Engine owns customer-facing Business Payment webhook handling.

Webhook handlers must verify signatures, apply idempotency, translate provider events into canonical subscription state, and avoid logging secrets or raw payment payloads.

## Business Payment Boundary

Business Payment covers the future flow where a professional's customer pays for appraisal, consultation, reservation, or other service fees.

Growth Engine remains Source of Truth for:

- Customer.
- Reservation.
- Payment.
- Sales.
- Public Site.
- Business plan workflow.
- Customer-facing Stripe payment and reconciliation.

Business Payment is not part of the Numeria Studio / Velvet Free + Pro release.

Numeria Studio and Velvet must not copy Growth Engine Payment or Sales data into their own canonical models. They may exchange reference IDs only under the Growth Engine boundary contract.

## State Mapping

Canonical subscription state must map into the shared plan contract:

| Stripe / provider result | Canonical `SubscriptionStatus` | Effective plan rule |
| --- | --- | --- |
| Valid trial | `trialing` | May unlock `pro` if the product allows trial access. |
| Valid paid subscription | `active` | Unlocks `pro`. |
| Payment issue requiring action | `past_due` | App-specific grace behavior; must not be treated as fully active by accident. |
| Canceled subscription | `canceled` | Fallback to `free` unless paid-through access is explicitly retained until `validUntil`. |
| Ended trial or ended paid-through period | `expired` | Fallback to `free`. |
| Missing subscription | `expired` or app-local no-subscription state | Default to `free`. |

## Safe Data Sharing

Platform Admin may monitor only readiness and metadata:

- `appId`.
- `workspaceId`.
- `userId` / `ownerUserId`.
- `productCode`.
- `planId`.
- `subscriptionStatus`.
- entitlement readiness.
- webhook readiness.
- last sync or update timestamp.
- status / error category.
- trace, correlation, or request IDs.

AI Platform Core may receive `planId`, `featureKey`, entitlement result, and usage metadata for AI gating. It must not receive card details, raw Stripe payloads, or payment secrets.

Feedback Hub may classify billing-related user reports, but must not store card data, Stripe secrets, payment details, or raw provider payloads.

## Forbidden Cross-App Payloads

Do not send unrelated apps:

- Card numbers or payment method details.
- Raw Stripe Customer / Subscription / Checkout / Invoice objects.
- Stripe Secret.
- Webhook secret.
- Full invoice bodies.
- Customer master full records.
- Reservation, Payment, or Sales ledgers outside Growth Engine's Business Payment contract.
- API keys or secrets.

## Required For Free / Pro Release

Before Numeria Studio Free / Pro release:

- Numeria Studio owns the Pro SaaS subscription flow.
- Clerk/user identity, `workspaceId`, and Stripe Customer/Subscription references are safely mapped.
- Stripe subscription status is translated into shared `SubscriptionStatus`.
- `planId=pro` and Pro entitlements are unlocked only from valid subscription state.
- Free fallback is defined for canceled, expired, missing, or invalid subscriptions.
- Server-side plan and usage enforcement is implemented.
- Growth Engine Payment/Sales is not used for Numeria Pro entitlement.

Velvet follows the same shared contract when Velvet Pro billing is released.

## Deferred To Business Release

The following remain Business / Growth Engine scope and are not required for the current Free / Pro release:

- Customer-facing appraisal or service payments.
- Reservation-linked checkout.
- Refund workflow for customer payments.
- Sales ledger and revenue reporting.
- Growth Engine Payment/Sales production flows.
- Cross-app Business plan payment workflows.

## Future Shared Billing Service

A common Billing module or Billing service may later own SaaS Subscription operations for multiple apps. Until that exists and is explicitly contracted, each subscribed app owns its SaaS subscription path while using this shared contract.

Such extraction must preserve:

- Shared `PlanId` and `SubscriptionStatus` semantics.
- Per-product independence.
- Server-side entitlement enforcement.
- Separation from Growth Engine Business Payment.
- Secret and payment-data minimization.
