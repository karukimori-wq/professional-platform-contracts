# Numeria Studio Cloudflare Migration Result

Status date: 2026-08-27

## Summary

Numeria Studio Cloudflare infrastructure migration is complete.

Repository:

- `karukimori-wq/numeria-studio`

Production architecture:

- Cloudflare Worker API
- Cloudflare Static Assets
- Cloudflare D1
- Worker DB binding
- D1 remote schema

This records a completed infrastructure migration, not completion of every future Numeria Studio product feature.

## Verified Production Evidence

The following are verified in Production:

- Cloudflare Worker Production deploy
- Cloudflare Static Assets deploy
- Cloudflare D1
- Worker DB binding
- D1 remote schema
- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `GET /api/persistence/status`
- `POST /api/persistence/roundtrip`
- `driver=d1`
- `d1Reachable=true`
- `databaseBackedPersistenceReady=true`
- `roundtripReady=true`
- Session Production E2E
- Report Production E2E
- `workspaceId + userId` scope verification
- Growth Engine reference integration
- GitHub Actions Cloudflare Production Workflow Green

## Current Phase

| Area | Status |
| --- | --- |
| Cloudflare infrastructure migration | COMPLETE |
| D1 base persistence | COMPLETE |
| Session Production persistence | COMPLETE |
| Report Production persistence | COMPLETE |
| workspace/user isolation | COMPLETE |
| Growth Engine reference integration | COMPLETE |
| Cloudflare Production readiness | COMPLETE |
| Business feature expansion | NEXT |
| AI integration enhancement | NEXT |

## Source of Truth Boundary

Numeria Studio owns:

- Session
- Report
- Appraisal Logic
- Calculation Result
- Numeria Snapshot
- Numeria persistence metadata

Numeria Studio must not own:

- Customer
- Reservation
- Payment
- Sales / Revenue
- Conversation
- Message
- ConversationContext
- ReplyDraft
- SafetyCheck
- PostDraft
- MessageDraft
- AI Activity
- AI Usage
- AI Capability
- AI Prompt / Knowledge / Workflow
- Platform Admin operational monitoring snapshots

## D1 Boundary

Cloudflare D1 is the canonical persistence layer for Numeria-owned records only.

D1 may hold:

- Session
- Report
- Calculation Result
- Numeria Snapshot
- Numeria persistence readiness metadata

D1 must not copy Customer Master, Reservation, Payment, Sales, Communication Planner records, SNS Planner records, or AI Platform Core records into Numeria Studio as new sources of truth.

## Identity

MVP identity is `workspaceId + userId`.

`professionalId` is not required.

## Growth Engine Integration

Growth Engine and Numeria Studio use reference IDs only.

Allowed inbound references:

- `workspaceId`
- `userId`
- `reservationId`
- `customerId`
- `traceId`
- `correlationId`

Allowed outbound references:

- `sessionId`
- `reportId`
- `reportRef`
- `traceId`
- `correlationId`

Numeria Studio must not return Report body, Customer information, Payment, Sales, or conversation bodies to Growth Engine by default.

## AI Platform Core Boundary

AI Platform Core remains canonical for:

- AI Activity
- AI Usage
- Capability
- Prompt
- Knowledge
- Workflow

Numeria Studio may call AI Platform Core for scoped execution, but it must not create an independent AI ledger, capability registry, prompt registry, knowledge store, or workflow source of truth.

## Communication Planner Boundary

Numeria Studio does not share or own Conversation, Message, ConversationContext, ReplyDraft, or SafetyCheck.

Any future integration must be reference-only.

## Platform Admin Monitoring

Platform Admin should treat Numeria Studio Cloudflare Production as the canonical monitoring target for health, version, contracts, and persistence readiness.

Minimum monitored surfaces:

- `/health`
- `/version`
- `/contracts/status`
- `/api/persistence/status`
- `/api/persistence/roundtrip` when authorized/test-gated

Platform Admin stores operational snapshots only.

## Stable Events

Numeria Studio uses only the stable Professional Studio events:

- `studio.session.started.v1`
- `studio.session.completed.v1`
- `studio.report.generated.v1`

Legacy event names must not be used.

## Next Development Priorities

Priority 1:

- Session feature strengthening
- Report management
- appraisal history

Priority 2:

- report generation
- templates
- UI improvements

Priority 3:

- Growth Engine Business Flow

Priority 4:

- AI Platform Core Capability integration

Priority 5:

- Platform Admin observability hardening

## Platform-wide Migration Impact

Cloudflare migration completed:

- Communication Planner
- AI Platform Core
- Platform Admin
- Numeria Studio

Remaining Cloudflare migration candidates:

- SNS Planner
- Growth Engine

Recommended next migration target:

- SNS Planner, after confirming GitHub main migration status. Growth Engine should remain the final-stage candidate because it owns Customer, Reservation, Payment, Sales, and central cross-app integrations.
