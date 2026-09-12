# Free / Pro / Business Plan Contract

This contract is the platform-wide source of truth for Free / Pro release planning and the future Business plan boundary.

Numeria Studio and Velvet release Free and Pro first. Business is intentionally out of the current release and continues as future running development.

Applications must not invent local plan names, incompatible usage limits, AI usage contracts, Feedback Hub payloads, or release monitoring semantics.

## Canonical Types

| Type | Allowed values / meaning |
| --- | --- |
| `PlanId` | `free`, `pro`, `business` |
| `SubscriptionStatus` | `trialing`, `active`, `past_due`, `canceled`, `expired` |
| `ReleaseStatus` | `ready`, `in_progress`, `blocked`, `preparing`, `unavailable` |
| `AppContractStatus` | `compliant`, `warning`, `error`, `not_applicable` |
| `Entitlement` | A server-evaluated permission for a `FeatureKey` under a `PlanId`. |
| `UsageLimit` | A plan-scoped limit such as completed appraisal count, saved draft count, profile count, or history visibility. |
| `UsagePeriod` | The measurement period for usage, for example `monthly`, `rolling_3_months`, or `lifetime`. |
| `FeatureKey` | Stable string key used by apps and AI Platform Core to evaluate access. |
| `PlanChangedEvent` | Canonical event emitted when a subscription or effective plan changes. |
| `UsageLimitReachedEvent` | Canonical event emitted when server-side enforcement denies or warns on limit exhaustion. |

`preparing` and `unavailable` are not `SubscriptionStatus` values. Use them under `ReleaseStatus` for Business or not-yet-released features.

## Global Rules

- Free and Pro are in the current release scope.
- Business is not purchasable in the current release.
- Business is a future cross-application business plan, not a larger Pro tier.
- Business purchase flows and normal-user Business feature navigation must not be public.
- Admin mode may expose Business planned features and in-development menus to administrators only.
- Pricing must not be hard-coded in this contract.
- Existing users default to `free` unless a valid subscription says otherwise.
- Plan limits must be enforced server-side, not only hidden in UI.
- MVP identity remains `workspaceId + userId / ownerUserId`.
- `professionalId` is not a required MVP dependency.
- Numeria Studio Pro and Velvet Pro are separately purchasable products.
- Domain Source of Truth ownership does not change because of plan enforcement.

## Subscription Status

| Status | Meaning |
| --- | --- |
| `trialing` | Trial access is active. |
| `active` | Paid or valid plan access is active. |
| `past_due` | Billing issue exists; grace-period behavior must be explicit per app. |
| `canceled` | Subscription has been canceled. |
| `expired` | Trial, grace period, or time-limited access has ended. |

## Release Status

| Status | Meaning |
| --- | --- |
| `ready` | Release scope is implemented and verified. |
| `in_progress` | Release scope is actively being implemented. |
| `blocked` | Release scope cannot proceed until a named issue is resolved. |
| `preparing` | Planned or internally visible but not available to normal users. |
| `unavailable` | Not offered and not available. |

Business must report `preparing` or `unavailable` until explicitly released.

## Numeria Studio Plans

Numeria Studio is the Source of Truth for Session, Report Snapshot, appraisal logic, calculation results, and AppraisalClientSnapshot.

Numeria Studio must not own Customer master, Reservation, Payment, Sales, Conversation, Message, AI Activity, or AI Usage.

| PlanId | Entitlements | Limits | Notes |
| --- | --- | --- | --- |
| `free` | Basic appraisal, basic report, basic template, free-tier AI assistance, PDF output with platform logo. | 20 completed appraisals per month; 1 saved in-progress appraisal; 3 appraisal client profiles; content view for latest 3 history items. | Count is consumed when the user presses the appraisal completion button. Session start alone does not consume monthly appraisal count. Older appraisals are not deleted; Free shows count and client info but locks full content. |
| `pro` | Detailed appraisal, detailed report, PDF output, branded report, logo change/hide, report wording adjustment, past appraisal search, client-specific appraisal history, session memo, AI consultation organization/deepening, AI wording adjustment. | No monthly appraisal count limit; no saved draft limit; no appraisal client profile limit; no appraisal-history content-view limit. | Pro is independent from Velvet Pro. |
| `business` | Future Growth Engine integration, reservation, sales, payment, refund, and SNS acquisition integration by reference IDs. | Not purchasable in current release. | Growth Engine remains Source of Truth for Customer, Reservation, Payment, and Sales. Numeria stores references only. |

