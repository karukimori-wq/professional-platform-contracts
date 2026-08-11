# Velvet Billing Contract Proposal

Status: proposed / not yet approved

## Goal
Allow Velvet to sell a Pro subscription and AI point packs without creating a second payment source of truth.

## Responsibility boundary
- Growth Engine remains canonical owner of Payment / paymentStatus / salesAmount / billing transaction state.
- AI Platform Core remains canonical owner of AI usage accounting.
- Velvet may keep only an owner-scoped entitlement projection needed for fast feature gating (`free` / `pro`).
- Velvet must not create an independent canonical payment ledger or AI usage ledger.

## Proposed synchronous operations

### `Subscription.GetEntitlement`
Caller: Velvet  
Owner: Growth Engine

Input:
- workspaceId
- ownerUserId
- productCode = `velvet`
- traceId / correlationId / requestId

Response:
- plan (`free` | `pro`)
- entitlementStatus (`active` | `inactive` | `past_due` | `canceled`)
- validUntil (optional)
- entitlementRef

No card details or raw Stripe objects are returned.

### `Subscription.CreateCheckout`
Caller: Velvet  
Owner: Growth Engine

Input:
- workspaceId
- ownerUserId
- productCode = `velvet`
- priceCode / approved plan reference
- successReturnRef / cancelReturnRef
- traceId / correlationId / requestId

Response:
- checkoutRef
- redirectUrl or equivalent hosted checkout reference

Velvet must not receive or store card details.

### `AiPointPack.CreateCheckout`
Caller: Velvet  
Owner: Growth Engine for payment; AI Platform Core remains usage owner.

Input:
- workspaceId
- ownerUserId
- productCode = `velvet-ai-points`
- pointPackCode
- currentPlan (`free` | `pro`) only when needed for price selection, preferably resolved server-side
- traceId / correlationId / requestId

Response:
- checkoutRef
- redirectUrl or equivalent hosted checkout reference

After successful payment, the approved integration must update the point-accounting state consumed by AI Platform Core. Velvet must not directly mint its own authoritative point balance.

## Pricing policy
- Velvet Pro target price: JPY 10,000/month.
- Free and Pro may purchase AI points.
- Free AI points are priced at a higher unit price than Pro.
- Exact point pack sizes and prices are not defined in this proposal and must not be invented by individual apps.

## Security / privacy
Never exchange:
- card numbers or payment credentials
- raw Stripe/payment-provider objects
- guest/customer private notes
- contact lists
- visit histories
- gift histories
- images

Only owner/workspace/product/payment references and observability metadata required by the operation may cross the boundary.
