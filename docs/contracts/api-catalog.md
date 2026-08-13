# API Catalog

This catalog lists approved cross-system synchronous operations.

APIs are used when the caller needs an immediate result. State changes that downstream systems should react to must also publish events.

## Growth Engine APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Customer.Create` | Professional Studio, Growth Engine UI | `customerId` | `growth.customer.created.v1` |
| `Customer.Get` | Professional Studio | Customer display profile | None |
| `Customer.Find` | Professional Studio | Customer list | None |
| `Customer.UpdateStatus` | Growth Engine UI | Updated status | Status event |
| `Reservation.Create` | Growth Engine UI | `reservationId` | `growth.reservation.created.v1` |
| `Reservation.Get` | Professional Studio | Reservation reference | None |

## Professional Studio APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Session.Start` | Growth Engine, Studio UI | `sessionId` | `studio.session.started.v1` |
| `Session.Complete` | Studio UI | Completed session | `studio.session.completed.v1` |
| `Report.Generate` | Studio UI | `reportId` or `activityId` | `studio.report.generated.v1` |
| `Report.Preview` | Studio UI | Preview artifact | None |
| `Report.ExportPdf` | Studio UI | PDF artifact | `studio.report.generated.v1` when newly generated |
| `ServiceReference.List` | Growth Engine | Service references | None |

## Velvet APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `VelvetVisit.Start` | Growth Engine, Velvet UI | `visitId` | `velvet.visit.started.v1` |
| `VelvetVisit.Complete` | Velvet UI | `visitId`, `summaryRef`, `lastVisitAt` | `velvet.visit.completed.v1` |
| `VelvetMemory.Get` | Velvet UI | Customer professional memory projection | None |
| `VelvetMemory.Update` | Velvet UI | `memoryId` | `velvet.memory.updated.v1` |
| `VelvetNote.Create` | Velvet UI | `noteId` | `velvet.note.created.v1` |
| `VelvetTimeline.List` | Velvet UI | Timeline entries | None |
| `VelvetNextAction.Create` | Velvet UI | `nextActionRef` | `velvet.next_action.created.v1` |
| `VelvetHandoff.Start` | Growth Engine | `visitId` or handoff status | `velvet.visit.started.v1` when visit starts |

### Velvet HTTP Mapping

MVP HTTP mapping:
- `POST /api/visits` maps to `VelvetVisit.Start`.
- `PATCH /api/visits/{visitId}` maps to `VelvetVisit.Complete`.
- `GET /api/customers/{customerId}/memory` maps to `VelvetMemory.Get`.
- `PATCH /api/customers/{customerId}/memory` maps to `VelvetMemory.Update`.
- `POST /api/customers/{customerId}/notes` maps to `VelvetNote.Create`.
- `GET /api/customers/{customerId}/timeline` maps to `VelvetTimeline.List`.
- `POST /api/customers/{customerId}/next-actions` maps to `VelvetNextAction.Create`.

Growth Engine to Velvet requests must be reference-first:
- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`
- `traceId`
- `correlationId`

Velvet to Growth Engine responses must be reference-first:
- `visitId`
- `noteId`
- `lastVisitAt`
- `nextActionRef`
- `summaryRef`
- `traceId`
- `correlationId`

Velvet APIs must not receive or return Customer master records, `paymentStatus`, `salesAmount`, Stripe data, Payment records, Sales records, full professional note bodies, full conversation histories, API keys, access tokens, or secret prompts unless a future explicit contract approves a minimum scoped subset.

## AI Platform Core APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Capability.Register` | Product repository | `capabilityId` | None |
| `Activity.Create` | Product runtime | `activityId` | `ai.activity.created.v1` |
| `Activity.Get` | Product runtime | Activity status | None |
| `Usage.List` | Growth Engine, Studio admin, Velvet | Usage summary / point-accounting state | None |
| `PromptTemplate.Render` | Product runtime | Rendered prompt | None |
| `VelvetCapture.Structure` | Velvet | Structured candidates only; no Velvet mutation | `ai.activity.created.v1` / completion events |
| `VelvetSearch.ParseIntent` | Velvet | Search intent / terms only; no Velvet dataset results | `ai.activity.created.v1` / completion events |

### Velvet AI contract constraints

`VelvetCapture.Structure`
- Caller: Velvet only.
- Input is limited to the user-triggered raw Capture text plus reference/observability metadata needed for the request.
- Do not send the user's full People dataset, unrelated contact details, payment/receivable data, image library, or unrelated private notes.
- Response returns candidate structured items only. AI Platform Core must not write Velvet canonical Person, Knowledge, Gift, Schedule, Relationship, Visit, or Capture state.
- Velvet performs user confirmation before applying any inferred mutation.

`VelvetSearch.ParseIntent`
- Caller: Velvet only.
- Input is limited to the user-entered search query plus reference/observability metadata.
- Response returns a normalized search intent such as terms/filters; it does not query or return the user's Velvet dataset.
- Velvet executes owner-scoped retrieval locally against Velvet-owned data.

Both operations must preserve or return `traceId`, `correlationId`, and `requestId` according to the shared observability contract. AI usage accounting remains canonical in AI Platform Core.

## SNS Planner APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `PostDraft.Generate` | Growth Engine | Draft variants | `sns.post_draft.created.v1` |
| `PostDraft.Rewrite` | Growth Engine | Updated draft | `sns.post_draft.updated.v1` |
| `PostTemplate.List` | Growth Engine | Template list | None |
| `MessageDraft.Generate` | Growth Engine | Contact or follow-up message draft | `sns.message_draft.created.v1` |
| `MessageDraft.Rewrite` | Growth Engine | Updated contact or follow-up message draft | `sns.message_draft.updated.v1` |
| `PostDraft.Metadata` | Growth Engine, Platform Admin | Post draft capability metadata | None |
| `MessageDraft.Metadata` | Growth Engine, Platform Admin | Message draft capability metadata | None |

### SNS MessageDraft HTTP Mapping

MVP HTTP mapping:
- `POST /api/message-drafts` maps to `MessageDraft.Generate`.
- `GET /api/message-drafts/metadata` maps to `MessageDraft.Metadata`.
- `GET /api/post-drafts/metadata` maps to `PostDraft.Metadata`.

`POST /api/message-drafts` request must be reference-first and minimum necessary:
- `workspaceId`
- `userId`
- `sourceApp`
- `targetStudio`
- `channel`
- `purpose`
- `audienceSegment`
- `tone`
- `cta`
- `inputRef`

Response should include:
- top-level `status` using `success`, `warning`, `error`, or `skipped`
- `messageDraftId`
- `messageDraftStatus`, such as `draft_created`
- `channel`
- `purpose`
- `eventName: sns.message_draft.created.v1`
- `traceId`
- `correlationId`
- `requestId`

`MessageDraft` must not receive or return Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, API keys, access tokens, or secret prompts.

## Naming Rules

- Use PascalCase dotted operation names.
- Operation names describe commands or queries, not HTTP routes.
- Product repositories may map these operations to HTTP, RPC, server actions, or SDK methods.
- Cross-system API names must remain stable even if transport changes.
