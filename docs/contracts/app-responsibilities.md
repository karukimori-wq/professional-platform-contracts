# App Responsibilities

This document defines the responsibility boundary for each app in the Professional Platform family.

## Core Rule

Each app owns one canonical responsibility. Other apps may reference that data, but must not create a competing source of truth.

## Responsibility Table

| Area | Canonical Owner |
| --- | --- |
| Customer management | Growth Engine |
| Reservation / Visit Schedule management | Growth Engine |
| Stripe payment state | Growth Engine |
| Payment | Growth Engine |
| Sales / Revenue | Growth Engine |
| Customer-level sales aggregation | Growth Engine |
| Repeat / referral / contact-measure Business state | Growth Engine |
| Public site | Growth Engine |
| Service and menu publishing | Growth Engine |
| Appraisal session | Numeria Studio |
| Report and PDF generation | Numeria Studio |
| Calculation Result / Numeria Snapshot | Numeria Studio |
| Domain appraisal logic | Numeria Studio |
| SNS post draft | SNS Planner |
| SNS post calendar | SNS Planner |
| Simple SNS message draft | SNS Planner |
| AI SNS marketing company orchestration | AI SNS Growth Office |
| CEOInstruction / SecretaryBrief | AI SNS Growth Office |
| CompanyTask / AgentTask / AgentOutput | AI SNS Growth Office |
| Strategy / draft / publish approval workflow | AI SNS Growth Office |
| AppProject / MarketingRoute / RouteStage | AI SNS Growth Office |
| Audience / Offer / DiagnosisReport | AI SNS Growth Office |
| ContentPlan / ContentDraft / ImageConcept / MediaAsset | AI SNS Growth Office |
| PublishPlan / XMediaUploadJob / XPublishJob | AI SNS Growth Office |
| SNS marketing PerformanceSnapshot | AI SNS Growth Office |
| ExternalKnowledgeReference for marketing work | AI SNS Growth Office |
| 1-to-1 Unified Inbox | Communication Planner |
| Communication Person projection | Communication Planner |
| Channel identity linking | Communication Planner |
| Conversation / Message | Communication Planner |
| Conversation Context / Topic / Promise | Communication Planner |
| Communication NextAction | Communication Planner |
| ReplyDraft / SafetyCheck / send workflow | Communication Planner |
| AI activity execution | AI Platform Core |
| AI usage tracking | AI Platform Core |
| Capability registry | AI Platform Core |
| Velvet professional visit history | Velvet |
| Velvet service / conversation notes | Velvet |
| Velvet preferences / cautions / previous handling | Velvet |
| Velvet customer-specific professional timeline | Velvet |
| Velvet Capture and professional-memory suggestion state | Velvet |
| Velvet gifts / relationship memory / self-investment | Velvet |
| Contract definitions | professional-platform-contracts |
| Cross-app monitoring | Platform Admin |

## Growth Engine

Growth Engine owns the Business foundation for each workspace and is the canonical source for shared customer and commercial state.

### Owns

- Customer
- Lead / Prospect
- Reservation / Visit Schedule
- Payment
- Stripe payment state
- Sales / Revenue
- Customer-level sales aggregation
- Repeat / referral / contact-measure Business state
- Public Site
- Service/Menu
- Campaign intent
- Business plan feature access

### Must Not Own

- Communication Planner full message bodies as canonical data
- Communication Planner full ConversationContext bodies as canonical data
- Velvet confidential service-note bodies as canonical data
- Velvet conversation-note bodies as canonical data
- Velvet professional customer timeline
- Appraisal calculations
- Report/PDF rendering
- SNS post editor internals
- SNS message editor internals
- Communication reply/send internals
- AI runtime internals
- Independent AI usage ledger

### Integration Role

Growth Engine passes reference IDs and minimum workflow context to Professional Apps and Communication Planner.

