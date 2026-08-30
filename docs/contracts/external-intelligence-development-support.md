# External Intelligence Development Support Contract

External Intelligence is the formal development-support intelligence base for platform application development.

## Scope

External Intelligence is limited to application development support.

Priority order:

1. Token reduction.
2. Response speed.
3. Retrieval precision.
4. Self-improvement.

External Intelligence is not a product runtime AI dependency and is not a canonical business data store.

## Standard Development Flow

Use this flow when External Intelligence is available for a repository:

1. Retrieve Token-First context.
2. Perform application development.
3. Run tests and verification.
4. Update GitHub main.
5. Record the development result through `POST /api/development/results`.
6. Update the Project Snapshot.
7. Reuse resulting Knowledge in future development.

Usage must be evidence-based. A task is External Intelligence-enabled only when HTTP or MCP communication succeeded.

If communication fails or is unavailable, report:

`External Intelligence: NOT CONNECTED`

Do not claim that context was fetched, Knowledge was reused, or results were recorded without successful communication.

## Project Identity

For real repositories:

- `projectId`: GitHub repository name.
- `repository`: `owner/repository`.

`shared-app` is test-only and must not be used for real Production development identity.

## Token-First Defaults

- Skip Knowledge search when Repository HEAD has not changed and cache is valid.
- Prefer Compact Snapshot.
- Prefer Compact Knowledge.
- Default Knowledge limit: 2.
- Default context budget: 4000 characters.
- Use lazy retrieval for additional context only when needed.
- Keep HTTP and MCP retrieval behavior aligned.

## Knowledge Promotion

Successful development result:

Development Result -> Experience -> Evidence -> Knowledge Observation -> Pattern candidate.

Failed development result:

Development Result -> Experience only, unless a later explicit review promotes a non-success learning separately.

## Boundary With Product Systems

External Intelligence must not own runtime product AI data. AI Platform Core remains responsible for runtime AI capabilities, prompts, knowledge used by product runtime, AI Activity, and AI Usage.

External Intelligence must not own domain source-of-truth data for Growth Engine, Numeria Studio, Velvet, Communication Planner, SNS Planner, Platform Admin, Feedback Hub, or any future application.
