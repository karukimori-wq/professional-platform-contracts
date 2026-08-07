# MVP Connection Test Results

Status: Recorded
Recorded at: 2026-08-07
Contract version: 0.1.0

This document records the current MVP cross-app connection test results for the Professional Platform.

## Scope

Apps covered:

- Platform Admin
- Growth Engine
- Numeria Studio
- SNS Planner
- AI Platform Core

Contracts referenced:

- docs/contracts/api-catalog.md
- docs/contracts/event-catalog.md
- docs/contracts/event-flow.md
- docs/contracts/observability-contract.md
- docs/contracts/app-responsibilities.md

## Summary

| Test | Source App | Target App | Status | Status Code | Event Name | Error Code | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Growth Engine to SNS Planner | growth-engine | sns-planner | success | 200 | sns.post_draft.created.v1 | null | Production URL confirmed. |
| SNS Planner to AI Platform Core | sns-planner | ai-platform-core | warning | 522 | ai.activity.created.v1 | ENVIRONMENT_LIMITATION | Sites server-side fetch limitation. Direct AI Platform Core receiver validation passed. |
| Numeria Studio to AI Platform Core | numeria-studio | ai-platform-core | warning | 522 | studio.report.generated.v1 | ENVIRONMENT_LIMITATION | Sites server-side fetch limitation. Direct AI Platform Core receiver validation passed. |
| Growth Engine to AI Platform Core | growth-engine | ai-platform-core | success | 201 | ai.activity.created.v1 | null | Production Growth Engine to AI Platform Core confirmed. |
| Growth Engine to Numeria Studio | growth-engine | numeria-studio | success | 200 | studio.session.started.v1 | null | Production Growth Engine to Numeria Studio confirmed. |

## Platform Admin Observability Display

Platform Admin public URL:

- https://platform-admin-preview.illusionddt.chatgpt.site/

API:

- GET https://platform-admin-preview.illusionddt.chatgpt.site/api/mvp-connection-tests

Confirmed result:

- count: 5
- status uses success / warning / error / skipped
- Numeria Studio to AI Platform Core is warning
- errorCode is ENVIRONMENT_LIMITATION for known Sites environment limitations
- issues explains the warning reason
- Customer, Payment, Sales, Session, Report, PostDraft, and AI Activity source-of-truth data are not stored in Platform Admin

Displayed observability fields:

- traceId
- correlationId
- requestId
- eventName
- errorCode
- sourceApp
- targetApp
- operation
- endpoint
- status
- statusCode
- durationMs
- occurredAt
- issues

## Confirmed Evidence

### Growth Engine to SNS Planner

Endpoint:

- POST https://growth-engine-ruby-nine.vercel.app/api/integrations/sns-planner/post-draft-test

Result:

- Growth Engine API: 200
- SNS Planner API: 200
- status: ok
- snsPlannerStatusCode: 200
- recordedDraft.status: draft_created
- recordedDraft.workspaceId: ws_test_001
- recordedDraft.channel: instagram
- eventName: sns.post_draft.created.v1
- traceId: trace_growth_sns_confirm_001
- correlationId: corr_growth_sns_confirm_001
- requestId: req_13d2e340871c420393ad9e1819dcc0aa
- errorCode: null

Response headers:

- X-Trace-Id: trace_growth_sns_confirm_001
- X-Correlation-Id: corr_growth_sns_confirm_001
- X-Request-Id: req_13d2e340871c420393ad9e1819dcc0aa

Logs:

- Growth inbound log: api.inbound / GrowthEngine.PostDraftTest
- Growth outbound log: api.outbound / PostDraft.Generate

### Health, Version, and Contract Status

All 5 apps previously passed:

- GET /health: 200
- GET /version: 200
- GET /contracts/status: 200
- contractVersion: 0.1.0
- professionalIdRequired: false
- usesLegacyEventNames: false
- usesReportTerminology: true
- issues: []

## Data Safety

The following must not be stored in connection test results, observability logs, or Platform Admin operational snapshots:

- customer personal information
- payment information
- salesAmount
- paymentStatus
- full customer records
- full report contents
- fullMeetingTranscript
- API keys
- secret prompts

Only reference identifiers and operational metadata may be recorded.

## Interpretation

The MVP connection and observability phase is complete.

Warnings for SNS Planner to AI Platform Core and Numeria Studio to AI Platform Core are accepted as environment limitations for Sites server-side fetch behavior. They are not treated as contract failures as long as the receiver APIs validate successfully and the caller records ENVIRONMENT_LIMITATION with retryable behavior where applicable.

## Next Phase

Recommended next phase:

1. Create a production readiness checklist.
2. Finalize Growth Engine ownership for Stripe and public site management.
3. Clean up Numeria Studio local customer-master-like data.
4. Add durable log history to Platform Admin if needed.
