# Platform Admin Repository Contract

Platform Admin is the operator-only control surface for the Professional Platform family.

It is not a customer-facing app, Professional App workflow app, SNS editor, payment processor, or AI runtime. It exists to monitor app health, contract alignment, workspace state, integration logs, and operational errors.

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
- Velvet Professional App API/event monitoring
- Growth Engine -> Velvet handoff monitoring
- SNS Planner PostDraft / MessageDraft metadata monitoring

## Must Not Implement

- Customer master management as a source of truth
- Professional sessions or visits as canonical data
- Report/PDF generation
- SNS post/message draft creation
- AI execution runtime
- Payment execution
- Sales ledger
- Reservation workflow
- Public site publishing logic

## Managed Apps

Platform Admin monitors these apps:

1. Growth Engine
2. Numeria Studio
3. Velvet
4. SNS Planner
5. AI Platform Core

## Velvet Monitoring

Platform Admin should observe, without becoming canonical owner:

- `/health`
- `/version`
- `/contracts/status`
- `VelvetVisit.Start`
- `VelvetVisit.Complete`
- `VelvetMemory.Get`
- `VelvetMemory.Update`
- `VelvetNote.Create`
- `VelvetTimeline.List`
- `VelvetNextAction.Create`
- `velvet.visit.started.v1`
- `velvet.visit.completed.v1`
- `velvet.memory.updated.v1`
- `velvet.note.created.v1`
- `velvet.next_action.created.v1`

Platform Admin should also observe:

- Growth Engine -> Velvet handoff result
- `GET /api/message-drafts/metadata`
- `GET /api/post-drafts/metadata`
- MessageDraft operation/event names and contract version

Monitoring snapshots must not contain full Velvet professional notes, full conversation histories, Customer master data, `paymentStatus`, `salesAmount`, Payment/Sales records, or Stripe secrets.

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/app-responsibilities.md`
- `docs/contracts/identity-contract.md`
- `docs/contracts/data-ownership.md`
- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/event-flow.md`

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
- integration test result
- API/event contract metadata

These snapshots are not canonical business data.

Canonical ownership remains:

- Growth Engine: Customer, Reservation / Visit Schedule, Payment, Sales, Public Site, business workflow state
- Numeria Studio: Session, Report, appraisal work
- Velvet: professional Visit, professional Memory, service notes, professional Timeline, Gift/Relationship memory
- SNS Planner: PostDraft and MessageDraft
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
- Velvet stable API/event coverage
- PostDraft / MessageDraft metadata coverage

## MVP Identity Rule

MVP must use:

- `workspaceId` as the primary business scope
- `userId` as the acting user
- `ownerUserId` as the workspace owner

`professionalId` is not required in MVP and must be treated as a future extension.

## MVP Payment Rule

MVP payment support is Stripe only.

Platform Admin only displays Stripe state owned by Growth Engine. It must not execute payments or become the payment source of truth.
