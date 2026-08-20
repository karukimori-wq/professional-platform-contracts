# Infrastructure Migration Contract

## Goal

Move applications toward the platform infrastructure standard without trading cost reduction for availability, data integrity or authorization risk.

## Core Rules

1. Migration is application-by-application, not a big-bang platform cutover.
2. Vercel/Supabase and Cloudflare/Clerk may coexist during transition.
3. Cloudflare runtime migration and database-engine migration are separate decisions.
4. A working PostgreSQL production database is not migrated to D1 without an explicit workload and migration assessment.
5. Every persistent-data migration requires backup/export, validation and rollback procedures before cutover.
6. Existing canonical data ownership does not change because infrastructure changes.

## Recommended Migration Order

1. Platform Admin
2. Communication Planner
3. SNS Planner
4. Velvet
5. Numeria Studio
6. AI Platform Core
7. Growth Engine

The order may change when repository-specific evidence justifies it. Growth Engine SHOULD remain late because it owns high-value Customer, Reservation, Payment, Revenue and related business records and may retain PostgreSQL.

## Per-Application Gates

An application is ready for production cutover only when all applicable gates pass:

- target runtime builds and deploys;
- `/health`, `/version`, `/contracts/status` remain contract-compatible;
- Clerk authentication is verified where user authentication is required;
- canonical `userId` mapping works;
- workspace membership and authorization tests pass;
- service-to-service authentication works;
- D1/PostgreSQL persistence roundtrip passes;
- R2 upload/read/delete or lifecycle tests pass when storage is used;
- Stripe signature/idempotency tests pass when payments are used;
- observability identifiers are propagated;
- data migration reconciliation passes;
- rollback procedure is documented and tested to a reasonable level;
- no secret values appear in source, client bundles, API responses or logs.

## Database Migration Gate

For PostgreSQL-to-D1 proposals, document at minimum:

- schema/type differences;
- transaction requirements;
- query/index patterns;
- expected data size and growth;
- import/export mechanism;
- reconciliation method;
- dual-write or maintenance-window strategy if applicable;
- rollback source and cutoff point.

If the assessment is unfavorable, retain PostgreSQL and migrate only runtime/auth/storage as appropriate.

## Cutover

Prefer a reversible cutover. Keep the previous production path available until target health, persistence, authorization and critical user journeys have been verified.

## Decommission

Old infrastructure is removed only after:

- production verification is complete;
- required data is reconciled;
- rollback retention period has elapsed;
- secrets are rotated/revoked as appropriate;
- monitoring points to the new runtime;
- contracts and repository documentation reflect the final state.
