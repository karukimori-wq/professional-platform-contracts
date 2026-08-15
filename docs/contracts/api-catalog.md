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

## Communication Planner APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `CommunicationChannelEvent.ReceiveMessage` | Channel Adapter | `messageId`, `personId`, `conversationId` | `communication.message.received.v1` |
| `CommunicationInbox.List` | Communication Planner UI, Growth Engine by reference where contracted | Inbox rows | None |
| `CommunicationPerson.Get` | Communication Planner UI | Person projection with linked channels | None |
| `CommunicationConversation.List` | Communication Planner UI | Conversation list | None |
| `CommunicationContext.Get` | Communication Planner UI | Conversation context projection | None |
| `CommunicationContext.Update` | Communication Planner, AI-assisted workflow | `contextId` | `communication.context.updated.v1` |
| `CommunicationPromise.Create` | Communication Planner, AI-assisted workflow | `promiseId` | `communication.promise.created.v1` |
| `CommunicationNextAction.Create` | Communication Planner, AI-assisted workflow | `nextActionId` | `communication.next_action.created.v1` |
| `CommunicationReplyDraft.Create` | Communication Planner UI | `replyDraftId` | `communication.reply_draft.created.v1` |
| `CommunicationReplySafety.Check` | Communication Planner UI | `safetyCheckId`, safety status | `communication.reply_safety.checked.v1` |
| `CommunicationReplyDraft.Send` | Communication Planner UI | `messageId`, send status | `communication.message.sent.v1` |
| `CommunicationPersonChannel.Link` | Communication Planner UI | `personId`, `channelIdentityId` | `communication.person_channel.linked.v1` |

### Communication Planner HTTP Mapping

MVP HTTP mapping:
- `POST /api/channel-events/messages` maps to `CommunicationChannelEvent.ReceiveMessage`.
- `GET /api/inbox` maps to `CommunicationInbox.List`.
- `GET /api/persons/{personId}` maps to `CommunicationPerson.Get`.
- `GET /api/persons/{personId}/conversations` maps to `CommunicationConversation.List`.
- `GET /api/persons/{personId}/context` maps to `CommunicationContext.Get`.
- `POST /api/conversations/{conversationId}/reply-drafts` maps to `CommunicationReplyDraft.Create`.
- `POST /api/reply-drafts/{replyDraftId}/safety-check` maps to `CommunicationReplySafety.Check`.
- `POST /api/reply-drafts/{replyDraftId}/send` maps to `CommunicationReplyDraft.Send`.
- `POST /api/persons/{personId}/channel-identities` maps to `CommunicationPersonChannel.Link`.

Communication Planner requests must be scoped and reference-first:
- `workspaceId`
- `userId`
- `personId`
- `conversationId`
- `channelIdentityId`
- `customerId` only as a Growth Engine reference when linked
- `inputRef`
- `traceId`
- `correlationId`

Reply generation must require `personId` and `conversationId`. Context lookup must be limited to `workspaceId + personId`.

`CommunicationReplySafety.Check` must verify that generated reply content is supported by the target person's conversation context. If another person's context is detected, the response should be `warning` or `blocked` according to the safety result.

`CommunicationReplyDraft.Send` must require a successful or explicitly accepted SafetyCheck. Send responses should include:
- top-level `status` using `success`, `warning`, `error`, or `skipped`
- `replyDraftId`
- `messageId`
- `sendStatus`
- `personId`
- `conversationId`
- `channel`
- `eventName: communication.message.sent.v1`
- `traceId`
- `correlationId`
- `requestId`

Communication Planner APIs must not receive or return Customer master records, payment state, sales amounts, Stripe data, full Report bodies, full Velvet professional memory bodies, unrelated full conversation histories, API keys, access tokens, or secret prompts.

## AI Platform Core APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Capability.Register` | Product repository | `capabilityId` | None |
| `Activity.Create` | Product runtime | `activityId` | `ai.activity.created.v1` |
| `Activity.Get` | Product runtime | Activity status | None |
| `Usage.List` | Growth Engine, Studio admin, Velvet, Communication Planner | Usage summary / point-accounting state | None |
| `PromptTemplate.Render` | Product runtime | Rendered prompt | None |
| `VelvetCapture.Structure` | Velvet | Structured candidates only; no Velvet mutation | `ai.activity.created.v1` / completion events |
| `VelvetSearch.ParseIntent` | Velvet | Search intent / terms only; no Velvet dataset results | `ai.activity.created.v1` / completion events |
| `CommunicationContext.Summarize` | Communication Planner | Context summary candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationTopic.Extract` | Communication Planner | Topic candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationPromise.Extract` | Communication Planner | Promise candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationNextAction.Suggest` | Communication Planner | Next-action candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationReply.Generate` | Communication Planner | Reply draft candidates only; no send | `ai.activity.created.v1` / completion events |
| `CommunicationReply.SafetyCheck` | Communication Planner | Safety assessment only; no send | `ai.activity.created.v1` / completion events |
| `CommunicationIntent.Classify` | Communication Planner | Intent classification only; no Communication mutation | `ai.activity.created.v1` / completion events |

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

### Communication Planner AI contract constraints

Communication Planner AI operations are execution-only. They must not write canonical Communication records directly.

Allowed AI input is limited to minimum scoped context selected by Communication Planner:
- `workspaceId`
- `userId`
- `personId`
- `conversationId`
- `contextId`
- relevant message references or short scoped excerpts selected for the operation
- `traceId`
- `correlationId`

Do not send Customer master records, payment state, sales amounts, Stripe data, full unrelated conversation histories, other-person memory, full Report bodies, full Velvet professional memory bodies, API keys, access tokens, or secret prompts.

AI responses return candidates or safety assessments only. Communication Planner owns confirmation, mutation, SafetyCheck records, and final send decisions.

## SNS Planner APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `PostDraft.Generate` | Growth Engine | Draft variants | `sns.post_draft.created.v1` |
| `PostDraft.Rewrite` | Growth Engine | Updated draft | `sns.post_draft.updated.v1` |
| `PostTemplate.List` | Growth Engine | Template list | None |
| `MessageDraft.Generate` | Growth Engine | Simple contact or follow-up message draft | `sns.message_draft.created.v1` |
| `MessageDraft.Rewrite` | Growth Engine | Updated simple contact or follow-up message draft | `sns.message_draft.updated.v1` |
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

SNS `MessageDraft` is limited to simple business-initiated contact or follow-up drafts that do not require live ConversationContext, channel send, or SafetyCheck. Conversation-contextual replies and send safety belong to Communication Planner.

`MessageDraft` must not receive or return Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts.

## Naming Rules

- Use PascalCase dotted operation names.
- Operation names describe commands or queries, not HTTP routes.
- Product repositories may map these operations to HTTP, RPC, server actions, or SDK methods.
- Cross-system API names must remain stable even if transport changes.
