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

Growth Engine remains the canonical owner for payment and sales state.

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
- Payment state
- Sales state
- Reservation state
- Public site source of truth
- Business lifecycle decisions
- Appraisal reports

### Integration Role

SNS Planner receives posting intent from Growth Engine and returns post draft state.

Examples:

- campaign intent
- target channel
- destination URL
- post goal
- draft status

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

It does not decide whether a customer should be nurtured, billed, booked, or contacted.

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

- `workspaceId` as the primary business scope.
- `userId` as the acting logged-in user.
- `ownerUserId` as the workspace owner.

`professionalId` is reserved for future multi-brand, multi-professional, or staff operations.

## MVP Payment Rule

MVP supports Stripe only for client-to-professional payment flows.

- Growth Engine owns Stripe payment state.
- Other apps must not store Stripe payment data as a source of truth.
- Other apps may consume read-only eligibility or status snapshots from Growth Engine.
