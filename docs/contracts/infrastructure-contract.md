# Infrastructure Contract

## Purpose

Define the target infrastructure standard for Professional Platform applications while allowing safe staged migration from existing Vercel and Supabase deployments.

## Target Standard

| Concern | Target | Rule |
| --- | --- | --- |
| Application runtime | Cloudflare Workers | Default runtime for new production services and migrations |
| Authentication | Clerk | Shared external authentication provider |
| Authorization | Professional Platform | `workspaceId + userId + role/permission` is enforced server-side |
| Relational database | Cloudflare D1 or PostgreSQL | Select per workload; D1 is not mandatory |
| Object storage | Cloudflare R2 | Default for PDFs, images, attachments, exports and generated files |
| Payments | Stripe | Payment provider; webhook processing occurs on trusted server/Worker boundary |
| Source and CI | GitHub | Canonical source repositories and contracts |
| Cross-app contracts | professional-platform-contracts | Canonical API, event, identity and ownership rules |

## Database Selection

Cloudflare migration MUST NOT be interpreted as mandatory PostgreSQL-to-D1 migration.

Use D1 when the application's workload fits its operational model and limits. PostgreSQL remains permitted when transaction patterns, relational complexity, migration risk, operational history, or scale make PostgreSQL the safer choice.

Domain ownership remains unchanged regardless of database technology.

## Storage Rule

Binary/object payloads SHOULD be stored in R2 rather than relational database rows. Domain databases retain metadata, ownership references, object keys, checksums and lifecycle state as needed.

## Application Isolation

Applications SHOULD have independent database/storage bindings where this supports their source-of-truth boundary. Infrastructure consolidation MUST NOT merge canonical ownership between applications.

## Environment and Secrets

Secrets MUST be server-side only and MUST NOT be exposed through public/client-prefixed environment variables.

Production and non-production credentials MUST be separated. Service credentials, Clerk secrets, Stripe secrets and webhook secrets MUST be managed through the runtime's secret-management mechanism.

## Transitional Infrastructure

Vercel and Supabase are allowed during migration. An application is not required to migrate until its target architecture, data migration, rollback path and production verification are ready.

Existing working production persistence MUST NOT be replaced solely to achieve infrastructure uniformity.
