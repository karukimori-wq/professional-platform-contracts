# Communication Planner Cloudflare Migration Result

Status date: 2026-08-23

## Summary

Communication Planner has completed its Cloudflare migration.

The production runtime for Communication Planner is now:

- Runtime: Cloudflare Workers
- Persistence: Cloudflare D1
- Repository: `karukimori-wq/Communication-Planner`
- MVP status: completed
- Current phase: real_provider_integration
- Cloudflare migration status: completed

This record closes the Cloudflare migration phase for Communication Planner. Future work should not repeat the migration work unless a new architecture decision explicitly reopens it.

## Production Persistence Evidence

The following production persistence conditions have been confirmed by the Communication Planner implementation track:

- `driver`: `d1`
- `d1Configured`: `true`
- `d1Reachable`: `true`
- `databaseBackedPersistenceReady`: `true`
- `roundtripReady`: `true`

The dashboard projection now uses D1-backed state rather than a memory store.

## Completed MVP Components

Communication Planner MVP foundation is complete for the following owned domains:

- Unified Inbox
- Communication Person projection
- ChannelIdentity
- Conversation
- Message
- ConversationContext
- Topic
- Promise
- Communication NextAction
- ReplyDraft
- SafetyCheck
- ReplySendDecision
- ChannelAdapter integration state

## Source of Truth Boundary

Communication Planner owns:

- Unified Inbox
- Communication Person projection
- ChannelIdentity
- Conversation
- Message
- ConversationContext
- Topic
- Promise
- Communication NextAction
- ReplyDraft
- SafetyCheck
- ReplySendDecision
- ChannelAdapter integration state

Communication Planner must not own:

- Customer master
- Lead lifecycle
- Reservation
- Payment
- Sales or Revenue
- SNS PostDraft
- Numeria Report
- Velvet Professional Memory
- AI Usage

Cloudflare migration does not change application responsibility boundaries.

## Production Safety Evidence

Communication Planner's primary safety requirement is preventing cross-person communication mistakes.

Production E2E verification has confirmed the following controls at API and D1 persistence level:

- Reply scope is fixed by `workspaceId + personId + conversationId`
- Context lookup is restricted to `workspaceId + personId`
- Person A and Person B context are separated
- SafetyCheck rejects mismatched Person scope
- Sending to a channel different from the source Conversation channel is rejected
- SafetyCheck is required before send
- Draft content hash is recorded during SafetyCheck
- Draft changes after SafetyCheck return `STALE_SAFETY_CHECK`
- Re-running SafetyCheck allows a valid send
- Outbound Message is persisted in D1
- ReplySendDecision is persisted in D1
- Duplicate sends for the same ReplyDraft are rejected
- Inbound message idempotency is enforced
- Provider send idempotency is enforced

## Provider Integration Status

Provider readiness gates exist for:

- LINE
- Instagram
- X

Current provider modes are intentionally fail-closed:

- LINE: `dry_run`
- Instagram: `dry_run`
- X: `dry_run`

Live provider sending must remain disabled until the relevant readiness conditions are met.

Provider readiness must check at least:

- Credential configured
- Webhook signature verification
- Provider rate limit handling
- Provider error mapping
- Live-send readiness

Secret values must not be returned in API responses or logs.

## LINE Real Provider Integration Status

LINE is the next active provider integration track.

Implemented in code:

- LINE Messaging API push send
- Dry-run and live mode switch
- Channel Access Token usage
- Provider idempotency
- LINE native webhook normalization
- `webhookEventId`
- `source.userId`
- `groupId` and `roomId`
- `X-Line-Signature` verification
- HMAC-SHA256/base64 verification using `LINE_CHANNEL_SECRET`
- LINE Webhook to D1 Message persistence
- Person and Conversation generation
- Workspace routing

Not complete yet:

- LINE Developers production setup
- Production credential configuration
- Webhook URL registration
- Real inbound webhook from a LINE account
- Unified Inbox real provider reflection
- Real LINE reply send
- Full production provider roundtrip

Current phase is therefore:

`Cloudflare migration completed -> MVP foundation completed -> LINE real provider integration in progress`

## Roadmap

### CP Phase 1: LINE Real Provider Integration

Validate this production flow:

LINE -> Webhook -> Communication Planner -> D1 -> Unified Inbox -> Person Context -> ReplyDraft -> SafetyCheck -> Send -> LINE -> ReplySendDecision

### CP Phase 2: Instagram Real Provider Integration

Apply the provider adapter and safety gate pattern established by LINE to Instagram.

### CP Phase 3: X Real Provider Integration

Apply the same safety boundary to X.

### CP Phase 4: AI Reply Assistance

Add AI-assisted reply drafting only after provider integration is stable.

AI generation must require:

- `workspaceId`
- `personId`
- `conversationId`

Context retrieval must remain limited to `workspaceId + personId`.

AI output must be saved as ReplyDraft and must never bypass SafetyCheck or the Send Gate.

## Platform Admin Monitoring Expectations

Platform Admin should monitor Communication Planner operational status only.

Recommended monitored fields:

- `/health`
- `/version`
- `/contracts/status`
- Persistence status
- Provider readiness status
- Provider mode: `dry_run` or `live`
- Safety E2E status references
- Last checked timestamp
- Status code
- Error code
- Trace and correlation IDs where applicable

Platform Admin must not store:

- Message body
- ReplyDraft body
- ConversationContext body
- Provider credentials
- Webhook secrets
- Customer master records

## Operational Rules

- professional-platform-contracts records contracts, boundaries, integration state, infrastructure policy, migration state, and readiness state.
- Application implementation remains owned by each app repository.
- Unknown app states must not be inferred from older documents. Check the target repository main before updating status.
- Communication Planner's Cloudflare migration is a proven reference architecture, not an automatic mandate to migrate every app.
- Other app migrations must be evaluated individually based on runtime, persistence, storage, auth, integrations, vendor dependencies, migration risk, and production verification.
