# Free / Pro Release Cross-App Implementation Requests

Use these short requests when sending the shared contract to each application team/chat.

## Numeria Studio

Numeria Studio should implement the Free / Pro release against `professional-platform-contracts/docs/contracts/plan-contract.md`.

Focus:

- Free / Pro entitlement and server-side usage enforcement.
- Free completion count only on appraisal completion, not session start.
- Free limits: 20 completed appraisals/month, 1 in-progress save, 3 appraisal client profiles, latest 3 history content items.
- Pro unlocks unlimited usage, detailed reports, branding/logo control, wording adjustment, search, client-specific history, session memo, and AI consultation organization/deepening.
- Business remains unavailable/preparing and not purchasable.
- Keep Customer / Reservation / Payment / Sales out of Numeria Source of Truth.
- AI usage must go through AI Platform Core.
- Feedback Hub entry must be available for Free and Pro users.

## Velvet

Velvet should implement the Free / Pro release against `professional-platform-contracts/docs/contracts/plan-contract.md`.

Focus:

- Free users can register and inspect records individually.
- Pro unlocks integrated timeline, event organization, conversation/relationship flow, AI-assisted organization, and search/filtering.
- Business remains unavailable/preparing and not purchasable.
- Do not own Reservation / Payment / Sales / Growth Engine Customer master.
- Do not pass full conversation or memory text to other apps by default.
- AI usage must go through AI Platform Core.
- Feedback Hub entry must be available for Free and Pro users.

## AI Platform Core

AI Platform Core should enforce AI entitlements and usage for app features using `appId + workspaceId + userId + planId + featureKey`.

Do not accept full appraisal text, full consultation text, full conversation/message text, customer master records, payment details, API keys, secrets, or secret prompts as usage payloads.

## Feedback Hub

Feedback Hub should accept Free and Pro inquiries without plan blocking bug reports.

It should classify Free limit, Pro subscription, upgrade, plan reflection failure, auth error, save error, PDF error, AI usage error, billing issue, and suspected data loss. Critical billing, data loss, login failure, plan reflection failure, and production save failure should be admin notification candidates.

## Platform Admin

Platform Admin should monitor release and plan readiness through `/health`, `/version`, `/contracts/status`, `/release/status`, `/auth/status`, and `/persistence/status`.

It must confirm Business is unavailable/preparing and not purchasable, without exposing payment details, secrets, full conversations, full appraisals, full messages, or secret prompts.

## Growth Engine

Growth Engine should not build Business features for this Free / Pro release. It should only preserve future Business boundaries and remain Source of Truth for Customer, Reservation, Payment, Sales, Public Site, and Business workflows.
