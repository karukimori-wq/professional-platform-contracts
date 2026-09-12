# Free / Pro / Business Release Contract Rollout Guide

Use this guide before sending implementation requests to Numeria Studio, Velvet, AI Platform Core, Feedback Hub, Platform Admin, and Growth Engine.

## Current Release Scope

- Numeria Studio: Free + Pro.
- Velvet: Free + Pro.
- Business: future running development, not purchasable now.

## Shared Implementation Rules

1. Use only `free`, `pro`, and `business` as `PlanId`.
2. Use `ReleaseStatus` for Business state: `preparing` or `unavailable`.
3. Default existing users to `free`.
4. Keep `workspaceId + userId / ownerUserId`.
5. Do not require `professionalId` for MVP.
6. Enforce limits server-side.
7. Do not hard-code prices in contracts.
8. Do not expose Business purchase flows to normal users.
9. Allow admin mode to view planned Business or in-development features only for administrators.
10. Preserve every application Source of Truth boundary.

## Numeria Studio Implementation Request

Implement the Free / Pro release using `docs/contracts/plan-contract.md` as the source of truth.

Required behavior:

- Free monthly count is consumed only when the appraisal completion button is pressed.
- Session start alone does not consume the monthly appraisal count.
- Free: 20 completed appraisals per month.
- Free: 1 in-progress save.
- Free: 3 appraisal client profiles.
- Free: latest 3 appraisal history content items visible.
- Free: older history is not deleted; show count and client info, lock full content.
- Free: basic appraisal, basic report, basic template, free-tier AI assistance.
- Free: PDF output with logo.
- Pro: unlimited monthly completed appraisals.
- Pro: unlimited in-progress saves.
- Pro: unlimited appraisal client profiles.
- Pro: unlimited appraisal history content view.
- Pro: detailed appraisal, detailed report, branded report, logo change/hide, report wording adjustment, past search, client-specific history, session memo, AI consultation organization/deepening, AI wording adjustment.
- Business: unavailable/preparing only. Do not expose purchase flow.

Do not make Numeria Studio the Source of Truth for Customer, Reservation, Payment, Sales, Conversation, Message, AI Activity, or AI Usage.

## Velvet Implementation Request

Implement the Free / Pro release using `docs/contracts/plan-contract.md` as the source of truth.

Required behavior:

- Free users can register records.
- Free users review registered contents by date or individual record.
- Free users do not get full integrated timeline and event organization.
- Pro users can see integrated timeline, event timing, conversation history flow, relationship flow, AI-assisted organization/suggestions, and past record search/filtering.
- Business remains unavailable/preparing and is not purchasable.

Do not pass full conversation or memory text to other apps by default. AI usage must go through AI Platform Core.

## AI Platform Core Implementation Request

Support app AI usage by `appId + workspaceId + userId + planId + featureKey`.

Accept metadata, usage counts, status, token estimates, event names, and correlation IDs. Do not accept full appraisal text, full consultation text, full conversation/message text, customer master records, payment details, API keys, secrets, or secret prompts.

## Feedback Hub Implementation Request

Allow Free and Pro users to submit inquiries. Do not block bug reports by plan. Capture `sourceApp`, `appVersion`, `planId`, `workspaceId`, `userId`, `currentScreen`, `category`, `occurredAt`, and `correlationId`.

Classify Free limit, Pro subscription, upgrade, plan reflection failure, auth error, save error, PDF error, AI usage error, billing issue, and suspected data loss.

## Platform Admin Implementation Request

Monitor `/health`, `/version`, `/contracts/status`, `/release/status`, `/auth/status`, and `/persistence/status`.

Show release readiness, plan contract version, Free/Pro/Business state, Business unavailable/preparing, entitlement state, usage state, auth readiness, persistence readiness, AI Platform Core integration, Feedback Hub entry state, latest deploy state, and error categories.

Do not show payment details, Stripe secrets, API keys, full conversations, full appraisals, full messages, or secret prompts.

## Growth Engine Implementation Request

Do not implement Business product features in this Free / Pro release. Prepare future Business boundaries only.

Growth Engine remains the Source of Truth for Customer, Reservation, Payment, Sales, Public Site, and Business plan workflows. Numeria Studio and Velvet should return reference IDs and status only.
