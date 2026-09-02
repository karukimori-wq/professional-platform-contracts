# Free / Pro / Business Plan Migration Guide

Use this guide when adding plan support to platform applications.

## Sequence

1. Read `docs/contracts/plan-contract.md`.
2. Add canonical `PlanId`: `free`, `pro`, `business`.
3. Add `SubscriptionStatus`: `trialing`, `active`, `past_due`, `canceled`, `expired`.
4. Default existing users to `free`.
5. Add server-side entitlement checks.
6. Add usage counters and periods.
7. Add limit-reached error responses.
8. Add plan events.
9. Add readiness checks.
10. Verify Source of Truth boundaries.

## Numeria Studio

- Free: 20 appraisals per month and 3 appraisal subjects.
- Pro: appraisal and appraisal subject limits removed.
- Business: future cross-app integration only.

Do not turn Numeria appraisal subjects into canonical Customer master data.

## Velvet

- Free: 30 customers, 3 months of history visibility, one-record-at-a-time review.
- Pro: unlimited customers, indefinite history, integrated timeline, event-based history.
- Business: future reservation, sales, appraisal, and SNS integration.

Do not move Reservation, Payment, or Sales ownership into Velvet.

## Business

Business must be hidden, disabled, or marked as coming soon in the first Free / Pro release.

Business APIs must reject access when Business is not active.

## Readiness Checklist

- Plan IDs use only `free`, `pro`, `business`.
- Existing user fallback is `free`.
- Entitlement checks run server-side.
- Usage limits are enforced server-side.
- Business cannot be purchased.
- Numeria and Velvet Pro are independent.
- `workspaceId + userId / ownerUserId` is preserved.
- `professionalId` is not required for MVP.
- Source of Truth boundaries remain unchanged.
