# AI Platform Core Repository Contract

AI Platform Core owns the common AI execution platform.

It is not a business application and does not own Growth Engine decisions or Professional Studio domain logic.

## Current Production Status

Status date: 2026-08-25

AI Platform Core has completed its Cloudflare infrastructure migration.

- Repository: `karukimori-wq/ai-platform-core`
- Production URL: `https://ai-platform-core.karukimori.workers.dev`
- Runtime: Cloudflare Workers
- Persistence: Cloudflare D1 `ai-platform-core`
- Cloudflare migration status: `completed`
- D1 base persistence readiness: `complete`
- Activity production persistence E2E: `complete`
- Usage production persistence E2E: `complete`
- workspace/user isolation baseline: `complete`
- Current phase: `production_hardening`

This does not mark AI Platform Core as fully finished. The infrastructure migration is complete; formal authentication/authorization, additional D1 E2E coverage, event persistence/readiness, and cross-app production hardening remain active work.

## Verified Production Evidence

The AI Platform Core implementation track has verified:

- Cloudflare Worker deploy
- Cloudflare D1 binding
- D1 remote schema applied
- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `GET /api/persistence/status`
- `POST /api/persistence/roundtrip`
- `driver: d1`
- `d1Reachable: true`
- `databaseBackedPersistenceReady: true`
- `roundtripReady: true`
- Activity production execution and D1 persistence
- Activity production retrieval
- Usage production persistence and retrieval
- Echo Provider execution
- different `workspaceId` / `userId` execution
- cross-scope Activity read rejection
- Production E2E GitHub Actions green

## Must Implement

- Workspace, project, environment, role, permission
- API key and webhook infrastructure
- Capability registry
- Activity execution and logging
- Usage tracking
- Prompt templates
- Tool registry
- Workflow runtime
- Evaluators
- Events with `ai.*` prefix
- D1-backed Activity and Usage persistence
- Provider abstraction and execution outcomes
- Formal authentication and authorization boundaries

## Must Not Implement

- Customer acquisition strategy
- Nurturing workflow decisions
- Fortune-telling calculations
- Report PDF layout
- SNS post objective selection
- Customer, Lead, Reservation, Payment, Sales, or Revenue source of truth
- SNS PostDraft or MessageDraft source of truth
- Communication Planner Person, Conversation, Message, ReplyDraft, SafetyCheck, or send workflow source of truth
- Numeria Report source of truth
- Velvet Professional Memory source of truth

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/api-contract.md`
- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/identity-contract.md`
- `docs/contracts/observability-contract.md`
- `docs/release-readiness/ai-platform-core-cloudflare-migration-result.md`
- `schemas/entities/activity.schema.json`
- `schemas/events/ai.activity.completed.v1.schema.json`

## Capability Naming

Use dotted names with domain and action.

Examples:

- `Customer.Find`
- `Report.Generate`
- `PostDraft.Generate`
- `Usage.List`

## Next Priorities

1. Formal authentication / authorization.
2. Outcome, Feedback, and Prompt Template production D1 E2E.
3. Event Store / Event Dispatcher / stable events / observability production hardening.
4. Formal production API contracts for Growth Engine, Numeria Studio, SNS Planner, Communication Planner, and Velvet.
5. Platform Admin monitoring hardening for AI Platform Core.
