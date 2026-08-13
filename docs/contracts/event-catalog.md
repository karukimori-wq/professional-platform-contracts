# Event Catalog

This catalog lists approved cross-system events.

Events are state-change notifications. They must be versioned and past tense.

## Growth Engine Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `growth.customer.created.v1` | Growth Engine | Professional Studio, AI Platform Core | A canonical customer was created |
| `growth.customer.updated.v1` | Growth Engine | Professional Studio | Canonical customer display or contact metadata changed |
| `growth.lead.converted.v1` | Growth Engine | Professional Studio, AI Platform Core | A lead became a client or booked customer |
| `growth.reservation.created.v1` | Growth Engine | Professional Studio | A reservation was created |
| `growth.reservation.cancelled.v1` | Growth Engine | Professional Studio | A reservation was cancelled |

## Professional Studio Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `studio.session.started.v1` | Professional Studio | Growth Engine, AI Platform Core | A professional work session started |
| `studio.session.completed.v1` | Professional Studio | Growth Engine, AI Platform Core | A professional work session completed |
| `studio.report.generated.v1` | Professional Studio | Growth Engine, AI Platform Core | A report was generated |
| `studio.service_reference.updated.v1` | Professional Studio | Growth Engine | A sellable service reference changed |

## Velvet Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `velvet.visit.started.v1` | Velvet | Growth Engine | A professional visit record was started |
| `velvet.visit.completed.v1` | Velvet | Growth Engine | A professional visit record was completed |
| `velvet.memory.updated.v1` | Velvet | Velvet, Growth Engine by reference only | Customer professional memory was updated |
| `velvet.note.created.v1` | Velvet | Velvet | A professional note was created |
| `velvet.next_action.created.v1` | Velvet | Growth Engine | A next action reference was created |

### Velvet Event Constraints

Velvet events are stable contracts for professional-memory and visit-record workflows.

Allowed cross-app payload is reference-first:
- `workspaceId`
- `userId`
- `customerId`
- `visitId`
- `reservationId` or `visitScheduleId`
- `noteId`
- `summaryRef`
- `nextActionRef`
- `lastVisitAt`
- `traceId`
- `correlationId`
- `eventId`

Velvet events must not include Customer master records, `paymentStatus`, `salesAmount`, Stripe data, Payment records, Sales records, full professional note bodies, full conversation histories, API keys, access tokens, or secret prompts unless a future explicit contract approves a minimum scoped subset.

## AI Platform Core Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `ai.activity.created.v1` | AI Platform Core | Calling app, Growth Engine | AI activity was accepted |
| `ai.activity.completed.v1` | AI Platform Core | Calling app, Growth Engine | AI activity completed |
| `ai.activity.failed.v1` | AI Platform Core | Calling app | AI activity failed |
| `ai.usage.recorded.v1` | AI Platform Core | Growth Engine | AI usage was recorded |

## SNS Planner Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `sns.post_draft.created.v1` | SNS Planner | Growth Engine | A post draft was created |
| `sns.post_draft.updated.v1` | SNS Planner | Growth Engine | A post draft was updated |
| `sns.message_draft.created.v1` | SNS Planner | Growth Engine | A contact or follow-up message draft was created |
| `sns.message_draft.updated.v1` | SNS Planner | Growth Engine | A contact or follow-up message draft was updated |

### SNS MessageDraft Event Constraints

MessageDraft events are stable contracts for communication-draft creation and update flows.

Allowed event payload is reference-first:
- `workspaceId`
- `userId`
- `messageDraftId`
- `channel`
- `purpose`
- `targetStudio`
- `inputRef`
- `traceId`
- `correlationId`
- `eventId`

MessageDraft events must not include Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, API keys, access tokens, or secret prompts.

## Pending Events

These events are expected but not yet approved as stable contracts.

| Event | Reason |
| --- | --- |
| `growth.campaign.created.v1` | Campaign model is not finalized |
| `growth.nurture_action.created.v1` | Nurturing workflow model is not finalized |
| `studio.recommendation.created.v1` | Recommendation payload requires privacy review |
