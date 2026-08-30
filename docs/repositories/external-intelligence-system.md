# External Intelligence System Repository Contract

Repository: `karukimori-wq/External-Intelligence-System`

External Intelligence System is the platform-wide development support intelligence base. It is not a runtime dependency for product AI behavior and is not a canonical store for business domain data.

## Production Status

- External Intelligence main confirmed through `7244f940`.
- CI #177: SUCCESS.
- Vercel Production: READY.
- Token-First v2: VERIFIED.
- HTTP/MCP context retrieval: VERIFIED.
- Repository HEAD cache: VERIFIED.
- Token ledger and KPI dashboard: VERIFIED.
- Development Result to Knowledge promotion: VERIFIED for successful results.
- Failed Development Result exclusion from successful Knowledge promotion: VERIFIED.

## Responsibility

External Intelligence owns development-support intelligence only:

- Compact project snapshots.
- Development experiences.
- Evidence attached to development results.
- Reusable knowledge observations.
- Pattern candidates derived from successful development outcomes.
- Token-first retrieval and dashboard KPIs for development work.

External Intelligence must not become product runtime AI infrastructure, a replacement for AI Platform Core, a canonical business data source, or a shadow source of truth for application domain records.

## KPI Priority

1. Token reduction.
2. Response speed.
3. Retrieval precision.
4. Self-improvement.

Design changes must preserve token reduction as the highest-priority KPI.

## Project Identity

For real application development, `projectId` must be the GitHub repository name and `repository` must use `owner/repository`.

`shared-app` is reserved for tests and must not be used as the Production development identity for a real application repository.

## Token-First Context Contract

- Skip Knowledge search when Repository HEAD has not changed and cached context is valid.
- Return compact project snapshot.
- Return compact knowledge.
- Keep Knowledge payloads to the minimum needed for the current task.
- Default Knowledge limit: 2.
- Default context budget: 4000 characters.
- Apply the same policy to HTTP and MCP access.
- Use lazy retrieval only when additional context is needed.

## Development Loop

1. Retrieve context from External Intelligence.
2. Develop the target application.
3. Run tests and verification.
4. Update GitHub main.
5. Record the development result in External Intelligence.
6. Update the project snapshot.
7. Reuse the stored knowledge in later development.

A written instruction to use External Intelligence is not enough to mark it used. Only successful HTTP or MCP communication counts.

If External Intelligence cannot be reached, the work report must say `External Intelligence: NOT CONNECTED`.

## Development Result to Knowledge

`POST /api/development/results` is the canonical write path for development outcomes.

Successful development results may be converted as Development Result -> Experience -> Evidence -> Knowledge Observation -> Pattern candidate.

Failed development results may be retained as Experience history, but they must not be automatically promoted as successful Knowledge.

## Data Model Separation

- Project Snapshot: current development state of a repository.
- Experience: development work that actually happened.
- Evidence: supporting information for an experience.
- Knowledge: reusable learning across multiple development efforts.
