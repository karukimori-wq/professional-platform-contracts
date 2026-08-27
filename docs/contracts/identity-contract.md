# Identity Contract

Shared identifiers allow repositories to integrate without duplicating ownership.

## Identifier Format

Use stable string IDs.

| ID | Format | Owner | Purpose |
| --- | --- | --- | --- |
| `workspaceId` | `wks_...` | AI Platform Core | Tenant boundary |
| `projectId` | `prj_...` | AI Platform Core | Application or service boundary |
| `professionalId` | `pro_...` | Professional Studio / Growth Engine | Paying professional |
| `customerId` | `cus_...` | Growth Engine | Canonical customer |
| `leadId` | `lead_...` | Growth Engine | Lead lifecycle record |
| `sessionId` | `ses_...` | Professional Studio | Professional service session |
| `reportId` | `rep_...` | Professional Studio | Generated report |
| `capabilityId` | `cap_...` | AI Platform Core | Registered capability |
| `activityId` | `act_...` | AI Platform Core | AI execution record |
| `eventId` | `evt_...` | Event Engine | Published event |

## Cross-System Rule

Systems exchange IDs, not duplicated master records.

Example:

- Numeria Studio stores `customerId` on a report.
- Growth Engine stores the customer profile.
- AI Platform Core stores `activityId` and links usage to `workspaceId`, `projectId`, and optional domain references.

## Numeria Studio Production Identity Status

Numeria Studio Cloudflare Production E2E has confirmed the MVP identity rule:

- `workspaceId`
- `userId`

`professionalId` is not required for Numeria Studio MVP, D1 persistence, Session Production E2E, Report Production E2E, or Growth Engine reference integration.

Numeria Studio must continue to scope D1-backed Session, Report, Calculation Result, and Numeria Snapshot records by `workspaceId + userId` where user isolation is required.

## AI Platform Core Production Identity Status

AI Platform Core production E2E has confirmed baseline Activity isolation by `workspaceId` and `userId`.

The MVP identity rule remains `workspaceId + userId / ownerUserId`.

`professionalId` is not required.

The current `x-client-id` scoped-read check is an implementation-level baseline, not the final formal authentication/authorization contract. AI Platform Core must still implement and verify formal auth boundaries before this area is marked complete.

## Velvet Production Identity and Authentication Status

Velvet Cloudflare Production E2E has confirmed the MVP identity rule:

- `workspaceId`
- `userId`
- `ownerUserId` where workspace ownership is relevant

`professionalId` is not required. `/contracts/status` must continue to report `identityMode: workspaceId+userId` and `professionalIdRequired: false`.

Customer Memory D1 Production E2E has confirmed workspace/user isolation.

Velvet Cloudflare Production auth baseline is `VELVET_AUTH_MODE=session`.

Session bridge headers:

- `x-velvet-auth-bridge`
- `x-velvet-workspace-id`
- `x-velvet-user-id`
- `x-velvet-owner-user-id`

`VELVET_SESSION_BRIDGE_SECRET` is stored as a Cloudflare Secret. Contracts may record the secret name and trust boundary only, never the secret value.

`demo` and `fixed_owner` are not canonical public Production auth modes.

## Platform Admin Production Identity Status

Platform Admin cross-app monitoring must continue to use the MVP identity rule:

- `workspaceId`
- `userId`
- `ownerUserId` where workspace ownership is relevant

`professionalId` is not required for Platform Admin monitoring.

Platform Admin may use `PLATFORM_ADMIN_API_TOKEN` with the `x-platform-admin-token` header for management API-to-API access.

This is not the final human operator authentication / authorization contract. A Cloudflare-compatible operator auth design remains a Platform Admin production hardening item.

## External IDs

External service IDs must be namespaced.

Examples:

- `line:user:...`
- `instagram:profile:...`
- `x:profile:...`
- `google:calendar:...`

External IDs are never used as primary IDs.
