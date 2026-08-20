# Identity Contract

Shared identifiers allow repositories to integrate without duplicating ownership or coupling domain records to an authentication vendor.

## MVP Identity Model

The shared MVP identity boundary is `workspaceId + userId`.

- `userId` identifies the platform user.
- `workspaceId` identifies the tenant/workspace boundary.
- `professionalId` is not required for MVP identity or authorization.
- Authentication-provider identifiers are external identifiers and MUST NOT become canonical domain primary keys.

## Identifier Format

Use stable string IDs.

| ID | Format | Owner | Purpose |
| --- | --- | --- | --- |
| `workspaceId` | `wks_...` | Professional Platform identity layer | Tenant boundary |
| `userId` | `usr_...` | Professional Platform identity layer | Canonical platform user |
| `projectId` | `prj_...` | AI Platform Core | Application or service boundary |
| `professionalId` | `pro_...` | Domain-specific, optional | Post-MVP/domain-specific professional reference |
| `customerId` | `cus_...` | Growth Engine | Canonical customer |
| `leadId` | `lead_...` | Growth Engine | Lead lifecycle record |
| `sessionId` | `ses_...` | Professional Studio | Professional service session |
| `reportId` | `rep_...` | Professional Studio | Generated report |
| `capabilityId` | `cap_...` | AI Platform Core | Registered capability |
| `activityId` | `act_...` | AI Platform Core | AI execution record |
| `eventId` | `evt_...` | Event Engine | Published event |

## Authentication Provider Boundary

The current target authentication provider is Clerk. Clerk authenticates a person; it does not own platform domain identity.

A platform implementation MUST map the authenticated Clerk subject to a canonical `userId` before domain authorization.

Required request flow:

1. Validate the Clerk-issued token/session on the trusted server/Worker boundary.
2. Resolve the authenticated subject to canonical `userId`.
3. Resolve and validate membership in the requested `workspaceId`.
4. Validate role/permission required by the operation.
5. Only then access domain data.

A valid login alone MUST NOT authorize access to a workspace.

## Cross-System Rule

Systems exchange canonical platform/domain IDs, not duplicated master records and not authentication-vendor IDs.

Examples:

- Numeria Studio stores `customerId` on a report; Growth Engine owns the customer profile.
- AI Platform Core stores `activityId` and links usage to `workspaceId`, `projectId`, and optional domain references.
- A Clerk subject may be stored in an identity mapping table, but Growth Engine, Numeria Studio, Communication Planner, and other domain records reference canonical `userId`/`workspaceId` rather than Clerk IDs.

## External IDs

External service IDs must be namespaced.

Examples:

- `clerk:user:...`
- `line:user:...`
- `instagram:profile:...`
- `x:profile:...`
- `google:calendar:...`

External IDs are never used as canonical primary IDs.

## Cross-Workspace Safety

Every user-facing domain query or mutation containing workspace-scoped data MUST enforce the authenticated user's membership in that exact `workspaceId`.

Cross-workspace reads, context retrieval, writes, exports, and generated outputs are denied by default unless an explicit platform-admin capability authorizes the operation.
