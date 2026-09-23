# SaaS Subscription Contract

This contract defines the canonical ownership and cross-application API boundary for Professional Platform SaaS subscriptions.

## Scope

This contract applies to subscriptions purchased by the professional user to use platform products such as Numeria Studio Pro or Velvet Pro.

It does **not** redefine the business customer's reservation/payment/sales domain. Customer payments for appointments, appraisals, services, refunds, and sales remain Growth Engine business-domain Payment/Sales records.

## Canonical ownership

Growth Engine is the canonical platform billing owner for SaaS subscription payment and subscription entitlement state.

Stripe is the external payment processor. Stripe raw objects and card/payment credentials are not application-domain source-of-truth records and must not be copied into product applications.

Professional applications such as Numeria Studio and Velvet may keep only a minimum owner-scoped entitlement projection required for fast feature gating and resilience.

AI Platform Core is not the subscription source of truth. It consumes the effective `planId` and capability/usage context supplied through the contracted app/runtime path.

Platform Admin may monitor subscription readiness/status metadata but must not store payment details or become the subscription source of truth.

## Product independence

Numeria Studio Pro and Velvet Pro are independent subscription products.

Canonical product codes:

- `numeria-studio`
- `velvet`

A subscription to one product must not silently unlock the other.

Business remains unavailable for normal-user purchase until the Business release contract is explicitly activated.

## Subscription state

Canonical response fields:

- `workspaceId`
- `ownerUserId`
- `productCode`
- `planId` (`free` | `pro`)
- `subscriptionStatus` (`trialing` | `active` | `past_due` | `canceled` | `expired`)
- `entitlementStatus` (`active` | `inactive` | `past_due` | `canceled`)
- `validUntil` (optional ISO-8601 timestamp)
- `entitlementRef`
- `updatedAt`

Applications must default to `free` when no valid Pro entitlement exists.

`past_due` grace behavior is product-specific and must be explicit. It must not be interpreted as fully active by accident.

## Synchronous API contract

### `Subscription.GetEntitlement`

Owner: Growth Engine

Consumers: Numeria Studio, Velvet, future Professional Studio products

Input:

- `workspaceId`
- `ownerUserId`
- `productCode`
- `traceId` / `correlationId` / `requestId` when available

Response:

- the canonical subscription state fields above

The response must never contain:

- card numbers
- payment method details
- raw Stripe Customer / Subscription / Checkout objects
- Stripe Secret
- webhook secrets
- invoice bodies
- unrelated Customer master data
- reservation/payment/sales records

### `Subscription.CreateCheckout`

Owner: Growth Engine

Input:

- `workspaceId`
- `ownerUserId`
- `productCode`
- approved `priceCode` or server-resolved price reference
- `successReturnRef`
- `cancelReturnRef`
- observability metadata

Response:

- `checkoutRef`
- hosted `redirectUrl`
- `productCode`
- requested plan (`pro`)

Product applications must not receive card details.

### `Subscription.RefreshEntitlement`

Owner: Growth Engine

Used after checkout return or webhook processing when an application needs a fresh entitlement projection.

Input:

- `workspaceId`
- `ownerUserId`
- `productCode`
- observability metadata

Response:

- the same canonical subscription state returned by `Subscription.GetEntitlement`

## Stripe webhook rule

Stripe webhook verification and translation into subscription entitlement state belongs to Growth Engine.

Professional applications must not expose independent Stripe webhook endpoints for the same SaaS subscription product.

Growth Engine may persist provider references such as Stripe customer/subscription IDs internally when required for reconciliation, but must not return raw provider objects to Numeria Studio or Velvet.

## Application projection rule

Numeria Studio / Velvet may cache a projection containing only:

- `workspaceId`
- `ownerUserId`
- `productCode`
- effective `planId`
- `subscriptionStatus`
- `entitlementStatus`
- `validUntil`
- `entitlementRef`
- projection `updatedAt`

A projection is not a payment ledger and must not contain amount, card, invoice, Stripe secret, or raw payment-provider payloads.

When the canonical entitlement source is reachable, server-side plan checks must prefer the canonical response over an app-local test switch.

Local plan switching is allowed only in explicitly marked development/test mode and must be disabled for normal Production users once the canonical subscription source is enabled.

## Events

Canonical plan lifecycle event:

- `plan.subscription.changed.v1`

Minimum fields:

- `appId`
- `appVersion`
- `workspaceId`
- `userId` / `ownerUserId`
- `productCode`
- `planId`
- `subscriptionStatus`
- `entitlementStatus`
- `entitlementRef`
- `correlationId`
- `occurredAt`

Do not include payment details, raw Stripe objects, full professional content, API keys, or secrets.

## Numeria Studio release rule

For Numeria Studio Free / Pro release:

- `productCode = numeria-studio`
- no valid entitlement => `planId = free`
- valid active Pro entitlement => `planId = pro`
- Business must not be returned as purchasable or active through this release flow
- Numeria feature gates use the effective plan resolved from the Growth Engine entitlement response
- Numeria must not persist Stripe/payment source-of-truth data

## Velvet release rule

For Velvet Free / Pro release:

- `productCode = velvet`
- no valid entitlement => `planId = free`
- valid active Pro entitlement => `planId = pro`
- Business must not be returned as purchasable or active through this release flow

## Security and observability

Internal Cloudflare-hosted application calls should prefer Service Binding where available.

Public HTTP fallback may be used only with an authenticated integration contract.

Record:

- source app
- target app
- operation
- `workspaceId`
- `ownerUserId`
- `productCode`
- `planId`
- status / status code
- trace/correlation/request IDs
- duration

Never log secrets, payment credentials, card data, or full Stripe payloads.