For Velvet, default input is reference-first:
- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`

For Communication Planner, default input is reference-first:
- `workspaceId`
- `userId`
- `customerId` where linked
- `personId` where already known
- `conversationId` where already known
- `purpose`
- `inputRef`

Growth Engine must not unnecessarily send `paymentStatus`, `salesAmount`, Stripe secrets, payment credentials, Customer master records, full message bodies, full ConversationContext bodies, or unrelated commercial payloads to Communication Planner or Professional Apps.

## Numeria Studio

Numeria Studio owns professional work output for fortune-telling professionals.

Current infrastructure status:
- Runtime: Cloudflare Workers
- Frontend delivery: Cloudflare Static Assets
- Persistence: Cloudflare D1
- D1 database: `numeria-studio`
- Cloudflare migration status: `completed`
- Current phase: `business_feature_expansion`

Cloudflare/D1 migration completion does not change Numeria Studio's responsibility boundary.

### Owns
- Session
- Report
- Appraisal input
- Appraisal result
- Calculation Result
- Numeria Snapshot
- Report generation state
- Domain-specific appraisal logic
- Numeria persistence metadata required for readiness and roundtrip checks

### Must Not Own
- Customer master
- Reservation source of truth
- Payment source of truth
- Sales / Revenue source of truth
- Public site publishing
- Lead lifecycle
- SNS campaign strategy
- 1-to-1 conversation inbox or send workflow
- Conversation / Message / ConversationContext
- ReplyDraft / SafetyCheck
- SNS PostDraft / MessageDraft source of truth
- AI Activity / Usage / Capability source of truth
- AI Prompt / Knowledge / Workflow source of truth
- Platform Admin operational monitoring source of truth

### Integration Role
Numeria Studio references Growth Engine records by ID. External deliverables must use `Report`, not `Document`.

Growth Engine integration is reference-IDs-only. Numeria Studio may receive `workspaceId`, `userId`, `reservationId`, `customerId`, `traceId`, and `correlationId`. Numeria Studio may return `sessionId`, `reportId`, and `reportRef`. It must not return Report body, Customer information, Payment, Sales, or conversation bodies by default.

## SNS Planner

SNS Planner owns 1-to-many SNS content creation and simple business-initiated message draft support.

### Owns
- PostDraft
- Post text variants
- Post status
- Post schedule
- SNS-specific formatting
- Hashtag and image prompt suggestions
- Simple MessageDraft where the task does not require live ConversationContext, channel send, or SafetyCheck
- Message draft status for those simple drafts

### Must Not Own
- Customer master
- Communication Planner Conversation / Message / ConversationContext
- Communication Planner ReplyDraft / SafetyCheck / send workflow
- Velvet confidential professional memory
- Payment state
- Sales state
- Reservation state
- Public site source of truth
- Business lifecycle decisions
- Appraisal reports
- Lead lifecycle source of truth
- Repeat / referral / contact-measure Business source of truth

### Integration Role
SNS Planner receives posting or simple message-draft intent from Growth Engine or an explicit user-selected handoff from a Professional App. Business strategy, audience selection, sales/repeat decisions, and customer lifecycle state remain in Growth Engine.

MessageDraft integrations are reference-first. SNS Planner may receive `workspaceId`, `userId`, `sourceApp`, `targetStudio`, `channel`, `purpose`, `audienceSegment`, `tone`, `cta`, and `inputRef`. It must not receive Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts.

Conversation-contextual replies, channel sending, and cross-person safety checks belong to Communication Planner.

## AI SNS Growth Office

AI SNS Growth Office owns AI-agent-operated SNS marketing company orchestration.

The owner acts as CEO. Secretary AI structures CEO instructions, assigns work to AI employees/departments, and returns decision-ready outputs. The app designs the route from SNS attention to purchase, not isolated SNS posts.

Initial scope:
- owner-only use
- marketing the owner's own apps
- first campaign target: Numeria Studio
- second campaign target: Velvet
- first channel: X
- Japanese-only posts
- image-based X posts included in MVP
- daily metric entry where possible
- later expansion from internal use to customer support and individual-business SaaS

### Owns
- CEOInstruction
- SecretaryBrief
- CompanyTask
- AgentTask
- AgentOutput
- ApprovalRequest
- AppProject
- MarketingRoute
- RouteStage
- Audience
- Offer
- DiagnosisReport
- ContentPlan
- ContentDraft
- ImageConcept
- MediaAsset
- PublishPlan
- XMediaUploadJob
- XPublishJob
- PerformanceSnapshot
- ExternalKnowledgeReference

### Must Not Own
- Customer master
- Lead lifecycle source of truth
- Reservation / Visit Schedule source of truth
- Payment source of truth
- Sales / Revenue source of truth
- SNS Planner PostDraft / MessageDraft source of truth until a future explicit migration contract is approved
- Communication Planner Conversation / Message / ConversationContext source of truth
- Communication Planner ReplyDraft / SafetyCheck / send workflow
- AI Platform Core AI Activity / Usage / Capability source of truth
- Platform Admin operational monitoring source of truth
- External Intelligence development knowledge source of truth

### Approval Rule

AI SNS Growth Office uses three approval stages:

1. Strategy Approval: target, appeal, marketing route, campaign policy, image policy.
2. Draft Approval: X posts, threads, image ideas, profile copy, pinned post, DM route.
3. Publish/Schedule Approval: X media upload, X post, scheduled publish, manual export.

AI may create strategy proposals, drafts, image concepts, and image assets. AI must not publish, schedule, upload final media to X, or mark customer-facing output final without CEO approval.

### X Publishing Rule

X image publishing requires separate records:

- `MediaAsset`: internal asset and provenance
- `XMediaUploadJob`: X media upload execution state
- `XPublishJob`: final X post or schedule execution state

Failed upload or publish jobs must not delete approved drafts, images, or schedule intent. Failures must be represented as `failed` or `manual_required`.

### Integration Role

AI SNS Growth Office may coordinate marketing work across Growth Engine, SNS Planner, Communication Planner, AI Platform Core, Platform Admin, and External Intelligence.

- Growth Engine remains canonical for campaign business state, reservations, payments, sales, customer development, and sales routes.
- SNS Planner remains canonical for SNS PostDraft and simple MessageDraft until an explicit future migration contract moves those responsibilities.
- Communication Planner remains canonical for live 1-to-1 conversations, DM context, reply safety, and channel sending.
- AI Platform Core remains canonical for AI execution, AI Activity, AI Usage, and Capability.
- External Intelligence remains a development knowledge layer and must not become an operational source of truth.

Daily metrics may be stored in `PerformanceSnapshot`. Missing metrics must be represented as `unknown`, not `0`.

### Current Implementation Status

Current implementation is an MVP skeleton, not yet DB-backed:

- Next.js App Router skeleton exists.
- CEO dashboard is the first screen.
- Approval Center, Image Assets, X Publish Queue, and Daily Metrics UI exist.
- Client-side approval actions exist.
- Testable API handler layer exists.
- Seed repository persistence helpers exist.
- API handler tests: 21 passed / 0 failed.

Current public monitoring surface:

- `GET /api/health`
- `GET /api/version`
- `GET /api/contracts/status`

Current product API surface:

- `GET /api/company-tasks`
- `GET /api/approvals`
- `POST /api/approvals/{approvalId}/approve`
- `POST /api/approvals/{approvalId}/revision`
- `GET /api/app-projects`
- `GET /api/media-assets`
- `GET /api/media-upload-jobs`
- `POST /api/media-upload-jobs`
- `GET /api/publish-jobs`
- `POST /api/publish-jobs`
- `GET /api/performance-snapshots`

Production readiness must not be marked complete until DB-backed persistence is implemented and verified.

## Communication Planner

Communication Planner owns 1-to-1 communication management and safety.

### Owns
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
- ChannelAdapter integration state
- Person-centered reply workflow
- Send confirmation workflow

### Must Not Own
- Customer master
- Lead lifecycle source of truth
- Reservation / Visit Schedule source of truth
- Payment source of truth
- Sales / Revenue source of truth
- SNS PostDraft source of truth
- Campaign strategy source of truth
- Numeria Session / Report source of truth
- Velvet professional memory source of truth
- AI Activity / Usage / Capability source of truth
- Platform Admin operational monitoring source of truth

### Integration Role
Communication Planner groups channel conversations by person, maintains conversation context, generates or manages reply drafts, performs SafetyCheck, and sends through approved ChannelAdapters.

It may reference Growth Engine Customer through `customerRef.customerId`, but it must not create a competing Customer master.

Communication Planner must scope reply generation and safety checks by:
- `workspaceId`
- `personId`
- `conversationId`

It must not use another person's context when generating or sending a reply.

Communication Planner may call AI Platform Core for scoped AI execution. AI Platform Core returns candidates or safety assessments only; Communication Planner owns confirmation, mutation, and send decisions.

Communication Planner must not send or expose Customer master records, `paymentStatus`, `salesAmount`, Stripe data, full Report bodies, full Velvet professional memory bodies, unrelated full conversation histories, API keys, access tokens, or secret prompts to other apps.

## AI Platform Core

AI Platform Core owns common AI runtime and usage tracking.

Current infrastructure status:
- Runtime: Cloudflare Workers
- Persistence: Cloudflare D1
- Production URL: `https://ai-platform-core.karukimori.workers.dev`
- Cloudflare migration status: `completed`
- Current phase: `production_hardening`

