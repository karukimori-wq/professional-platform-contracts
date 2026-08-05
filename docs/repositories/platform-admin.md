# Platform Admin Repository Contract

Platform Admin is the operator-only control surface for the Professional Platform family.

It is not a customer-facing app, fortune-teller workflow app, SNS editor, payment processor, or AI runtime. It exists to monitor app health, contract alignment, workspace state, integration logs, and operational errors.

## Must Implement

- App connection registry
- Health check status for each managed app
- Contract version status for each managed app
- Workspace summary list
- User and owner reference visibility
- Stripe connection status visibility
- Public site status visibility
- API integration logs
- Event logs
- Error summaries
- Contract compliance checks

## Must Not Implement

- Customer master management as a source of truth
- Appraisal sessions
- Report/PDF generation
- SNS post creation
- AI execution runtime
- Payment execution
- Sales ledger
- Reservation workflow
- Public site publishing logic

## Managed Apps

Platform Admin monitors these apps:

1. Growth Engine
2. Numeria Studio
3. SNS Planner
4. AI Platform Core

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/app-responsibilities.md`
- `docs/contracts/identity-contract.md`
- `docs/contracts/data-ownership.md`
- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`

## Data Ownership

Platform Admin may store operational snapshots for display and troubleshooting.

Examples:

- app status
- contract version
- last health check result
- latest error summary
- workspace summary
- Stripe connection status snapshot
- public site status snapshot

These snapshots are not canonical business data.

Canonical ownership remains:

- Growth Engine: Customer, Reservation, Payment, Sales, Public Site
- Numeria Studio: Session, Report, appraisal work
- SNS Planner: PostDraft and SNS post planning
- AI Platform Core: Activity, Usage, Capability, AI execution logs

## MVP Screens

### Dashboard

Shows:

- managed app list
- app connection state
- contract version state
- error count
- pending event count

### Apps

Shows per app:

- app name
- repository URL
- status
- contract version
- last sync time
- health check status

### Workspaces

Shows per workspace:

- `workspaceId`
- `ownerUserId`
- plan
- enabled apps
- Stripe connection status
- public site status

### Logs

Shows:

- API logs
- event logs
- AI logs by reference
- Stripe webhook logs by reference
- errors

### Contracts

Shows:

- required contract version
- current app contract version
- compliance status
- unresolved issues

## MVP Identity Rule

MVP must use:

- `workspaceId` as the primary business scope
- `userId` as the acting user
- `ownerUserId` as the workspace owner

`professionalId` is not required in MVP and must be treated as a future extension.

## MVP Payment Rule

MVP payment support is Stripe only.

Platform Admin only displays Stripe state owned by Growth Engine. It must not execute payments or become the payment source of truth.
