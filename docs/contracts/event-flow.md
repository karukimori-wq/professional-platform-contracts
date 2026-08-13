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
- Velvet owns professional visits, professional memory, service notes, and customer-specific professional timelines.
- SNS Planner owns SNS post drafts and message drafts.
- AI Platform Core owns AI activities and usage tracking.
- Platform Admin observes status and logs. It does not become a business source of truth.

## MVP Flow Summary

| Flow | API Operation | Event Outcome | Status |
| --- | --- | --- | --- |
| Growth Engine to SNS Planner PostDraft | `PostDraft.Generate` | `sns.post_draft.created.v1` | Stable |
| Growth Engine to SNS Planner MessageDraft | `MessageDraft.Generate` | `sns.message_draft.created.v1` | Stable |
| SNS Planner to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable |
| Numeria Studio to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable, environment caveat |
| Growth Engine to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable |
| Growth Engine to Numeria Studio | `Session.Start` | `studio.session.started.v1` | Stable |
| Growth Engine to Velvet | `VelvetHandoff.Start` / `VelvetVisit.Start` | `velvet.visit.started.v1` | Stable |
| Velvet Visit Completion | `VelvetVisit.Complete` | `velvet.visit.completed.v1` | Stable |
| Velvet Memory Update | `VelvetMemory.Update` | `velvet.memory.updated.v1` | Stable |
| Platform Admin to Apps | Health/status read | None | Stable |

## 1. Growth Engine to SNS Planner PostDraft

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

## 2. Growth Engine to SNS Planner MessageDraft

Purpose: Growth Engine asks SNS Planner to create a customer communication draft from business intent.

Required API:

- Operation: `MessageDraft.Generate`
- Caller: Growth Engine
- Receiver: SNS Planner

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "targetStudio": "velvet",
  "channel": "line",
  "purpose": "follow_up",
  "audienceSegment": "repeat_candidate",
  "tone": "warm",
  "cta": "book_next_visit",
  "inputRef": {
    "customerId": "customer_test_001",
    "reservationId": "reservation_test_001",
    "followupId": "followup_test_001"
  }
}
```

SNS Planner returns:

- `messageDraftId`
- `messageDraftStatus`
- `workspaceId`
- `channel`
- `purpose`

Event outcome:

- SNS Planner publishes or records `sns.message_draft.created.v1`.

Ownership rules:

- Growth Engine owns the business reason for the communication.
- SNS Planner owns the message draft.
- SNS Planner must not receive customer master records, payment state, sales amount, Stripe data, full professional notes, full report bodies, API keys, access tokens, or secret prompts.

## 3. SNS Planner to AI Platform Core

Purpose: SNS Planner records AI-assisted draft generation as an AI Activity.

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

For MessageDraft, `activityType` and `capability` should identify message generation, and `inputRef` should contain only `messageDraftId`, `channel`, and other approved reference IDs.

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- AI Platform Core records AI activity and usage only.
- AI Platform Core must not own SNS post drafts, message drafts, or campaign/contact decisions.

## 4. Numeria Studio to AI Platform Core

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

## 5. Growth Engine to AI Platform Core

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

## 6. Growth Engine to Numeria Studio

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

## 7. Growth Engine to Velvet

Purpose: Growth Engine starts a Velvet professional visit or handoff from a customer, reservation, or visit schedule workflow.

Required API:

- Operation: `VelvetHandoff.Start` or `VelvetVisit.Start`
- Caller: Growth Engine
- Receiver: Velvet

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "customerId": "customer_test_001",
  "reservationId": "reservation_test_001",
  "visitScheduleId": "visit_schedule_test_001",
  "intent": "start_professional_visit"
}
```

Use either `reservationId` or `visitScheduleId` when only one applies.

Velvet returns:

- `visitId`
- `workspaceId`
- `customerId`
- `status`
- optional `summaryRef`
- optional `nextActionRef`

Event outcome:

- Velvet publishes or records `velvet.visit.started.v1`.

Ownership rules:

- Growth Engine owns the customer, reservation, visit schedule, payment, sales, and business workflow state.
- Velvet owns the professional visit, professional memory, service notes, and professional timeline.
- `customerId`, `reservationId`, and `visitScheduleId` are references only.
- Velvet must not create a competing Customer master, Payment source of truth, or Sales source of truth.
- Growth Engine must not copy full Velvet professional notes or full professional memory bodies by default.

## 8. Velvet Visit Completion and Memory Flow

Purpose: Velvet records professional visit outcomes and memory updates while keeping Growth Engine as the source of truth for customer and business data.

Relevant APIs:

- `VelvetVisit.Complete`
- `VelvetMemory.Update`
- `VelvetNote.Create`
- `VelvetTimeline.List`
- `VelvetNextAction.Create`

Event outcomes:

- `velvet.visit.completed.v1`
- `velvet.memory.updated.v1`
- `velvet.note.created.v1`
- `velvet.next_action.created.v1`

Allowed cross-app references:

- `workspaceId`
- `userId`
- `customerId`
- `visitId`
- `reservationId`
- `visitScheduleId`
- `noteId`
- `summaryRef`
- `nextActionRef`
- `lastVisitAt`

Ownership rules:

- Velvet may update its own professional memory and timeline.
- Velvet may return references and small summaries to Growth Engine when a contracted business workflow needs them.
- Velvet must not return full professional note bodies, full conversation histories, or full professional memory bodies to Growth Engine by default.
- Velvet must not emit payment state, sales amount, Stripe data, or customer master records in events.

## 9. Platform Admin to Apps

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
- Platform Admin must not become the source of truth for customers, reservations, sessions, reports, visits, professional memory, post drafts, message drafts, payments, sales, or AI activities.

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
- domain reference IDs such as `customerId`, `reservationId`, `visitScheduleId`, `sessionId`, `reportId`, `visitId`, `noteId`, `summaryRef`, `nextActionRef`, `draftId`, `messageDraftId`, `activityId`
- non-sensitive workflow context needed by the receiver

Not allowed unless a future contract explicitly approves it:

- customer master records outside Growth Engine
- payment details outside Growth Engine
- sales amount outside Growth Engine
- `paymentStatus` outside Growth Engine as a source of truth
- Stripe data outside Growth Engine
- full meeting transcript
- full appraisal notes sent to AI Platform Core
- full professional memory bodies outside Velvet
- full professional note bodies outside Velvet
- full conversation histories outside Velvet
- personal identity fields when a reference ID is sufficient
