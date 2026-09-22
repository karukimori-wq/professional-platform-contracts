# External Intelligence Development Support Contract

External Intelligence System (EIS) is the formal development-support intelligence base for platform application development.

## Scope

EIS is limited to application development support. It is not a product runtime AI dependency and is not a canonical business data store.

Priority order:

1. Reuse verified development knowledge across applications.
2. Prevent recurrence of known failures.
3. Reduce unnecessary context and token use.
4. Improve retrieval precision and response speed.
5. Improve future development from verified outcomes.

## Standard Development Flow

Use this flow when EIS is available for a repository:

1. Call `development_start` through HTTP or MCP.
2. Open the development session and retrieve the latest Project Snapshot.
3. Retrieve relevant shared Knowledge, including cross-project proven patterns and known failures.
4. Perform application development.
5. Run code-level tests and verification.
6. Deploy or otherwise reach the target Production runtime when Production behavior is part of the task.
7. Verify Production usability as applicable: deploy, UI reachability, authorization, persistence, integrations, and human verification.
8. Record the development result through `POST /api/development/results` or the corresponding MCP/GitHub Actions boundary.
9. Update the Project Snapshot.
10. Reuse resulting Knowledge in future development.

Usage must be evidence-based. A task is EIS-enabled only when HTTP, MCP, or the reusable GitHub Actions recording boundary actually succeeds.

If communication fails or is unavailable, report:

`External Intelligence: NOT CONNECTED`

Do not claim that context was fetched, Knowledge was reused, or results were recorded without successful communication.

## Project Identity

Application identity and repository identity must not be treated as the same field.

For real repositories:

- `appId`: stable product/application identifier, for example `numeria-studio` or `velvet`.
- `componentId`: optional deployable or functional component identifier when one app spans multiple components.
- `projectId`: development project identifier; the GitHub repository name is the default when no better project identifier exists.
- `repository`: `owner/repository`.
- `commitSha`: exact source commit when known.

`shared-app` is test-only and must not be used for real Production development identity.

## Development Fingerprint

When available, development results should include the environment and architecture fingerprint needed to judge whether Knowledge can be reused safely across applications.

Recommended fields:

- `runtime`
- `framework`
- `database`
- `auth`
- `billing`
- `environment`
- `planModel`
- `appRole`
- `contractVersion`
- `nodeVersion`

A matching repository name alone is not sufficient evidence that two development situations are equivalent.

## Knowledge Retrieval and Cache

- HTTP and MCP retrieval behavior must remain aligned.
- Repository HEAD alone must not determine cache validity.
- A cache hit is valid only when the repository state and relevant shared Knowledge revision are unchanged.
- If shared Knowledge changes, relevant context must be retrieved again even when the current repository HEAD is unchanged.
- Retrieval should remain compact and token-budgeted, but may return more than the historical two-item limit when relevant cross-project knowledge exists.
- The current EIS defaults are approximately 3 items and a 5000 character context budget unless a caller explicitly requests another supported budget.
- Additional context should be loaded lazily only when needed.

## Development Result Classification

EIS must distinguish implementation success from Production usability.

### `implementation_result`

Use when code, tests, CI, build, or another implementation-level check succeeded, but Production usability has not been fully verified.

This result is useful Knowledge, but it must not automatically become a reusable Production success pattern.

### `production_verified_success`

Use only when applicable Production verification has succeeded.

Verification may include:

- Production deployment completed.
- Required UI is reachable by the intended user.
- Authorization and plan/role behavior are correct.
- Required data is persisted and can be read again.
- Required external integrations are connected.
- Human verification is completed when the feature requires visual or operational confirmation.

Only Production-verified success is eligible for automatic cross-project success-pattern promotion.

### `known_failure`

Failed development and verification outcomes must not be discarded.

A reusable failure or warning should be recorded as `known_failure` Knowledge so another project can receive it during `development_start` and avoid repeating the same mistake.

Examples include:

- administrator role still receiving Free plan restrictions;
- feature code present but unreachable from the Production UI;
- Production deployment succeeded but persistence is not connected;
- stale endpoint or runtime migration configuration;
- authentication configuration that passes build checks but fails for real users.

## GitHub Actions Recording

Application repositories may use the reusable EIS workflow:

`karukimori-wq/External-Intelligence-System/.github/workflows/record-development-result.yml`

The caller should send application/project identity, repository/commit identity, summary, result classification, fingerprint, and verification state.

Recording should normally use `strict=false` so an EIS outage does not become an application release blocker. The workflow must expose whether recording actually succeeded; callers must not report `RECORDED` when the request failed.

CI Green alone must never be translated into `production_verified_success`.

## Production Implementation Rule

Across platform applications, the words `implemented`, `complete`, or `Production ready` must not be derived solely from README text, task status, code presence, or CI success.

When applicable, the implementation decision must be based on whether the current main and current Production allow the intended user to use the feature from the UI, with required authorization, persistence, and integrations connected.

## Boundary With Product Systems

EIS must not own runtime product AI data. AI Platform Core remains responsible for runtime AI capabilities, prompts, knowledge used by product runtime, AI Activity, and AI Usage.

EIS must not own domain source-of-truth data for Growth Engine, Numeria Studio, Velvet, Communication Planner, SNS Planner, Platform Admin, Feedback Hub, or any future application.

EIS stores development intelligence, verification evidence, reusable success patterns, known failures, and Project Snapshots only within the development-support boundary.
