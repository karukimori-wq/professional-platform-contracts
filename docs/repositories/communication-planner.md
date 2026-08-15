# Communication Planner Repository Contract

Communication Planner is the 1-to-1 communication management app in the Professional Platform family.

It manages person-centered conversations across supported channels and prevents context mixing between different people.

## Role

Communication Planner owns:

- Unified Inbox for 1-to-1 communication
- Communication Person projection
- ChannelIdentity
- Conversation
- Message
- ConversationContext
- Topic
- Promise
- CommunicationNextAction
- ReplyDraft
- SafetyCheck
- ChannelAdapter integration state

Communication Planner is not a marketing-post tool. SNS Planner remains responsible for 1-to-many post creation.

## Required Contracts

This repository must follow:

- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/event-flow.md`
- `docs/contracts/data-ownership.md`
- `docs/contracts/app-responsibilities.md`
- `docs/contracts/identity-contract.md`
- `docs/contracts/observability-contract.md`

## Canonical Ownership

Communication Planner owns communication-specific records only.

It does not own:

- Customer master
- Lead lifecycle source of truth
- Reservation / Visit Schedule source of truth
- Payment source of truth
- Sales / Revenue source of truth
- SNS PostDraft source of truth
- AI Activity / Usage / Capability source of truth
- Professional App domain records such as Numeria Report or Velvet professional memory

Growth Engine remains canonical for Customer, Lead, Reservation, Payment, Sales and Business workflow state.

SNS Planner remains canonical for SNS PostDraft. Existing SNS MessageDraft contracts remain valid for simple business-initiated contact-message drafts until replaced by a future migration contract.

Communication Planner is canonical for conversation-contextual ReplyDraft and SafetyCheck records.

## Reference-first Integration

Growth Engine or a Professional App may pass only reference and routing information:

- `workspaceId`
- `userId`
- `customerId`
- `personId` when already linked
- `conversationId`
- `channel`
- `purpose`
- `inputRef`
- `traceId`
- `correlationId`

Communication Planner must not receive or persist as cross-app input:

- Customer master records
- `paymentStatus`
- `salesAmount`
- Stripe data
- Payment records
- Sales records
- full Report bodies
- full Velvet professional memory bodies
- unrelated full conversation histories
- API keys
- access tokens
- secret prompts

## Person Rule

Communication Planner may maintain an internal `Person` entity for communication identity and routing.

That `Person` is not the Growth Engine Customer master.

A Communication Planner Person may reference Growth Engine Customer by `customerRef.customerId`. It may retain channel display labels and avatars as channel identity metadata only.

## Safety Rule

Reply generation and sending must be scoped by:

- `workspaceId`
- `personId`
- `conversationId`

SafetyCheck must verify that generated reply content is supported by the target person's conversation context. If another person's context is detected, the reply should be blocked or returned as warning according to the operation result.

## Required MVP Endpoints

Minimum public/status endpoints:

- `GET /health`
- `GET /version`
- `GET /contracts/status`

Minimum product APIs:

- `POST /api/channel-events/messages`
- `GET /api/inbox`
- `GET /api/persons/{personId}`
- `GET /api/persons/{personId}/conversations`
- `GET /api/persons/{personId}/context`
- `POST /api/conversations/{conversationId}/reply-drafts`
- `POST /api/reply-drafts/{replyDraftId}/safety-check`
- `POST /api/reply-drafts/{replyDraftId}/send`

## Required Stable Events

- `communication.message.received.v1`
- `communication.message.sent.v1`
- `communication.context.updated.v1`
- `communication.promise.created.v1`
- `communication.next_action.created.v1`
- `communication.reply_draft.created.v1`
- `communication.reply_safety.checked.v1`
- `communication.person_channel.linked.v1`

## AI Platform Core Capabilities

Communication Planner may request AI Platform Core execution for:

- `communication.context.summarize`
- `communication.topic.extract`
- `communication.promise.extract`
- `communication.next_action.suggest`
- `communication.reply.generate`
- `communication.reply.safety_check`
- `communication.intent.classify`

AI Platform Core receives the minimum scoped input needed for the task and records AI Activity / Usage. It must not become the canonical owner of Communication Planner conversation records.

## Platform Admin Monitoring

Platform Admin may monitor:

- health/version/contracts status
- endpoint availability
- latest contract status
- event names
- operational logs
- failed safety checks by reference

Platform Admin must not store Message bodies, ConversationContext bodies, Customer master records, payment data, sales data, access tokens, API keys or secret prompts.

## MVP Readiness

Communication Planner is ready when:

- Inbox groups conversations by person, not only by channel
- `personId` is required for reply generation
- context retrieval is scoped to `workspaceId + personId`
- SafetyCheck runs before send
- send operation shows target person and channel before sending
- events use stable names from the catalog
- observability headers and logs follow the shared contract
- no prohibited business or secret data crosses app boundaries
