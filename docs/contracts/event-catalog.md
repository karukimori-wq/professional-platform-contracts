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

## Communication Planner Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `communication.message.received.v1` | Communication Planner | Growth Engine, Platform Admin by operational reference | A channel message was received and linked to a person/conversation |
| `communication.message.sent.v1` | Communication Planner | Growth Engine, Platform Admin by operational reference | A user-approved reply was sent through a channel adapter |
| `communication.context.updated.v1` | Communication Planner | Communication Planner, AI Platform Core by activity reference | A conversation context projection was updated |
| `communication.promise.created.v1` | Communication Planner | Growth Engine by reference where contracted | A communication promise was created from conversation context |
| `communication.next_action.created.v1` | Communication Planner | Growth Engine by reference where contracted | A communication next action was created |
| `communication.reply_draft.created.v1` | Communication Planner | Communication Planner, Platform Admin by operational reference | A conversation-contextual reply draft was created |
| `communication.reply_safety.checked.v1` | Communication Planner | Communication Planner, Platform Admin by operational reference | A reply safety check was completed |
| `communication.person_channel.linked.v1` | Communication Planner | Growth Engine by reference where customer linkage exists | A channel identity was linked to a communication person |

### Communication Planner Event Constraints

Communication Planner events are stable contracts for 1-to-1 conversation, reply, and safety workflows.

Allowed cross-app payload is reference-first:
- `workspaceId`
- `userId`
- `personId`
- `customerId` only as a Growth Engine reference when linked
- `conversationId`
- `channelIdentityId`
- `messageId`
- `contextId`
- `topicId`
- `promiseId`
- `nextActionId`
- `replyDraftId`
- `safetyCheckId`
- `channel`
- `safetyStatus`
- `traceId`
- `correlationId`
- `eventId`

Communication Planner events must not include Customer master records, payment state, sales amounts, Stripe data, full message bodies, full conversation histories, full ConversationContext bodies, full Velvet professional memory bodies, full Report bodies, API keys, access tokens, or secret prompts.

`communication.message.sent.v1` must be emitted only after SafetyCheck is completed or explicitly accepted by the user according to the send contract.

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
| `sns.message_draft.created.v1` | SNS Planner | Growth Engine | A simple contact or follow-up message draft was created |
| `sns.message_draft.updated.v1` | SNS Planner | Growth Engine | A simple contact or follow-up message draft was updated |

### SNS MessageDraft Event Constraints

MessageDraft events are stable contracts for simple business-initiated contact draft creation and update flows. They do not cover live conversation reply, channel send, or safety-check workflows; those belong to Communication Planner.

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

MessageDraft events must not include Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts.

## Pending Events

These events are expected but not yet approved as stable contracts.

| Event | Reason |
| --- | --- |
| `growth.campaign.created.v1` | Campaign model is not finalized |
| `growth.nurture_action.created.v1` | Nurturing workflow model is not finalized |
| `studio.recommendation.created.v1` | Recommendation payload requires privacy review |
