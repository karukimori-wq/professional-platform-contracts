# Velvet Cloudflare Migration Result

Status date: 2026-08-27

## Summary

Velvet Cloudflare infrastructure migration is complete.

Repository:

- `karukimori-wq/Velvet`

Production:

- `https://velvet.karukimori.workers.dev`

Production architecture:

- Next.js 16
- OpenNext Cloudflare
- Cloudflare Workers
- Cloudflare D1
- D1 database: `velvet`
- Production storage mode: `VELVET_STORAGE_MODE=d1`
- Production auth mode: `VELVET_AUTH_MODE=session`

This records completed Cloudflare infrastructure migration and Customer Memory D1 Production E2E baseline. It does not mark all Velvet repositories as D1-complete.

## Verified Production Evidence

- Next.js 16
- OpenNext Cloudflare build
- Cloudflare Worker Production deploy
- Cloudflare D1 `velvet`
- Worker DB binding
- D1 remote schema
- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `GET /api/persistence/status`
- `POST /api/persistence/roundtrip`
- `driver=d1`
- D1 reachable/readiness
- database-backed persistence readiness
- D1 roundtrip
- Customer Memory D1 write/read
- workspace/user isolation
- Production session authentication
- AI Platform Core Service Binding
- GitHub Actions Cloudflare Production Workflow Green

## Current Phase

| Area | Status |
| --- | --- |
| Cloudflare infrastructure migration | COMPLETE |
| OpenNext Cloudflare Production deploy | COMPLETE |
| D1 base persistence | COMPLETE |
| D1 binding/schema | COMPLETE |
| Persistence readiness | COMPLETE |
| D1 roundtrip | COMPLETE |
| Customer Memory D1 Production E2E | COMPLETE |
| workspace/user isolation baseline | COMPLETE |
| Production session authentication baseline | COMPLETE |
| AI Platform Core Service Binding baseline | COMPLETE |
| Remaining Velvet Repository D1 coverage | IN PROGRESS / NEXT |
| Platform Admin canonical monitoring update | NEXT |
| Velvet business/product feature development | IN PROGRESS |

## Source of Truth Boundary

Velvet owns:

- Professional Memory
- Customer-scoped Professional Memory
- Velvet Visit
- Velvet Note / Service Note
- Professional Timeline
- Professional Next Action
- Professional Recall
- Capture-related Velvet-owned structured information

Velvet must not own:

- Customer master
- Reservation
- Payment
- Sales / Revenue
- SNS MessageDraft
- Communication Person
- ChannelIdentity
- Conversation
- Message
- ConversationContext
- ReplyDraft
- SafetyCheck
- Communication send workflow
- AI Activity
- AI Usage
- AI Capability

Customer master != Velvet.

Customer-scoped Professional Memory = Velvet.

## D1 Boundary

Cloudflare Production canonical persistence driver is D1.

Velvet storage abstraction supports `memory`, `postgres`, and `d1`; new Production features must not become Postgres-only.

Customer Memory D1 write/read and workspace/user isolation are verified.

Full Production D1 coverage for Visit, Note, Timeline, Next Action, Capture, and other Professional Memory repositories remains application development work.

## Identity and Authentication

MVP identity remains `workspaceId + userId / ownerUserId`.

`professionalId` is not required.

Production auth baseline is session bridge:

- `VELVET_AUTH_MODE=session`
- `x-velvet-auth-bridge`
- `x-velvet-workspace-id`
- `x-velvet-user-id`
- `x-velvet-owner-user-id`

`VELVET_SESSION_BRIDGE_SECRET` is a Cloudflare Secret. The secret value must not be stored in this repository.

`demo` and `fixed_owner` are not canonical public Production auth modes.

## AI Platform Core Service Binding

Velvet uses Cloudflare Service Binding:

- `AI_PLATFORM_CORE_SERVICE`

Representative capabilities:

- `velvet.capture.structure`
- `velvet.search.parse_intent`

AI Platform Core remains canonical for AI Runtime, Capability, Prompt, Knowledge, AI Activity, and AI Usage.

## Platform Admin Follow-up

Platform Admin should update Velvet monitoring to:

- `https://velvet.karukimori.workers.dev`

The old Velvet monitoring target that returned 404 should be treated as stale configuration, not a Velvet Cloudflare migration failure.

Platform Admin -> Velvet Service Binding is a future candidate.

## Stable Events

Velvet stable events remain:

- `velvet.visit.started.v1`
- `velvet.visit.completed.v1`
- `velvet.memory.updated.v1`
- `velvet.note.created.v1`
- `velvet.next_action.created.v1`

Legacy event names must not be introduced.

## Migration Learnings

- Extended storage from Postgres-oriented paths to `memory | postgres | d1`.
- Separated PostgreSQL SQL from D1/SQLite differences.
- Added D1 schema for Cloudflare.
- Added D1 support for Customer Memory repository.
- Added D1-aware persistence status.
- Added persistence roundtrip.
- Added Next.js 16 + OpenNext Cloudflare support.
- Added `next.config.js` for Cloudflare/OpenNext compatibility.
- Addressed Cloudflare bundle issues around Postgres package usage.
- Changed Production auth from `fixed_owner` to `session`.
- Introduced `VELVET_SESSION_BRIDGE_SECRET`.
- Unified Production E2E around the session bridge contract.
- Added AI Platform Core Service Binding.

## Platform-wide Migration Impact

Cloudflare migration completed:

- Communication Planner
- AI Platform Core
- Platform Admin
- Numeria Studio
- Velvet

Remaining Cloudflare migration candidates:

- SNS Planner
- Growth Engine

Recommended next migration target:

- SNS Planner, after confirming GitHub/main migration status. Growth Engine should remain the final-stage candidate because it owns Customer, Reservation, Payment, Sales, and central cross-app integrations.
