# App Responsibilities

This document defines the responsibility boundary for each app in the Professional Platform family.

## Core Rule

Each app owns one canonical responsibility. Other apps may reference that data, but must not create a competing source of truth.

## Responsibility Table

| Area | Canonical Owner |
| --- | --- |
| Customer management | Growth Engine |
| Reservation management | Growth Engine |
| Stripe payment state | Growth Engine |
| Sales management | Growth Engine |
| Public site | Growth Engine |
| Service and menu publishing | Growth Engine |
| Appraisal session | Numeria Studio |
| Report and PDF generation | Numeria Studio |
| Domain appraisal logic | Numeria Studio |
| SNS post draft | SNS Planner |
| SNS post calendar | SNS Planner |
| AI activity execution | AI Platform Core |
| AI usage tracking | AI Platform Core |
| Capability registry | AI Platform Core |
| Velvet personal guest/person management | Velvet |
| Velvet visit history | Velvet |
| Velvet personal guest knowledge and relationships | Velvet |
| Velvet gifts and personal sales-memory records | Velvet |
| Velvet personal schedule entries | Velvet |
| Velvet self-investment records | Velvet |
| Contract definitions | professional-platform-contracts |
| Cross-app monitoring | Platform Admin |

## Growth Engine

Growth Engine owns the business workflow for each workspace.

### Owns

- Customer
- Reservation
- Payment
- Sales
- Public Site
- Service/Menu
- Lead and nurturing state
- Campaign intent
- Business plan feature access

### Must Not Own

- Appraisal calculations
- Report/PDF rendering
- SNS post editor internals
- AI runtime internals
- Independent AI usage ledger
- Velvet personal Guest/Person records or Velvet private relationship memory

### Integration Role

Growth Engine passes references and workflow context to other apps.

Examples:

- `customerId`
- `reservationId`
- `workspaceId`
- `userId`
- payment eligibility or payment status snapshots
- campaign intent
- public site destination URL

Growth Engine remains the canonical owner for payment and sales state inside the shared Professional Platform business domain.

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
- Velvet personal Guest/Person master

### Integration Role

Numeria Studio references Growth Engine records by ID.

Required reference pattern:

- Store `workspaceId` as the primary scope.
- Store `customerId` only as a reference to Growth Engine.
- Store `reservationId` only when a session was created from a reservation.
- Treat payment fields from Growth Engine as read-only snapshots or eligibility signals.

External deliverables must use `Report`, not `Document`.

## SNS Planner

SNS Planner owns SNS content creation support.

### Owns

- PostDraft
- Post text variants
- Post status
- Post schedule
- SNS-specific formatting
- Hashtag and image prompt suggestions

### Must Not Own

- Customer master
- Velvet Guest/Person master
- Velvet private guest knowledge, visit history, gifts, contacts, or relationships
- Payment state
- Sales state
- Reservation state
- Public site source of truth
- Business lifecycle decisions
- Appraisal reports

### Integration Role

SNS Planner receives posting intent from Growth Engine or an explicit user-selected handoff from Velvet and returns post draft state.

Velvet must only send context intentionally selected for SNS creation. It must not automatically send private guest records, contact information, visit histories, gift histories, or raw personal notes.

SNS Planner may use AI Platform Core for text generation, but AI usage is recorded by AI Platform Core.

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
- Velvet Guest/Person master
- Velvet private relationship memory as canonical business data
- Reservation workflow
- Payment workflow
- Sales state
- Appraisal business logic
- SNS business strategy
- Public site publishing

### Integration Role

AI Platform Core is called by apps when they need AI execution.

It records usage by:

- `workspaceId`
- `userId`
- calling app
- capability
- activity
- usage metrics

For Velvet, AI execution is user-triggered. Velvet sends only the minimum scoped input required for capabilities such as Capture structuring or natural-language retrieval. AI Platform Core must not become the canonical store for Velvet guest/contact/history data.

It does not decide whether a customer or Velvet guest should be nurtured, billed, booked, contacted, or otherwise acted upon.

## Velvet

Velvet is an independent, individual-use night-work sales assistant. It owns a private personal-sales domain for the user and is not a store/operator CRM.

### Owns

- Velvet Guest/Person record
- Visit and participant history
- arrival/departure timestamps and calculated stay duration
- visit context and user-entered personal sales record
- GuestKnowledge / preferences / remembered facts
- GuestRelationship and referral links
- gifts received and given
- personal contact backup held in Velvet
- personal ScheduleEntry relevant to night-work activity
- SelfInvestmentEntry
- Capture raw input and confirmed structured result
- Velvet user dictionary and suggestion state
- Velvet plan-access state specific to Velvet features

### Must Not Own

- Growth Engine Customer as a competing shared-platform source of truth
- Growth Engine Reservation
- Growth Engine Stripe payment state
- Growth Engine canonical Sales/Revenue ledger
- SNS Planner PostDraft internals
- AI Platform Core AI Usage ledger
- Platform Admin operational monitoring source of truth

### Customer vs Velvet Guest Rule

`Customer` and Velvet `Guest/Person` are different domains.

- `Customer` is the Growth Engine canonical business CRM entity.
- Velvet `Guest/Person` is the individual's private relationship and visit-memory entity for Velvet.
- Neither entity automatically creates or overwrites the other.
- A future mapping may exist only through an explicit reference such as `growthCustomerRef` with documented user intent and synchronization rules.
- Similar fields such as display name or sales amount do not make the records interchangeable.

### Sales and Payment Rule

Velvet may store user-entered personal visit amounts, payment-method notes, and receivable/売掛 notes as part of the user's private visit history. These are not the Growth Engine canonical Payment or Sales ledger and must not silently update those sources of truth.

### Integration Role

Velvet uses AI Platform Core for user-triggered AI capabilities and usage accounting, SNS Planner for explicit user-selected SNS creation handoff, and Platform Admin for operational visibility. Growth Engine integration is optional/reference-based unless a future contract defines a specific workflow.

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
- Velvet Guest/Person master
- Appraisal work
- SNS post creation
- Payment execution
- Sales ledger
- AI execution itself

### Integration Role

Platform Admin observes and audits other apps. It may store operational snapshots, but snapshots are not canonical business data.

## MVP Identity Rule

MVP must not require `professionalId`.

Use:

- `workspaceId` as the primary business scope where platform scope is required.
- `userId` as the acting logged-in user.
- `ownerUserId` as the workspace owner.

`professionalId` is reserved for future multi-brand, multi-professional, or staff operations.

Velvet is individual-use in v1.0. Its records must remain scoped to the owning user/workspace and must not be shared with other staff by default.

## MVP Payment Rule

MVP supports Stripe only for client-to-professional payment flows owned by Growth Engine.

- Growth Engine owns Stripe payment state.
- Other apps must not store Stripe payment data as a source of truth.
- Other apps may consume read-only eligibility or status snapshots from Growth Engine.
- Velvet personal visit payment-method notes do not constitute Stripe payment state.
