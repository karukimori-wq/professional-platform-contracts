# Free / Pro / Business Plan Contract

This contract is the platform-wide source of truth for plan identifiers, entitlement checks, usage limits, and plan-related events.

Applications must not invent independent plan names or incompatible entitlement semantics.

## Canonical Types

| Type | Allowed values / meaning |
| --- | --- |
| `PlanId` | `free`, `pro`, `business` |
| `SubscriptionStatus` | `trialing`, `active`, `past_due`, `canceled`, `expired` |
| `Entitlement` | A server-evaluated permission for a `FeatureKey` under a `PlanId`. |
| `UsageLimit` | A plan-scoped limit such as monthly appraisal count or customer count. |
| `UsagePeriod` | The reset or measurement period for usage, for example `monthly`, `rolling_3_months`, or `lifetime`. |
| `FeatureKey` | Stable string key used by apps and AI Platform Core to evaluate access. |
| `PlanChangedEvent` | Event emitted when a subscription or effective plan changes. |
| `UsageLimitReachedEvent` | Event emitted when server-side enforcement denies or warns on limit exhaustion. |

## Global Rules

- Canonical plan IDs are `free`, `pro`, and `business`.
- Pricing must not be hard-coded in this contract.
- Existing users default to `free` unless a valid subscription says otherwise.
- Plan limits must be enforced server-side, not only hidden in the UI.
- MVP identity remains `workspaceId + userId / ownerUserId`.
- `professionalId` is not a required MVP dependency.
- Numeria Studio Pro and Velvet Pro are separately purchasable products.
- Business is not purchasable in the first Free / Pro release.
- Business is a future cross-application business plan, not a larger Pro tier.
- Domain Source of Truth ownership does not change because of plan enforcement.

## Subscription Status

| Status | Meaning |
| --- | --- |
| `trialing` | Trial access is active. |
| `active` | Paid or valid plan access is active. |
| `past_due` | Billing issue exists; grace-period behavior must be explicit per app. |
| `canceled` | Subscription has been canceled. |
| `expired` | Trial, grace period, or time-limited access has ended. |

## Numeria Studio Plans

Numeria Studio owns appraisal sessions, reports, appraisal logic, calculation results, and Numeria snapshots. Customer master data must not be copied into Numeria as canonical Customer data.

| PlanId | Entitlements | Limits | Notes |
| --- | --- | --- | --- |
| `free` | Basic appraisal, basic report, appraisal history, basic templates, free-tier AI assistance. | 20 appraisals per month; 3 appraisal subjects. | PDF and branded reports are out of Free scope. |
| `pro` | Unlimited appraisal usage and appraisal subject management within Numeria scope. | No Numeria-specific appraisal or appraisal-subject limit. | Pro is independent from Velvet Pro. |
| `business` | Future Growth Engine and cross-app business integration. | Not purchasable in current release. | Business must not be exposed as available until implemented. |

Numeria appraisal subject information is a Numeria-owned snapshot for appraisal workflows. It is not the canonical Customer master.

## Velvet Plans

Velvet owns relationship, conversation, event, visit, note, timeline, recall, and next-action memory for the professional. Velvet does not own Sales, Reservation, or Payment truth.

| PlanId | Entitlements | Limits | Notes |
| --- | --- | --- | --- |
| `free` | Basic customer memory and per-record history review. | 30 customers; 3 months of history visibility; records are opened one by one. | Integrated timeline is not part of Free. |
| `pro` | Unlimited customers, indefinite history, integrated timeline, event-based history. | No Velvet-specific customer or history duration limit. | Pro is independent from Numeria Studio Pro. |
| `business` | Future reservation, sales, appraisal, SNS, and cross-app business flow integration. | Not purchasable in current release. | Business is a cross-app plan, not Pro+. |

Velvet may store customer-scoped professional memory, but Growth Engine remains the owner of Customer master, Reservation, Payment, and Sales data.

## Business Plan Boundary

Business is a future cross-application plan for business data and workflows across Growth Engine, Numeria Studio, Velvet, SNS Planner, Communication Planner, AI Platform Core, and Platform Admin.

Business must be treated as:

- A future platform plan.
- Not purchasable during the first Numeria Studio / Velvet Free + Pro release.
- Not a simple feature extension of Pro.
- A plan that may unlock cross-app reference integrations while preserving each application's Source of Truth.

Business implementation must not move Customer, Reservation, Payment, Sales, Report, MessageDraft, Communication, AI Activity, or AI Usage ownership away from the owning application.

## Server Enforcement

Every plan-controlled action must have a server-side entitlement and usage check.

Minimum check inputs:

- `appId`
- `workspaceId`
- `userId` or `ownerUserId`
- `planId`
- `featureKey`
- idempotency key where usage could be double-counted
- `traceId` or `correlationId`

UI gating is allowed for clarity, but it is not sufficient enforcement.

## FeatureKey Baseline

| FeatureKey | Owning app | Plan scope |
| --- | --- | --- |
| `numeria.appraisal.create` | Numeria Studio | Free monthly limit; Pro unlimited. |
| `numeria.subject.manage` | Numeria Studio | Free subject limit; Pro unlimited. |
| `numeria.report.basic` | Numeria Studio | Free and Pro. |
| `numeria.report.pdf` | Numeria Studio | Not Free; Pro candidate. |
| `numeria.report.branding` | Numeria Studio | Not Free; Pro candidate. |
| `velvet.customer_memory.manage` | Velvet | Free customer limit; Pro unlimited. |
| `velvet.history.view` | Velvet | Free 3-month visible history; Pro indefinite. |
| `velvet.timeline.integrated` | Velvet | Pro. |
| `velvet.event_history.view` | Velvet | Pro. |
| `business.cross_app.flow` | Growth Engine / platform | Business future only. |
| `feedback.intake.submit` | Feedback Hub | Available to Free and Pro; bug reports must not be blocked by plan. |

## Events

Canonical plan event names:

- `plan.subscription.changed.v1`
- `plan.entitlement.checked.v1`
- `plan.usage.recorded.v1`
- `plan.usage_limit.reached.v1`

Applications may emit app-specific domain events, but plan lifecycle and usage-limit events must use the shared names above.

## AI Platform Core Usage

AI Platform Core may evaluate AI-related entitlements and usage by `appId + workspaceId + userId + planId + featureKey`.

AI Platform Core does not become the subscription system of record. It owns AI Activity, AI Usage, Capability, Prompt, and runtime AI control.

## Feedback Hub Usage

Feedback Hub intake for bugs and urgent issues must remain available for Free and Pro users. Plan-related issues such as Free limit questions, Pro upgrade reflection failures, and payment-related support signals should be categorized, but Feedback Hub does not own billing or subscription truth.

## Migration Requirements

Applications adding plan support must:

1. Use only canonical `PlanId` values.
2. Default existing users to `free`.
3. Add server-side entitlement checks before plan-limited writes or reads.
4. Add usage recording with idempotency for countable actions.
5. Preserve application Source of Truth boundaries.
6. Keep `professionalId` optional for MVP.
7. Keep Business hidden or disabled until explicitly released.
8. Add contract/readiness checks for plan config, entitlement API, usage status, and limit errors.