Cloudflare/D1 migration completion does not change AI Platform Core's responsibility boundary.

### Owns
- Activity
- Usage
- Capability
- Prompt/Template registry
- Tool/Workflow registry
- AI execution logs
- API key and runtime configuration for AI calls
- Provider abstraction
- Activity Outcome
- Activity Feedback
- Runtime Storage
- AI Event infrastructure

### Must Not Own
- Customer master
- Lead lifecycle source of truth
- Communication Planner conversation records as canonical data
- Communication Planner send workflow
- Velvet professional memory as canonical business data
- Reservation workflow
- Payment workflow
- Sales state
- SNS PostDraft / MessageDraft source of truth
- Appraisal business logic
- Numeria Report source of truth
- SNS business strategy
- Public site publishing

### Integration Role
AI Platform Core is called by apps when they need AI execution. For Communication Planner, AI execution is user-triggered or workflow-triggered and receives only the minimum scoped input required.

Production verification has confirmed D1-backed Activity and Usage persistence, D1 roundtrip, and baseline workspace/user isolation. Formal authentication/authorization remains the next hardening priority and must not be treated as completed solely because `x-client-id` scoped reads pass E2E.

## Velvet

Velvet is a Professional App connected to Growth Engine. Its paid value is split into professional recall/service quality (Pro) and Growth Engine-powered business growth (Business).

