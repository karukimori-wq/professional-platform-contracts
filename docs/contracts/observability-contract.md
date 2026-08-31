# Observability Contract

This document defines the minimum logging, traceability, and error contract for Professional Platform apps.

Use this document together with:

- `docs/contracts/event-flow.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/api-catalog.md`
- `docs/contracts/app-responsibilities.md`

## Core Rule

Every cross-app API call, event publication, and integration failure must be traceable across apps without copying canonical business data.

Logs are operational records. Logs are not a source of truth for customers, payments, sessions, reports, post drafts, or AI activities.

## Required Identifiers

| Field | Required | Owner | Purpose |
| --- | --- | --- | --- |
| `traceId` | Yes | Calling app | Tracks one user action or automated job across apps |
| `correlationId` | Yes | Calling app | Groups related API calls and events in one business flow |
| `requestId` | Yes for API logs | Receiver | Identifies one received HTTP/RPC request |
| `eventId` | Yes for event logs | Publisher | Identifies one published event |
| `workspaceId` | Yes | Shared scope | Tenant boundary |
| `userId` | Required when user-initiated | Calling app | Acting user |
| `ownerUserId` | Optional | Growth Engine | Workspace owner |

## Identifier Rules

- `traceId` must be stable for the full user action.
- `correlationId` must be stable for the full business flow.
- A receiver must preserve inbound `traceId` and `correlationId` in its own logs.
- If an inbound request does not include `traceId`, the receiver must create one.
- IDs must be opaque strings. Do not encode personal information into IDs.

Recommended formats:

```text
trace_...
corr_...
req_...
evt_...
```

## Required API Log Fields

Every cross-app API call should to create one outbound log in the caller and one inbound log in the receiver.

### Outbound API Log

```json
{
  "logType": "api.outbound",
  "traceId": "trace_xxx",
  "correlationId": "corr_xxx",
  "sourceApp": "growth-engine",
  "targetApp": "sns-planner",
  "operation": "PostDraft.Generate",
  "endpoint": "POST /api/post-drafts",
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "status": "success",
  "statusCode": 200,
  "durationMs": 123,
  "occurredAt": "2026-08-07T00:00:00.000Z"
}
```

### Inbound API Log

```json
{
  "logType": "api.inbound",
  "traceId": "trace_xxx",
  "correlationId": "corr_xxx",
  "requestId": "req_xxx",
  "sourceApp": "growth-engine",
  "targetApp": "sns-planner",
  "operation": "PostDraft.Generate",
  "endpoint": "POST /api/post-drafts",
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "status": "success",
  "statusCode": 200,
  "durationMs": 45,
  "occurredAt": "2026-08-07T00:00:00.000Z"
}
```

## Required Event Log Fields

Every published event must be logged by the publisher. Consumers should log event handling when implemented.

### Event Published Log

```json
{
  "logType": "event.published",
  "traceId": "trace_xxx",
  "correlationId": "corr_xxx",
  "eventId": "evt_xxx",
  "eventName": "studio.session.started.v1",
  "sourceApp": "numeria-studio",
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "entityType": "session",
  "entityId": "session_xxx",
  "status": "success",
  "occurredAt": "2026-08-07T00:00:00.000Z"
}
```

### Event Consumed Log

```json
{
  "logType": "event.consumed",
  "traceId": "trace_xxx",
  "correlationId": "corr_xxx",
  "eventId": "evt_xxx",
  "eventName": "studio.session.started.v1",
  "sourceApp": "numeria-studio",
  "targetApp": "growth-engine",
  "workspaceId": "ws_test_001",
  "status": "success",
  "occurredAt": "2026-08-07T00:00:00.000Z"
}
```

## Status Values

| Status | Meaning |
| --- | --- |
| `success` | Operation completed as expected |
| `warning` | Operation completed with a known caveat |
| `error` | Operation failed |
| `skipped` | Operation was intentionally not executed |

## Error Format

Errors must be structured and safe to display in Platform Admin.

