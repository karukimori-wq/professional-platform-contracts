# Growth Engine Repository Contract

Growth Engine owns acquisition, sales, customer nurturing, and Business plan workflows.

## Must Implement

- Customer canonical model
- Lead lifecycle
- Acquisition source management
- LINE/SNS relationship references
- Business plan feature gating
- Campaign intent creation
- Nurturing workflow state
- Calls to SNS Planner for draft creation
- Calls to AI Platform Core for AI activities and usage
- Events with `growth.*` prefix

## Must Not Implement

- Fortune-telling calculations
- Report rendering and PDF layout
- SNS post strategy inside SNS Planner
- AI runtime internals
- Duplicate Professional Studio report master

## Billing Boundary

Growth Engine does not own every Stripe or Billing concern.

Growth Engine is the Source of Truth for future Business Payment flows where the professional's customer pays for appraisal, consultation, reservation, or service fees.

Growth Engine owns:

- Customer.
- Reservation.
- Payment.
- Sales.
- Public Site.
- Business plan workflow.
- Customer-facing Stripe payment and reconciliation.

Growth Engine does not own Numeria Studio Pro or Velvet Pro SaaS subscription entitlement. Those Free / Pro subscriptions are owned by the subscribed application until a shared Billing service is explicitly contracted.

Customer-facing Business Payment is not part of the Numeria Studio / Velvet Free + Pro release.

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/identity-contract.md`
- `schemas/entities/customer.schema.json`
- `schemas/events/growth.customer.created.v1.schema.json`
- `docs/contracts/velvet-growth-customer-bridge.md`

## Implementation Note

Growth Engine appears inside Numeria Studio as Business plan features, but it remains a separate responsibility boundary.
