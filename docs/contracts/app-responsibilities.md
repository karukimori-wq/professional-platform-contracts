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
| Domain appraisal logic | Numeria Studio |
| SNS post draft | SNS Planner |
| SNS message draft | SNS Planner |
| SNS post calendar | SNS Planner |
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

- Velvet confidential service-note bodies as canonical data
- Velvet conversation-note bodies as canonical data
- Velvet professional customer timeline
- Appraisal calculations
- Report/PDF rendering
- SNS post editor internals
- SNS message editor internals
- AI runtime internals
- Independent AI usage ledger

### Integration Role

Growth Engine passes reference IDs and minimum workflow context to Professional Apps.

For Velvet, default input is reference-first:
- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`

Growth Engine must not unnecessarily send `paymentStatus`, `salesAmount`, Stripe secrets, payment credentials or unrelated commercial payloads to Velvet.

## Numeria Studio

Numeria Studio owns professional work output for fortune-telling professionals.

### Owns
- Session
- Report
- Appraisal input
- Appraisal result
- Report generation state
- Domain-specific appraisal logic

### Must Not Own
- Customer master
- Payment source of truth
- Sales source of truth
- Public site publishing
- Lead lifecycle
- SNS campaign strategy

### Integration Role
Numeria Studio references Growth Engine records by ID. External deliverables must use `Report`, not `Document`.

## SNS Planner

SNS Planner owns content and communication draft creation support.

### Owns
- PostDraft
- MessageDraft
- Post text variants
- Message text variants
- Post status
- Message draft status
- Post schedule
- SNS-specific formatting
- Contact-message formatting
- Hashtag and image prompt suggestions

### Must Not Own
- Customer master
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
SNS Planner receives posting or message-draft intent from Growth Engine or an explicit user-selected handoff from a Professional App. Business strategy, audience selection, sales/repeat decisions, and customer lifecycle state remain in Growth Engine.

MessageDraft integrations are reference-first. SNS Planner may receive `workspaceId`, `userId`, `sourceApp`, `targetStudio`, `channel`, `purpose`, `audienceSegment`, `tone`, `cta`, and `inputRef`. It must not receive Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, API keys, access tokens, or secret prompts.

## AI Platform Core

AI Platform Core owns common AI runtime and usage tracking.

### Owns
- Activity
- Usage
- Capability
- Prompt/Template registry
- Tool/Workflow registry
- AI execution logs
- API key and runtime configuration for AI calls

### Must Not Own
- Customer master
- Velvet professional memory as canonical business data
- Reservation workflow
- Payment workflow
- Sales state
- Appraisal business logic
- SNS business strategy
- Public site publishing

### Integration Role
AI Platform Core is called by apps when they need AI execution. For Velvet, AI execution is user-triggered and receives only the minimum scoped input required.

## Velvet

Velvet is an adult night-work Professional App connected to Growth Engine. Its paid value is split into professional recall/service quality (Pro) and Growth Engine-powered business growth (Business).

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
- AI reply/contact-message drafts
- professional-memory search
- important-customer pinning

Target outcome: important customer context can be recalled in roughly 10 seconds before service.

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
- Stripe secrets and credentials never cross into Professional Apps.
