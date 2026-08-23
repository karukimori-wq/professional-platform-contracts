# Professional Platform Infrastructure and Migration Matrix

Status date: 2026-08-23

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
| AI Platform Core | ChatGPT Sites preview | not_evaluated | ready | mvp_ready | not_evaluated | ai_activity_usage_capability | Owns AI Activity, AI Usage, AI Capability. |
| Platform Admin | ChatGPT Sites preview | Operational snapshots only | ready | mvp_ready | not_evaluated | monitoring | Must not own business or professional canonical records. |
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

## Cloudflare Reference Architecture Rule

Communication Planner proves that Cloudflare Workers + D1 can support a production Professional Platform app.

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

Platform Admin must not store:

- Message body
- ReplyDraft body
- ConversationContext body
- Provider credentials
- Webhook secrets
- Customer master records

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