```json
{
  "status": "error",
  "error": {
    "code": "UPSTREAM_TIMEOUT",
    "message": "AI Platform Core did not respond before timeout.",
    "retryable": true,
    "sourceApp": "numeria-studio",
    "targetApp": "ai-platform-core",
    "traceId": "trace_xxx",
    "correlationId": "corr_xxx"
  }
}
```

## Error Code Catalog

| Code | Meaning | Retryable |
| --- | --- | --- |
| `BAD_REQUEST` | Required field missing or invalid | No |
| `UNAUTHORIZED` | Caller is not authenticated | No |
| `FORBIDDEN` | Caller is authenticated but not allowed | No |
| `NOT_FOUND` | Referenced resource was not found | No |
| `CONTRACT_VIOLATION` | Payload violates shared contract | No |
| `UPSTREAM_TIMEOUT` | Target app timed out | Yes |
| `UPSTREAM_UNAVAILABLE` | Target app returned an availability failure | Yes |
| `UPSTREAM_BAD_RESPONSE` | Target app returned unexpected response shape | Maybe |
| `CORS_BLOCKED` | Browser-side call was blocked by CORS | No |
| `ENVIRONMENT_LIMITATION` | Known hosting/runtime limitation blocked verification | Maybe |
| `INTERNAL_ERROR` | Unexpected app error | Maybe |

## Required Headers

Cross-app HTTP requests should include:

```text
X-Trace-Id: trace_xxx
X-Correlation-Id: corr_xxx
X-Source-App: growth-engine
```

Receivers should return:

```text
X-Trace-Id: trace_xxx
X-Correlation-Id: corr_xxx
X-Request-Id: req_xxx
```

During MVP preview, public read/test endpoints may use:

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Trace-Id, X-Correlation-Id, X-Source-App
```

Production CORS rules should be narrowed to approved app origins.

## Platform Admin Requirements

Platform Admin may store operational snapshots for:

- app health checks
- contract status checks
- MVP connection test results
- cross-app API logs
- event logs
- error summaries
- AI Platform Core production readiness checks
- Platform Admin D1 persistence and roundtrip readiness checks
- Communication Planner production readiness checks
- Service Binding monitoring results for Cloudflare-hosted internal apps
- Velvet production readiness checks

Minimum Platform Admin log fields:

```json
{
  "traceId": "trace_xxx",
  "correlationId": "corr_xxx",
  "sourceApp": "growth-engine",
  "targetApp": "numeria-studio",
  "operation": "Session.Start",
  "eventName": "studio.session.started.v1",
  "status": "success",
  "statusCode": 200,
  "errorCode": null,
  "checkedAt": "2026-08-07T00:00:00.000Z"
}
```

For AI Platform Core, Platform Admin should monitor at least:

- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `GET /api/persistence/status`

Optional owner/test-gated check:

- `POST /api/persistence/roundtrip`

AI Platform Core monitoring rows may include runtime, persistence driver, D1 reachability, database-backed persistence readiness, Activity/Usage E2E status, workspace/user isolation status, current phase, status, statusCode, errorCode, traceId, correlationId, requestId, checkedAt, and issues.

For Numeria Studio, Platform Admin should monitor at least:

- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `GET /api/persistence/status`
- authorized/test-gated `POST /api/persistence/roundtrip` where appropriate

Numeria Studio monitoring rows may include runtime, Static Assets/Worker API topology, persistence driver, D1 reachability, database-backed persistence readiness, roundtrip readiness, Session Production E2E status, Report Production E2E status, workspace/user isolation status, Growth Engine reference integration status, current phase, status, statusCode, errorCode, traceId, correlationId, requestId, checkedAt, and issues.

Numeria Studio monitoring rows must not include Report bodies, Customer information, Payment, Sales, conversation bodies, full appraisal notes, AI prompts, API keys, access tokens, or provider secrets.

For Velvet, Platform Admin should monitor at least:

- `GET https://velvet.karukimori.workers.dev/health`
- `GET https://velvet.karukimori.workers.dev/version`
- `GET https://velvet.karukimori.workers.dev/contracts/status`
- `GET https://velvet.karukimori.workers.dev/api/persistence/status`
- authorized/test-gated `POST https://velvet.karukimori.workers.dev/api/persistence/roundtrip` where appropriate

