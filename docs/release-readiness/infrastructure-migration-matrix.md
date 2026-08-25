# Professional Platform Infrastructure and Migration Matrix

Status date: 2026-08-26

## Purpose

This document tracks the Professional Platform's application-level runtime, persistence, production readiness, and Cloudflare migration status.

professional-platform-contracts is not an implementation repository. It records:

- Contracts
- Responsibility boundaries
- Source of truth ownership
- Integration state
- Infrastructure policy
- Migration status
- Production readiness
- Cross-app roadmap

Implementation code remains owned by each application repository.

## Cloudflare Migration Status Vocabulary

Use the following values consistently:

- `not_evaluated`: no current migration assessment has been completed
- `planned`: migration is intended but not started
- `in_progress`: implementation work is underway
- `production_verification`: deployed or nearly deployed, but production verification is not complete
- `completed`: production migration is complete and verified
- `not_required`: migration is not needed for this app

Unknown values must not be inferred from older notes. Check the target repository main before changing an app status.

## Application Matrix

| App | Runtime | Persistence | Contract status | Production readiness | Cloudflare migration status | Current phase | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| professional-platform-contracts | GitHub documentation repository | Not applicable | ready | Not applicable | not_required | contract_governance | Contract, responsibility, roadmap, readiness, and migration tracking only. |
| Growth Engine | Vercel | Postgres | ready | external_pilot_ready | not_evaluated | external_pilot | Owns Customer, Lead, Reservation, Payment, Sales, Revenue, Funnel, Follow-up, Referral. |
| Numeria Studio | ChatGPT Sites | not_evaluated | ready | mvp_ready_with_environment_warning | not_evaluated | mvp_operations | Owns Session and Report. Must not own Customer, Payment, or Sales. |
| SNS Planner | ChatGPT Sites | not_evaluated | ready | mvp_ready_with_ai_core_environment_warning | not_evaluated | postdraft_and_messagedraft_mvp | Owns PostDraft and MessageDraft. One-to-many content remains separate from Communication Planner. |
| Communication Planner | Cloudflare Workers | Cloudflare D1 | ready | mvp_completed | completed | real_provider_integration | Cloudflare migration completed. Current provider mode is dry-run until real provider readiness gates pass. |
| AI Platform Core | Cloudflare Workers | Cloudflare D1 | ready | production_hardening | completed | ai_core_production_hardening | Cloudflare/D1 migration completed. Activity and Usage production D1 E2E complete; formal auth and additional E2E hardening remain next. |
| Platform Admin | Cloudflare Workers | Cloudflare D1 operational snapshots | ready | production_hardening | completed | monitoring_production_hardening | Cloudflare migration completed. Owns operational snapshots only; Service Binding monitoring is active for AI Platform Core and Communication Planner. |
| Velvet | Vercel | production_verification_pending | ready | needs_persistence_verification | in_progress | professional_memory_mvp | Owns Velvet Professional Memory, Visit, Note, Timeline, NextAction. Must not own Customer, Reservation, Payment, or Sales. |

## Communication Planner Status

Communication Planner is the first app with a completed Cloudflare migration.

Detailed result:

- `docs/release-readiness/communication-planner-cloudflare-migration-result.md`

Current Communication Planner state:

- Repository: `karukimori-wq/Communication-Planner`
- Runtime: Cloudflare Workers
- Persistence: Cloudflare D1
- MVP status: completed
- Current phase: real_provider_integration
- Cloudflare migration status: completed

Verified production persistence state:

- `driver`: `d1`
- `d1Configured`: `true`
- `d1Reachable`: `true`
- `databaseBackedPersistenceReady`: `true`
- `roundtripReady`: `true`

## AI Platform Core Status

AI Platform Core has completed its Cloudflare infrastructure migration.

Detailed result:

- `docs/release-readiness/ai-platform-core-cloudflare-migration-result.md`

Current AI Platform Core state:

- Repository: `karukimori-wq/ai-platform-core`
- Production URL: `https://ai-platform-core.karukimori.workers.dev`
- Runtime: Cloudflare Workers
- Persistence: Cloudflare D1
- D1 database: `ai-platform-core`
- Cloudflare migration status: completed
- Current phase: production_hardening