Official Numeria events:

- `studio.session.started.v1`
- `studio.session.completed.v1`
- `studio.report.generated.v1`

Allowed event fields:

- `appId`
- `appVersion`
- `workspaceId`
- `userId`
- `planId`
- `featureKey`
- `sessionId`
- `reportId`
- `reportRef`
- `correlationId`
- `occurredAt`
- `status`

Forbidden event fields:

- Full appraisal text.
- Full consultation text.
- Full customer master record.
- Payment details.
- Stripe information.
- API keys.
- Secrets.
- Secret prompts.

## Velvet Plans

Velvet manages relationship, conversation, and event records for professional memory. Detailed Velvet feature rules may be refined in the Velvet repository, but the Free / Pro boundary below is shared.

Velvet must not own Reservation, Payment, Sales, or Growth Engine Customer master truth.

| PlanId | Entitlements | Limits | Notes |
| --- | --- | --- | --- |
| `free` | Basic registration and per-date/per-record review. | Detailed integrated timeline is limited; users inspect registered contents one by one. | Pro value must remain visible through locked or limited timeline/event organization affordances. |
| `pro` | Integrated timeline, event timing, conversation history flow, relationship flow, AI-assisted organization/suggestions, search, and filtering. | No Pro-specific history/search limit unless Velvet defines one in its app contract. | Pro is independent from Numeria Studio Pro. |
| `business` | Future Growth Engine, SNS, payment, reservation, appraisal, and cross-app workflow integration. | Not purchasable in current release. | Cross-app flows must use reference IDs and preserve Source of Truth boundaries. |

Velvet must not pass full conversation text or full memory text to other apps by default. AI usage goes through AI Platform Core. Feedback Hub may classify inquiries from Velvet.

## Business Plan Boundary

Business is a future cross-application plan for business data and workflows across Growth Engine, Numeria Studio, Velvet, SNS Planner, Feedback Hub, AI Platform Core, and Platform Admin.

Business must be treated as:

- A future platform plan.
- Not purchasable during the first Numeria Studio / Velvet Free + Pro release.
- Not a simple feature extension of Pro.
- Hidden from normal users except for coming-soon messaging where explicitly approved.
- Visible in admin mode only as planned, preparing, or in-development functionality.
- A plan that may unlock cross-app reference integrations while preserving each application's Source of Truth.

Business implementation must not move Customer, Reservation, Payment, Sales, Report, MessageDraft, Communication, AI Activity, or AI Usage ownership away from the owning application.

## Server Enforcement

Every plan-controlled action must have a server-side entitlement and usage check.

Minimum check inputs:

- `appId`
- `appVersion`
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
| `numeria.appraisal.complete` | Numeria Studio | Free monthly completion limit; Pro unlimited. |
| `numeria.appraisal.save_draft` | Numeria Studio | Free 1 in-progress save; Pro unlimited. |
| `numeria.client_profile.manage` | Numeria Studio | Free profile limit; Pro unlimited. |
| `numeria.history.view_content` | Numeria Studio | Free latest 3 content view; Pro unlimited. |
| `numeria.report.basic` | Numeria Studio | Free and Pro. |
| `numeria.report.detailed` | Numeria Studio | Pro. |
| `numeria.report.pdf` | Numeria Studio | Free and Pro. |
| `numeria.report.branding` | Numeria Studio | Pro. |
| `numeria.report.wording_adjustment` | Numeria Studio | Pro. |
| `velvet.record.register` | Velvet | Free and Pro. |
| `velvet.timeline.integrated` | Velvet | Pro. |
| `velvet.event_history.organized` | Velvet | Pro. |
| `velvet.ai.organize_suggest` | Velvet | Pro. |
| `business.cross_app.flow` | Growth Engine / platform | Business future only. |
| `feedback.intake.submit` | Feedback Hub | Available to Free and Pro; bug reports must not be blocked by plan. |

