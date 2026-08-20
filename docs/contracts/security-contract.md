# Security Contract

## Trust Boundary

Browser/client input is untrusted. Authentication, authorization, payment verification and access to protected storage/databases occur on trusted server or Cloudflare Worker boundaries.

## User Authentication

For Clerk-backed applications:

1. Validate the Clerk token/session using supported server-side verification.
2. Resolve the authenticated external subject to canonical platform `userId`.
3. Never accept a client-supplied `userId` as proof of identity.

## Workspace Authorization

For every workspace-scoped operation:

1. Resolve authenticated `userId`.
2. Resolve requested `workspaceId`.
3. Verify active membership.
4. Verify role/permission for the operation.
5. Apply domain-specific ownership constraints.

Authentication success does not imply workspace authorization.

Cross-workspace access is denied by default.

## Service-to-Service Authentication

Internal application calls MUST use an authenticated service mechanism and MUST propagate the platform observability identifiers required by `observability-contract.md`.

Service credentials MUST NOT be accepted from browser-controlled code as a substitute for server-to-server authentication.

## Stripe

Stripe webhook handlers MUST:

- verify webhook signatures before processing;
- reject invalid signatures;
- process events idempotently;
- store canonical payment/revenue state only in the application designated by `data-ownership.md`;
- never trust payment status supplied by the browser.

## Secrets

Secrets MUST NOT be committed to GitHub, returned by APIs, written to normal application logs, embedded in frontend bundles, or exposed using public environment-variable prefixes.

Logs SHOULD contain secret-safe identifiers and correlation metadata rather than credentials or connection strings.

## Data Isolation

Database queries, object-storage access and AI/context retrieval MUST apply the same workspace boundary as the calling operation.

Signed/private object access SHOULD be time-limited where direct object delivery is required.

## Administrative Access

Platform Admin is privileged. Administrative capabilities MUST be explicitly authorized and SHOULD use stronger authentication controls than ordinary user flows where supported.

Administrative actions that cross workspace boundaries MUST be auditable.

## Failure Policy

Authorization uncertainty fails closed. If identity mapping, membership, role or permission cannot be verified, protected access is denied.
