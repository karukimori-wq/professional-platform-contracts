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

Every cross-app API call should create one outbound log in the caller and one inbound log in the receiver.

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
6. Add retry policy only after logs show the common failure modes.