Velvet monitoring rows may include runtime, OpenNext Cloudflare topology, production storage mode, auth mode, persistence driver, D1 reachability, database-backed persistence readiness, roundtrip readiness, Customer Memory D1 E2E status, workspace/user isolation status, session auth baseline, AI Platform Core Service Binding baseline, remaining repository D1 coverage status, current phase, status, statusCode, errorCode, traceId, correlationId, requestId, checkedAt, and issues.

Velvet monitoring rows must not include Professional Memory bodies, service note bodies, customer master records, payment state, sales amounts, conversation bodies, MessageDraft bodies, AI prompts, API keys, access tokens, or secret values.

Platform Admin must update the stale Velvet endpoint that previously returned 404 to `https://velvet.karukimori.workers.dev`. Platform Admin -> Velvet Service Binding is a future candidate when same-account internal Worker monitoring is appropriate.

For Platform Admin itself, Platform Admin should monitor at least:

- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `GET /api/persistence/status`
- `POST /api/persistence/roundtrip`

For Cloudflare Worker-to-Worker monitoring, Platform Admin may use Service Binding as the internal transport.

Current Service Binding targets:

- `AI_PLATFORM_CORE_SERVICE`
- `COMMUNICATION_PLANNER_SERVICE`

Velvet also uses Service Binding as a caller to AI Platform Core:

- `AI_PLATFORM_CORE_SERVICE`

Monitoring rows should include the transport used, such as `service_binding` or `public_http`.

Platform Admin may normalize flat contract responses and API envelope responses shaped as `{ "status": "...", "data": { ... } }` into the common monitoring model.

This normalization is a Platform Admin adapter. A shared machine-readable readiness envelope should be standardized in contracts before requiring all apps to change response shape.

Old preview snapshots must be marked historical or cleaned up when a Cloudflare Production endpoint becomes canonical.

Monitoring rows must not include provider API keys, access tokens, secret prompts, prompt bodies, customer records, conversation bodies, report bodies, professional memory bodies, payment state, or sales amounts.

Platform Admin must not store canonical business records.

## Privacy Rules

Logs must not include:

- full customer master records
- payment card data
- Stripe secrets
- sales amount unless Growth Engine explicitly logs it inside Growth Engine only
- `paymentStatus` outside Growth Engine as a source of truth
- full meeting transcript
- full appraisal notes
- API keys or provider secrets
- raw AI prompts when they include sensitive information

Logs may include:

- reference IDs
- app names
- operation names
- event names
- status codes
- safe error codes
- short operational messages
- duration metrics

## Retention Guidance

MVP may keep logs in app-local storage or simple persistence.

Before production:

- define retention period
- define redaction rules
- define export rules
- define operator access control
- define incident review process

## MVP Implementation Order

1. Add `traceId` and `correlationId` to cross-app test APIs.
2. Log outbound API calls in the caller.
3. Log inbound API calls in the receiver.
4. Record event publication logs for stable events.
5. Surface logs and errors in Platform Admin.
6. Add retry policy only after logs and errors show the common failure modes.

## External Intelligence KPI Observability

External Intelligence dashboard observability focuses on development efficiency, not product runtime usage.

Tracked KPI families:

- Token per task.
- Estimated token reduction rate.
- Cache hit rate.
- Retrieval duration.
- Knowledge count.
- Task count.
- Repository-level KPI aggregation.

Token values are currently character-count-based estimates and must be distinguished from LLM provider-reported token usage.

Repository-level KPI aggregation depends on using the correct `projectId` and `repository` identity for each application.

## Feedback Hub Observability

Feedback Hub observability should support intake traceability, AI analysis auditability, and emergency signal review.

Recommended fields:

- `traceId`
- `correlationId`
- `requestId`
- `appId`
- `workspaceId`
- `userId`
- `conversationId`
- `messageId`
- `analysisId`
- `issueId`
- `category`
- `impact`
- `priorityScore`
- `eventName`
- `errorCode`
- `operation`
- `statusCode`
- `durationMs`
- `occurredAt`

Feedback Hub should allow operators to trace from a ranked Issue back to all original Conversations and Messages.
