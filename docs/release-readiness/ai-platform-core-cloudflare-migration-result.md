# AI Platform Core Cloudflare Migration Result

Status date: 2026-08-25

## Summary

AI Platform Core has completed its Cloudflare infrastructure migration.

The production runtime for AI Platform Core is now:

- Runtime: Cloudflare Workers
- Persistence: Cloudflare D1
- D1 database: `ai-platform-core`
- Repository: `karukimori-wq/ai-platform-core`
- Production URL: `https://ai-platform-core.karukimori.workers.dev`
- Cloudflare migration status: `completed`
- Current phase: `production_hardening`

This record closes the Cloudflare migration phase for AI Platform Core. Future work should not repeat the migration work unless a new architecture decision explicitly reopens it.

AI Platform Core as a product is not complete. Its infrastructure and base persistence are complete; production hardening continues.

## Production Persistence Evidence

The following production persistence conditions have been confirmed by the AI Platform Core implementation track:

- `driver`: `d1`
- `d1Configured`: `true`
- `d1Reachable`: `true`
- `databaseBackedPersistenceReady`: `true`
- `roundtripReady`: `true`

Verified D1-backed domains:

- Activity
- Analytics Usage
- Activity Outcome
- Activity Feedback
- Prompt Template
- Runtime Storage

Activity and Usage have production E2E verification. Outcome, Feedback, Prompt Template, and Event persistence require additional production E2E hardening.

## Production Workflow Evidence

The production workflow verifies:

1. lint
2. test
3. build
4. Cloudflare authentication
5. D1 existence/binding check
6. remote schema application
7. Worker deploy
8. health/version/contracts verification
9. D1 persistence status and roundtrip
10. Activity production E2E
11. Usage production E2E
12. workspace/user isolation baseline

## Source of Truth Boundary

AI Platform Core owns:

- AI Runtime
- AI Activity
- AI Usage / Analytics
- Provider abstraction
- Capability
- Prompt
- Knowledge
- Workflow
- Event infrastructure
- SDK / Gateway
- Common AI execution foundation

AI Platform Core must not own:

- Customer master
- Lead lifecycle
- Reservation
- Payment
- Sales / Revenue
- SNS PostDraft
- SNS MessageDraft
- Communication Person
- Communication Conversation
- Communication Message
- Communication ReplyDraft / SafetyCheck / send workflow
- Numeria Report
- Velvet Professional Memory

Cloudflare migration does not change application responsibility boundaries.

## Identity Status

MVP identity remains:

- `workspaceId`
- `userId`
- `ownerUserId` where applicable

`professionalId` is not required.

Production E2E confirms that Activity reads are scoped by workspace/user and cross-scope reads are rejected.

The current `x-client-id` scoped-read mechanism is not the final formal authentication model. Formal authentication and authorization remain the next major AI Platform Core hardening priority.

## Current Phase Record

| Area | Status |
| --- | --- |
| Cloudflare infrastructure migration | COMPLETE |
| D1 base persistence readiness | COMPLETE |
| Activity Production persistence E2E | COMPLETE |
| Usage Production persistence E2E | COMPLETE |
| workspace/user isolation baseline | COMPLETE |
| formal Authentication / Authorization | IN_PROGRESS / NEXT |
| Outcome / Feedback / Prompt Production E2E | NEXT |
| Event Production persistence/readiness | NEXT |
| cross-app production integration hardening | NEXT |

## Next Development Plan

Priority 1: formal authentication / authorization.

Priority 2: Outcome, Feedback, and Prompt Template production D1 E2E.

Priority 3: Event Store / Event Dispatcher / stable events / observability production hardening.

Priority 4: formal production API contracts for:

- Growth Engine
- Numeria Studio
- SNS Planner
- Communication Planner
- Velvet

Priority 5: Platform Admin monitoring hardening for AI Platform Core.

## Platform Admin Monitoring Requirements

Platform Admin should monitor AI Platform Core production readiness using operational snapshot data only.

Minimum endpoints:

- `GET https://ai-platform-core.karukimori.workers.dev/health`
- `GET https://ai-platform-core.karukimori.workers.dev/version`
- `GET https://ai-platform-core.karukimori.workers.dev/contracts/status`
- `GET https://ai-platform-core.karukimori.workers.dev/api/persistence/status`

Optional owner/test-gated endpoint:

- `POST https://ai-platform-core.karukimori.workers.dev/api/persistence/roundtrip`

Platform Admin must not store AI prompt bodies, secret provider credentials, customer records, conversation bodies, report bodies, professional memory bodies, payment state, or sales amounts.
