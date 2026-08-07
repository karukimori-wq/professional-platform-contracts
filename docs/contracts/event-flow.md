# Event Flow

This document defines the approved MVP event and integration flows between apps.

Use this document together with:

- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/app-responsibilities.md`
- `docs/contracts/observability-contract.md`

## Core Rule

APIs perform immediate work. Events record state changes that other apps may react to.

Each flow must preserve canonical ownership:

- Growth Engine owns customers, reservations, payments, sales, public sites, and business workflow state.
- Numeria Studio owns sessions, reports, and domain appraisal output.
- SNS Planner owns SNS post drafts.
- AI Platform Core owns AI activities and usage tracking.
- Platform Admin observes status and logs. It does not become a business source of truth.

## MVP Flow Summary

| Flow | API Operation | Event Outcome | Status |
| --- | --- | --- | --- |
| Growth Engine to SNS Planner | `PostDraft.Generate` | `sns.post_draft.created.v1` | Stable |
| SNS Planner to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable |
| Numeria Studio to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable, environment caveat |
| Growth Engine to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable |
| Growth Engine to Numeria Studio | `Session.Start` | `studio.session.started.v1` | Stable |
| Platform Admin to Apps | Health/status read | None | Stable |

## 1. Growth Engine to SNS Planner

Purpose: Growth Engine asks SNS Planner to create a post draft from business intent.

Required API:

- Operation: `PostDraft.Generate`
- Caller: Growth Engine
- Receiver: SNS Planner

Required references:

- `workspaceId`
- `userId`
- `objective`
- `targetAudience`
- `topic`
- `contentType`
- `channel`
- `cta`
- `destinationUrl`

SNS Planner returns:

- `draftId`
- `workspaceId`
- `status`
- `channel`

Event outcome:

- SNS Planner publishes or records `sns.post_draft.created.v1`.

Ownership rules:

- Growth Engine owns the campaign intent and destination.
- SNS Planner owns the post draft.
- SNS Planner must not decide sales strategy, funnel stage, payment state, or customer lifecycle state.

## 2. SNS Planner to AI Platform Core

Purpose: SNS Planner records AI-assisted post draft generation as an AI Activity.

Required API:

- Operation: `Activity.Create`
- Caller: SNS Planner
- Receiver: AI Platform Core

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "sns-planner",
  "activityType": "sns.post_draft.created",
  "capability": "sns.post.generate",
  "inputRef": {
    "draftId": "draft_xxx",
    "channel": "instagram"
  }
}
```

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- AI Platform Core records AI activity and usage only.
- AI Platform Core must not own SNS post drafts or campaign decisions.

## 3. Numeria Studio to AI Platform Core

Purpose: Numeria Studio records AI-assisted report generation as an AI Activity.

Required API:

- Operation: `Activity.Create`
- Caller: Numeria Studio
- Receiver: AI Platform Core

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "numeria-studio",
  "activityType": "studio.report.generated",
  "capability": "studio.report.generate",
  "inputRef": {
    "sessionId": "session_test_001",
    "reportId": "report_test_001",
    "reportType": "numerology"
  }
}
```

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- Use `Report`, not `Document`, for external contract naming.
- Send references only.
- Do not send customer master records, names, emails, birthdays, full appraisal notes, or full meeting transcripts.
- Do not send `paymentStatus`, `salesAmount`, or `campaignCode`.

MVP environment caveat:

- ChatGPT Sites to ChatGPT Sites server-side fetch may return 522.
- If direct AI Platform Core POST succeeds and payload validation passes, this flow may be marked `conditional_pass` for MVP.

## 4. Growth Engine to AI Platform Core

Purpose: Growth Engine records AI-assisted business recommendations, follow-up suggestions, or analysis as an AI Activity.

Required API:

- Operation: `Activity.Create`
- Caller: Growth Engine
- Receiver: AI Platform Core

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "activityType": "growth.recommendation.created",
  "capability": "growth.recommendation.generate",
  "inputRef": {
    "recommendationId": "rec_test_001",
    "contextType": "followup",
    "targetType": "customer_segment"
  }
}
```

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- Growth Engine owns business workflow state.
- AI Platform Core records AI usage only.
- Do not send customer personal information, payment details, sales amount, or `paymentStatus`.

## 5. Growth Engine to Numeria Studio

Purpose: Growth Engine starts a Numeria Studio appraisal session from a reservation or customer workflow.

Required API:

- Operation: `Session.Start`
- Caller: Growth Engine
- Receiver: Numeria Studio

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "reservationId": "reservation_test_001",
  "customerRef": {
    "customerId": "customer_test_001"
  },
  "sessionType": "numerology",
  "intent": "start_appraisal_session"
}
```

Numeria Studio returns:

- `sessionId`
- `workspaceId`
- `status`
- `sourceApp`
- `sessionType`

Event outcome:

- Numeria Studio publishes or records `studio.session.started.v1`.

Ownership rules:

- Growth Engine owns the customer and reservation.
- Numeria Studio owns the session.
- `customerId` is a reference only.
- Numeria Studio must not store a competing customer master, payment state, sales amount, or `paymentStatus`.

## 6. Platform Admin to Apps

Purpose: Platform Admin checks app health, version, contract status, and MVP connection test results.

Required read endpoints:

- `/health`
- `/version`
- `/contracts/status`
- Platform Admin may also expose `/api/mvp-connection-tests`.

Event outcome:

- None.

Ownership rules:

- Platform Admin stores operational snapshots only.
- Platform Admin must not become the source of truth for customers, reservations, sessions, reports, post drafts, payments, sales, or AI activities.

## Event Naming Rules

- Event names must be lowercase dotted strings.
- Event names must be past tense.
- Event names must include a version suffix such as `.v1`.
- Stable events must be listed in `docs/contracts/event-catalog.md`.
- Pending events must not be treated as stable app contracts.

## Required Flow Status Values

Platform Admin and integration tests should use these status values:

| Status | Meaning |
| --- | --- |
| `passed` | API call and expected response succeeded |
| `conditional_pass` | Contract and direct receiver behavior passed, but known environment limitation blocked full server-to-server verification |
| `failed` | Contract, endpoint, response, or ownership rule failed |
| `not_run` | Test has not been executed |

## Privacy and Data Minimization

Cross-app flows must send the smallest useful reference set.

Allowed:

- `workspaceId`
- `userId`
- `ownerUserId`
- domain reference IDs such as `customerId`, `reservationId`, `sessionId`, `reportId`, `draftId`, `activityId`
- non-sensitive workflow context needed by the receiver

Not allowed unless a future contract explicitly approves it:

- customer master records outside Growth Engine
- payment details outside Growth Engine
- sales amount outside Growth Engine
- `paymentStatus` outside Growth Engine as a source of truth
- full meeting transcript
- full appraisal notes sent to AI Platform Core
- personal identity fields when a reference ID is sufficient
