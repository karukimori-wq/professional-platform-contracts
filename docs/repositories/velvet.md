# Velvet Repository Contract

Velvet is the Professional Memory app connected to Growth Engine.

It owns customer-scoped professional memory and service-quality workflows. It does not own the shared Customer master, Reservation, Payment, Sales, Communication Planner conversation state, SNS drafts, or AI Platform Core records.

## Current Production Infrastructure

Velvet Cloudflare infrastructure migration is complete.

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
- Cloudflare migration status: `completed`
- Current phase: `repository_d1_coverage_in_progress`

Verified production readiness:

- OpenNext Cloudflare Production deploy
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

Cloudflare migration itself should not be repeated unless a future explicit architecture decision changes the production runtime.

## Storage Abstraction

Velvet storage abstraction supports:

- `memory`
- `postgres`
- `d1`

Cloudflare Production canonical persistence driver is D1. Existing Postgres compatibility may remain for migration/backward-compatibility paths, but new Production features must not be implemented as Postgres-only features.

Cloudflare migration complete does not mean every Velvet repository has completed D1 Production E2E coverage. Remaining repository D1 coverage is application development work.

## Must Implement

- Professional Memory
- Customer-scoped Professional Memory
- Velvet Visit
- Velvet Note / Service Note
- Professional Timeline
- Professional Next Action
- Professional Recall
- Capture-related Velvet-owned structured information
- D1-backed Customer Memory repository baseline
- Persistence status and roundtrip endpoints
- Session bridge production authentication
- AI Platform Core Service Binding integration for scoped AI execution

## Must Not Implement

- Customer master
- Reservation source of truth
- Payment source of truth
- Sales / Revenue source of truth
- SNS MessageDraft source of truth
- Communication Person source of truth
- ChannelIdentity source of truth
- Conversation / Message / ConversationContext source of truth
- ReplyDraft / SafetyCheck source of truth
- Communication send workflow
- AI Activity / AI Usage / AI Capability source of truth

## Customer Boundary

Growth Engine owns Customer master.

Velvet uses `customerId` as a reference and owns Professional Memory attached to that reference.

Customer master != Velvet.

Customer-scoped Professional Memory = Velvet.

## D1 Ownership Rule

Velvet D1 may persist Velvet-owned professional data only:

- Customer-scoped Professional Memory
- Visit
- Note / Service Note
- Timeline
- Next Action
- Recall
- Capture-related Velvet-owned structured information
- Persistence roundtrip records

Customer Memory D1 write/read and workspace/user isolation are Production verified. Full Production D1 coverage for Visit, Note, Timeline, Next Action, Capture, and other Professional Memory repositories remains `IN PROGRESS / NEXT`.

## Identity and Authentication

MVP identity remains:

- `workspaceId`
- `userId`
- `ownerUserId` where workspace ownership is relevant

`professionalId` is not required.

Production auth mode is `session`.

Session bridge headers:

- `x-velvet-auth-bridge`
- `x-velvet-workspace-id`
- `x-velvet-user-id`
- `x-velvet-owner-user-id`

`VELVET_SESSION_BRIDGE_SECRET` is a Cloudflare Secret. Store only the secret name and trust boundary in contracts, never the secret value.

`demo` and `fixed_owner` are not canonical public Production auth modes.

## AI Platform Core Boundary

Velvet uses Cloudflare Service Binding to AI Platform Core:

- `AI_PLATFORM_CORE_SERVICE`

Representative capabilities:

- `velvet.capture.structure`
- `velvet.search.parse_intent`

AI Platform Core owns AI Runtime, Capability, Prompt, Knowledge, AI Activity, and AI Usage. Velvet sends only minimum scoped context/references and remains canonical for Professional Memory mutations.

## Growth Engine Boundary

Growth Engine owns Customer, Reservation, Payment, Sales, and Revenue.

Velvet accepts reference IDs only:

- `workspaceId`
- `userId`
- `customerId`
- `reservationId`
- `visitScheduleId`
- `traceId`
- `correlationId`

Velvet must not duplicate Growth Engine business records as canonical data.

## Communication Planner Boundary

Communication Planner owns Communication Person, ChannelIdentity, Conversation, Message, ConversationContext, Topic, Promise, Communication NextAction, ReplyDraft, SafetyCheck, and send workflow.

Velvet owns Professional Memory, Professional Visit, Service Note, Professional Timeline, and Professional Recall.

Any integration between Velvet and Communication Planner must remain reference-ID-centered and must not copy full conversation state into Velvet.

## SNS Planner Boundary

SNS Planner owns PostDraft and MessageDraft source-of-truth records. If Velvet starts a simple business contact draft, the MessageDraft record remains SNS Planner-owned under the MessageDraft contract.

## Stable Events

Velvet stable events:

- `velvet.visit.started.v1`
- `velvet.visit.completed.v1`
- `velvet.memory.updated.v1`
- `velvet.note.created.v1`
- `velvet.next_action.created.v1`

Legacy event names must not be introduced.

## Platform Admin Monitoring

Velvet canonical Production monitoring target:

- `https://velvet.karukimori.workers.dev`

Platform Admin should update the old Velvet monitoring target that previously returned 404. Platform Admin -> Velvet Service Binding is a future candidate where both Workers run in the same Cloudflare account and internal monitoring is appropriate.

Minimum monitoring surfaces:

- `/health`
- `/version`
- `/contracts/status`
- `/api/persistence/status`
- `/api/persistence/roundtrip` where authorized/test-gated

Platform Admin stores operational snapshots only, not Velvet Professional Memory bodies.

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

## Next Priorities

1. Complete D1 coverage for all Velvet repositories.
2. Improve Professional Memory / Visit / Timeline / Recall / Capture / Next Action product completeness.
3. Strengthen AI Platform Core Capability integration.
4. Update Platform Admin canonical monitoring.
5. Strengthen Observability.
6. Improve mobile-first Professional Memory UI/UX.

## Free / Pro Plan Contract

Velvet will release Free and Pro first.

- Free: 30 customers, 3 months of history visibility, and one-record-at-a-time review.
- Pro: unlimited customers, indefinite history, integrated timeline, and event-based history.
- Business: future reservation, sales, appraisal, SNS, and cross-app business integration; not purchasable in the first release.

Velvet owns professional relationship memory and event/history views. It must not become the Source of Truth for Reservation, Payment, Sales, or Growth Engine Customer master data.

Plan enforcement must be server-side and must keep the MVP identity rule: `workspaceId + userId / ownerUserId`, without requiring `professionalId`.