### Pro — JPY 10,000/month
Core value: **顧客を忘れない・接客品質を上げる**.

Pro owns/provides the professional experience for:
- customer recall projection keyed by Growth Engine `customerId`
- input-complete-only customer display
- customer quick card
- professional timeline
- professional visit history
- service notes
- preferences and cautions
- conversation notes
- previous handling
- next-contact / next-topic memo
- AI memo organization
- AI reply/contact-message drafts where explicitly scoped to Velvet professional memory
- professional-memory search
- important-customer pinning

Target outcome: important customer context can be recalled quickly before service.

### Business — JPY 30,000/month
Core value: **来店・売上・リピートを増やす**.

Business is Growth Engine-powered business mode. It may expose:
- planned visits
- customer-level sales
- sales trends
- visit-interval analysis
- repeat-visit candidates
- priority-response candidates
- contact candidates
- dormant-customer lists
- referral management
- sales dashboard
- contact-measure management
- SNS Planner integration
- Communication Planner integration
- AI sales suggestions

Customer, Reservation, Payment, Sales and repeat/business state used by these features remain canonical in Growth Engine.

### Velvet Owns
- professional Visit history
- ServiceNote / conversation notes
- preferences / cautions / remembered service facts
- previous handling and next-topic memo
- customer-specific professional timeline
- Capture raw input and confirmed professional-memory result
- Velvet-specific suggestion/dictionary state
- gifts / relationship memory / self-investment where used as professional memory

### Velvet Must Not Own
- Customer master
- Payment source of truth
- Sales / Revenue source of truth
- Reservation / Visit Schedule source of truth
- `paymentStatus`
- `salesAmount`
- Stripe secrets or credentials
- canonical cross-business sales analytics
- SNS Planner PostDraft internals
- Communication Planner Conversation / Message / SafetyCheck source of truth
- AI Platform Core AI Usage ledger
- Platform Admin operational monitoring source of truth

### Customer Rule
Growth Engine `Customer` is canonical. Velvet must not maintain an independent competing Guest/Person master.

Velvet may retain a `customerId` reference plus minimum display/cache fields explicitly allowed by contract. Professional memory is attached to the reference; it does not redefine Customer ownership.

### Sales and Payment Rule
Velvet does not persist canonical `salesAmount`, `paymentStatus`, Payment or Sales records. Business sales views query/reference Growth Engine. Stripe secrets and payment credentials must never be stored in Velvet.

### Growth Engine Integration
Growth Engine -> Velvet:
- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`

Velvet -> Growth Engine where needed:
- `visitId`
- `noteId`
- `lastVisitAt`
- `nextActionRef`
- `summaryRef`

Raw confidential service notes and full conversation-note bodies must not be returned merely because Growth Engine has a customer reference. Cross-app payloads are minimum-necessary and reference-ID centered.

## Platform Admin

Platform Admin owns cross-app operational visibility for the platform operator.

### Owns
- App connection registry
- Health check status
- Contract compliance status
- Integration logs
- Event logs
- Error summaries
- Workspace summary view

### Must Not Own
- Customer master
- Communication Planner message bodies
- Communication Planner ConversationContext bodies
- Velvet professional memory
- Appraisal work
- SNS post creation
- SNS message creation
- Payment execution
- Sales ledger
- AI execution itself

## MVP Identity Rule

MVP must not require `professionalId`.

Use:
- `workspaceId` as the primary business scope where platform scope is required.
- `userId` as the acting logged-in user.
- `ownerUserId` as the workspace owner where applicable.

`professionalId` is reserved for future multi-brand, multi-professional, or staff operations.

## MVP Payment Rule

MVP supports Stripe only for client-to-professional payment flows owned by Growth Engine.

- Growth Engine owns Stripe payment state.
- Other apps must not store Stripe payment data as a source of truth.
- Stripe secrets and credentials never cross into Professional Apps, Communication Planner, SNS Planner, AI Platform Core or Platform Admin.