Verified production persistence state:

- `driver`: `d1`
- `d1Configured`: `true`
- `d1Reachable`: `true`
- `databaseBackedPersistenceReady`: `true`
- `roundtripReady`: `true`

Verified production E2E:

- Activity production execution and persistence
- Activity production retrieval
- Usage production persistence and retrieval
- Echo Provider execution
- different `workspaceId` / `userId` execution
- cross-scope Activity retrieval rejection

Remaining AI Platform Core hardening:

- formal authentication / authorization
- Outcome / Feedback / Prompt Template production D1 E2E
- Event Store / Event Dispatcher / stable events / observability production hardening
- cross-app production integration hardening

## Platform Admin Status

Platform Admin has completed its Cloudflare infrastructure migration.

Detailed result:

- `docs/release-readiness/platform-admin-cloudflare-migration-result.md`

Current Platform Admin state:

- Repository: `karukimori-wq/Platform-Admin`
- Production URL: `https://platform-admin.karukimori.workers.dev`
- Runtime: Cloudflare Workers
- Framework: Next.js 16 + OpenNext Cloudflare
- Persistence: Cloudflare D1
- D1 database: `platform-admin`
- Cloudflare migration status: completed
- Current phase: production_hardening

Verified production persistence state:

- `driver`: `d1`
- `d1Configured`: `true`
- `d1Reachable`: `true`
- `databaseBackedPersistenceReady`: `true`
- `roundtripReady`: `true`

Verified production monitoring:

- Platform Admin health, version, and contracts checks
- Platform Admin persistence status and roundtrip
- cross-app monitoring baseline
- monitoring snapshot D1 persistence
- monitoring snapshot retrieval from D1
- AI Platform Core monitoring through `AI_PLATFORM_CORE_SERVICE`
- Communication Planner monitoring through `COMMUNICATION_PLANNER_SERVICE`
- Growth Engine, SNS Planner, and Numeria Studio current endpoint monitoring

Velvet monitoring must be updated after its current Production or Cloudflare endpoint is finalized. A stale Velvet endpoint returning 404 is a target-configuration issue, not a Platform Admin Cloudflare migration failure.

Remaining Platform Admin hardening:

- canonical monitoring data and old preview snapshot cleanup
- human operator authentication / authorization
- cross-app persistence/integration readiness monitoring hardening
- Service Binding additions for future Cloudflare-hosted apps
- trace, correlation, request, event, error, duration, and operation observability hardening
- operator UI improvements for Production readiness decisions

## Cloudflare Reference Architecture Rule

Communication Planner, AI Platform Core, and Platform Admin prove that Cloudflare Workers + D1 can support production Professional Platform apps.

This does not mean every app should automatically move to Cloudflare.

Each app must be evaluated separately for:

- Current hosting
- Database
- Storage
- Auth
- External integrations
- Vercel-specific dependencies
- Supabase-specific dependencies
- Migration risk
- Production verification requirements

## Standard Cloudflare Migration Follow-up

When another app moves to Cloudflare, use this sequence as the standard candidate:

1. Complete the app migration.
2. Verify Production `/health`, `/version`, and `/contracts/status`.
3. Verify persistence readiness and roundtrip where the app owns durable state.
4. Update Platform Admin monitoring targets.
5. Add Service Binding when Platform Admin and the target app run in the same Cloudflare environment and Worker-to-Worker monitoring is appropriate.
6. Run Platform Admin Production E2E against the migrated app.
7. Record the Production readiness result in professional-platform-contracts.

Do not mark a migration `completed` until Production evidence exists.

## Source of Truth Boundaries

Cloudflare migration must not change application responsibility boundaries.

### Growth Engine

Owns:

- Customer
- Lead
- Reservation
- Payment
- Sales
- Revenue
- Funnel
- Follow-up
- Referral

Must not own:

- Numeria Report body
- Velvet Professional Memory
- SNS PostDraft
- SNS MessageDraft
- Communication Conversation or Message
- AI Usage canonical records

### Numeria Studio

Owns:

- Session
- Report
- PDF and report rendering internals
- Appraisal logic