## AI Platform Core Contract

All application AI usage must go through AI Platform Core.

AI usage and generation payloads may include:

- `eventName`
- `appId`
- `appVersion`
- `workspaceId`
- `userId`
- `planId`
- `featureKey`
- `traceId`
- `correlationId`
- `usagePeriod`
- `usageCount`
- `limit`
- `overLimit`
- `entitlementResult`
- `status`
- approximate token count

AI Platform Core payloads must not include:

- Full appraisal text.
- Full consultation text.
- Full conversation text.
- Full message text.
- Full customer master record.
- Payment details.
- API keys.
- Secrets.
- Secret prompts.

AI Platform Core owns AI Activity, AI Usage, Capability, Prompt, and runtime AI control. It does not become the subscription system of record.

## Feedback Hub Contract

Free and Pro users must both be able to submit inquiries. Bug reports must not be blocked by plan limits.

Feedback Hub inquiry metadata should include:

- `sourceApp`
- `appVersion`
- `planId`
- `workspaceId`
- `userId`
- `currentScreen`
- `category`
- `occurredAt`
- `correlationId`

Feedback Hub should classify at least:

- Free limit.
- Pro subscription.
- Upgrade.
- Plan reflection failure.
- Authentication error.
- Data save error.
- PDF export error.
- AI usage error.
- Billing-related issue.
- Suspected data loss.

Feedback Hub must not store:

- API keys.
- Secrets.
- Stripe Secret.
- Card information.
- Payment details.
- Full appraisal text.
- Full conversation text.
- Full customer master record.

Admin notification candidates:

- Billing error.
- Data loss.
- Login failure.
- Plan reflection failure.
- Production save failure.

## Platform Admin Release Monitoring

Applications must expose at least:

- `/health`
- `/version`
- `/contracts/status`
- `/release/status`
- `/auth/status`
- `/persistence/status`

Platform Admin should monitor:

- `appId`
- `appVersion`
- `planContractVersion`
- `releaseScope`
- Free / Pro / Business state
- Business not purchasable
- entitlement readiness
- usage readiness
- auth readiness
- persistence readiness
- D1 / DB readiness
- AI Platform Core integration state
- Feedback Hub entry state
- latest deploy state
- primary error categories

Platform Admin must not display or log:

- Payment details.
- Stripe Secret.
- API keys.
- Full customer conversation text.
- Full appraisal text.
- Full message text.
- Secret prompts.

## Growth Engine Boundary

Growth Engine is the Source of Truth for:

- Customer.
- Reservation.
- Payment.
- Sales.
- Public Site.
- Business plan workflow.

Numeria Studio and Velvet may return to Growth Engine:

- `workspaceId`
- `userId`
- `customerId`
- `reservationId`
- `sessionId`
- `reportId`
- `reportRef`
- `status`
- `completedAt`
- `sourceApp`
- `correlationId`

Numeria Studio and Velvet must not return:

- Full appraisal text.
- Full report text.
- Full conversation text.
- Payment details.
- Sales details.
- Full Customer master record.
- Stripe information.
- Secrets.

## Admin Mode

Admin mode is an extension of the normal plan UI. It is not a separate Platform Admin-style cross-app monitoring screen.

Admin mode may show administrators:

- In-development menus.
- Planned Business menus.
- Plan state.
- Usage.
- API connection state.
- Error category.
- Release state.

Admin mode must not show:

- Payment details.
- Stripe Secret.
- API keys.
- Customer text.
- Full appraisal text.
- Full conversation text.
- Secret prompts.

Normal users must not see Business planned menus or unreleased development functions unless explicitly approved as coming-soon messaging.

## Events

Canonical plan event names:

- `plan.subscription.changed.v1`
- `plan.entitlement.checked.v1`
- `plan.usage.recorded.v1`
- `plan.usage_limit.reached.v1`

Applications may emit app-specific domain events, but plan lifecycle and usage-limit events must use the shared names above.
