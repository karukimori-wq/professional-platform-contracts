# Numeria Studio Repository Contract

Numeria Studio is the Professional Studio implementation for numerology/appraisal work.

It owns appraisal sessions, calculation results, report generation, report history, report previews, PDF/export internals, and Numeria snapshots.

## Current Production Infrastructure

Numeria Studio Cloudflare infrastructure migration is complete.

Production configuration:

- Runtime: Cloudflare Worker API
- Frontend delivery: Cloudflare Static Assets
- Persistence: Cloudflare D1
- D1 database: `numeria-studio`
- Worker DB binding: complete
- D1 remote schema: complete
- Cloudflare migration status: `completed`
- Current phase: `business_feature_expansion`

Verified production readiness:

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
- GitHub Actions Cloudflare Production Workflow Green

Cloudflare migration itself should not be repeated unless a future explicit migration decision changes the runtime architecture.

## Must Implement

- Fortune-telling domain workflows
- Numerology, Nine Star Ki, Four Pillars, astrology, and other appraisal modules as selected
- Session records referencing Growth Engine records by ID
- Report generation and report history
- PDF preview/export
- Domain-specific appraisal data
- Calculation Result
- Numeria Snapshot
- D1-backed Numeria persistence
- Calls to Growth Engine using reference IDs only
- Calls to AI Platform Core for AI-assisted interpretation and report writing
- Events with `studio.*` prefix

## Must Not Implement

- Canonical Customer master
- Reservation source of truth
- Payment source of truth
- Sales / Revenue source of truth
- Conversation source of truth
- Message source of truth
- Conversation Context source of truth
- ReplyDraft or SafetyCheck source of truth
- SNS PostDraft or MessageDraft source of truth
- AI Activity source of truth
- AI Usage source of truth
- AI Capability, Prompt, Knowledge, or Workflow source of truth

## D1 Ownership Rule

Numeria Studio D1 may persist:

- Session
- Report
- Calculation Result
- Numeria Snapshot
- Numeria persistence metadata needed for readiness and roundtrip checks

Numeria Studio D1 must not persist Growth Engine Customer, Reservation, Payment, Sales, Communication Planner Conversation/Message/ReplyDraft/SafetyCheck, SNS Planner drafts, or AI Platform Core Activity/Usage as canonical records.

## Identity

MVP identity is:

- `workspaceId`
- `userId`

`professionalId` is not required for Numeria Studio MVP or the verified Cloudflare Production flow.

## Growth Engine Boundary

Growth Engine and Numeria Studio integrate by reference IDs only.

Growth Engine may send:

- `workspaceId`
- `userId`
- `reservationId`
- `customerId`
- `traceId`
- `correlationId`

Numeria Studio may return:

- `sessionId`
- `reportId`
- `reportRef`
- `traceId`
- `correlationId`

Numeria Studio must not return Report body, Customer information, Payment, Sales, or conversation bodies to Growth Engine by default.

## AI Platform Core Boundary

Numeria Studio may call AI Platform Core for scoped AI execution.

AI Platform Core remains canonical for:

- AI Activity
- AI Usage
- Knowledge
- Capability
- Prompt
- Workflow

Numeria Studio stores only Numeria-owned references/results. It must not create an independent AI ledger or capability registry.

## Communication Planner Boundary

Numeria Studio does not share or own:

- Conversation
- Message
- ConversationContext
- ReplyDraft
- SafetyCheck

Any Communication Planner integration must use references only and must not move 1-to-1 communication data into Numeria Studio.

## Platform Admin Monitoring

Platform Admin should monitor Numeria Studio Cloudflare Production as a canonical target for:

- `/health`
- `/version`
- `/contracts/status`
- `/api/persistence/status`
- `/api/persistence/roundtrip` where authorized/test-gated

Monitoring rows may include `traceId`, `correlationId`, `workspaceId`, `userId`, status, status code, error code, checked timestamp, runtime, and persistence driver.

Monitoring rows must not include Report bodies, Customer records, Payment, Sales, conversation bodies, AI prompts, API keys, or provider secrets.

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

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/data-ownership.md`
- `docs/contracts/identity-contract.md`
- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/event-flow.md`
- `docs/contracts/observability-contract.md`
- `schemas/entities/session.schema.json`
- `schemas/events/studio.report.generated.v1.schema.json`

## Event Names

Stable Numeria Studio events:

- `studio.session.started.v1`
- `studio.session.completed.v1`
- `studio.report.generated.v1`

Legacy event names must not be used.

## Free / Pro Plan Contract

Numeria Studio will release Free and Pro first.

- Free: 20 appraisals per month and 3 appraisal subjects.
- Pro: appraisals and appraisal subjects are unlimited within Numeria Studio scope.
- Business: future cross-app integration with Growth Engine and other apps; not purchasable in the first release.

Numeria appraisal subjects are Numeria-specific snapshots for appraisal workflows. They must not become canonical Customer master records.

Plan enforcement must be server-side and must keep the MVP identity rule: `workspaceId + userId`, without requiring `professionalId`.