Must not own:

- Customer master
- Payment
- Sales
- PostDraft
- MessageDraft
- Communication Conversation

### SNS Planner

Owns:

- PostDraft
- MessageDraft
- One-to-many SNS content planning
- Marketing content generation metadata

Must not own:

- Customer master
- Payment
- Sales
- Communication Person context
- Conversation or Message source of truth

### Communication Planner

Owns:

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

Must not own:

- Customer master
- Lead lifecycle
- Reservation
- Payment
- Sales or Revenue
- SNS PostDraft
- Numeria Report
- Velvet Professional Memory
- AI Usage

### Velvet

Owns:

- Velvet Professional Memory
- Visit
- Note
- Timeline
- Professional NextAction

Must not own:

- Customer master
- Reservation
- Payment
- Sales
- Communication Conversation or Message
- SNS MessageDraft

### AI Platform Core

Owns:

- AI Activity
- AI Usage
- AI Capability
- AI Runtime
- Provider abstraction
- Prompt Template
- Runtime Storage
- Activity Outcome / Feedback
- Event infrastructure

Must not own:

- Customer
- Reservation
- Payment
- Sales
- Report body
- Conversation body
- Professional Memory body

### Platform Admin

Owns:

- Operational snapshots
- Monitoring rows
- Contract/readiness status views
- Error and integration status summaries
- app connection snapshots
- integration logs
- workspace operational summaries
- persistence/readiness monitoring information

Must not own:

- Customer
- Lead
- Reservation
- Payment
- Sales
- Report
- PostDraft
- MessageDraft
- Conversation
- Message
- Professional Memory
- AI Activity canonical records

Platform Admin D1 is for operational projections only. It must not create a new source of truth for records owned by Growth Engine, Numeria Studio, Velvet, SNS Planner, Communication Planner, AI Platform Core, or AI SNS Growth Office.

## Platform Admin Monitoring Additions

Platform Admin should track Communication Planner as an operational app.

Minimum recommended monitoring targets:

- `/health`
- `/version`
- `/contracts/status`
- Persistence readiness
- Provider readiness
- Provider mode: `dry_run` or `live`
- Safety E2E status references
- Last checked timestamp
- Status code
- Error code
- Trace ID
- Correlation ID
- Service Binding transport when used

Platform Admin must not store:

- Message body
- ReplyDraft body
- ConversationContext body
- Provider credentials
- Webhook secrets
- Customer master records

For Cloudflare-hosted internal app monitoring, Service Binding is the standard candidate transport. Current bindings:

- `AI_PLATFORM_CORE_SERVICE`
- `COMMUNICATION_PLANNER_SERVICE`

Platform Admin may normalize flat contract responses and `{ status, data: { ... } }` envelope responses into a common monitoring model. This adapter behavior does not require all apps to adopt a Platform Admin-specific API envelope.

Old preview snapshots must be cleaned up or clearly marked non-canonical when a target app has a Cloudflare Production endpoint.

## Communication Planner Roadmap

### Phase 1: LINE Real Provider Integration

Target production flow:

LINE -> Webhook -> Communication Planner -> D1 -> Unified Inbox -> Person Context -> ReplyDraft -> SafetyCheck -> Send -> LINE -> ReplySendDecision

### Phase 2: Instagram Real Provider Integration

Apply the provider adapter and safety gate pattern from LINE to Instagram.

### Phase 3: X Real Provider Integration

Apply the same safety boundary to X.

### Phase 4: AI Reply Assistance

AI generation must require:

- `workspaceId`
- `personId`
- `conversationId`

AI context retrieval must be restricted to `workspaceId + personId`.

AI output must be saved as ReplyDraft and must not bypass SafetyCheck or the Send Gate.

## Required Update Rule

When a major app milestone completes, update this matrix and the relevant app repository document.

Examples:

- Communication Planner LINE live provider verified
- Velvet persistence verified
- Growth Engine production readiness changes
- SNS Planner MessageDraft contract changes
- Platform Admin monitoring scope changes
- Any app begins or completes a Cloudflare migration

Do not mark an app `completed` for migration or production readiness without production evidence.
