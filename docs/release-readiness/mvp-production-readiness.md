# MVP Production Readiness Checklist

Status: Draft for app confirmation
Updated at: 2026-08-08
Contract version: 0.1.0

This document defines the minimum production readiness checklist after MVP connection and observability tests.

Target apps:

- Growth Engine
- Numeria Studio
- SNS Planner
- AI Platform Core
- Platform Admin

## Purpose

Before MVP production use, each app must confirm that it follows the shared contracts, source-of-truth boundaries, observability rules, and data-safety rules.

Each app should answer Yes or No for the applicable checklist items. Any No must be fixed or explicitly accepted as a known limitation before production use.

## Global Checklist

| Item | Required | Expected Answer |
| --- | --- | --- |
| App exposes GET /health | Yes | Yes |
| App exposes GET /version | Yes | Yes |
| App exposes GET /contracts/status | Yes | Yes |
| /contracts/status returns contractVersion | Yes | Yes |
| contractVersion is 0.1.0 | Yes | Yes |
| identityMode is workspaceId+userId | Yes | Yes |
| professionalIdRequired is false | Yes | Yes |
| usesLegacyEventNames is false | Yes | Yes |
| usesReportTerminology is true where applicable | Yes | Yes |
| canonicalOwnershipChecked is true | Yes | Yes |
| issues is empty or explicitly explained | Yes | Yes |
| CORS supports required MVP endpoints | Yes | Yes |
| OPTIONS supports required MVP endpoints | Yes | Yes |
| CORS allows Content-Type | Yes | Yes |
| CORS allows X-Trace-Id | Yes | Yes |
| CORS allows X-Correlation-Id | Yes | Yes |
| CORS allows X-Source-App | Yes | Yes |

## Observability Checklist

| Item | Required | Expected Answer |
| --- | --- | --- |
| Cross-app APIs accept X-Trace-Id | Yes | Yes |
| Cross-app APIs accept X-Correlation-Id | Yes | Yes |
| Cross-app APIs accept X-Source-App | Yes | Yes |
| Receiver generates requestId | Yes | Yes |
| Receiver returns X-Trace-Id | Yes | Yes |
| Receiver returns X-Correlation-Id | Yes | Yes |
| Receiver returns X-Request-Id | Yes | Yes |
| Response JSON includes traceId | Yes | Yes |
| Response JSON includes correlationId | Yes | Yes |
| Response JSON includes requestId | Yes | Yes |
| Stable event uses eventName | Yes | Yes |
| API inbound log is recorded | Yes | Yes |
| API outbound log is recorded where caller exists | Yes | Yes |
| event.published log is recorded for stable events | Yes | Yes |
| error.code uses shared catalog | Yes | Yes |
| status uses success / warning / error / skipped | Yes | Yes |

## Shared Error Codes

Apps must use these shared error codes where applicable:

- BAD_REQUEST
- CONTRACT_VIOLATION
- UPSTREAM_TIMEOUT
- UPSTREAM_UNAVAILABLE
- UPSTREAM_BAD_RESPONSE
- ENVIRONMENT_LIMITATION
- INTERNAL_ERROR

## Source-of-Truth Checklist

| Domain | Source of Truth | Other Apps Must Not Become Source of Truth |
| --- | --- | --- |
| Customer | Growth Engine | Numeria Studio, SNS Planner, AI Platform Core, Platform Admin |
| Reservation | Growth Engine | Numeria Studio, SNS Planner, AI Platform Core, Platform Admin |
| Payment | Growth Engine | Numeria Studio, SNS Planner, AI Platform Core, Platform Admin |
| Sales | Growth Engine | Numeria Studio, SNS Planner, AI Platform Core, Platform Admin |
| Public Site | Growth Engine | Numeria Studio, SNS Planner, AI Platform Core, Platform Admin |
| Session | Numeria Studio | Growth Engine, SNS Planner, AI Platform Core, Platform Admin |
| Report | Numeria Studio | Growth Engine, SNS Planner, AI Platform Core, Platform Admin |
| PostDraft | SNS Planner | Growth Engine, Numeria Studio, AI Platform Core, Platform Admin |
| AI Activity | AI Platform Core | Growth Engine, Numeria Studio, SNS Planner, Platform Admin |
| Operational Snapshot | Platform Admin | Growth Engine, Numeria Studio, SNS Planner, AI Platform Core |

## Data Safety Checklist

The following data must not be sent to unrelated apps, stored in connection test results, or stored in Platform Admin operational snapshots:

- customer personal information beyond reference IDs
- full customer records
- payment card data
- paymentStatus outside Growth Engine
- salesAmount outside Growth Engine unless explicitly required by a Growth Engine-owned report
- campaignCode outside Growth Engine unless explicitly required by a Growth Engine-owned flow
- full report contents
- full chart contents
- fullMeetingTranscript
- API keys
- secret prompts
- access tokens

## App-Specific Checklist

### Growth Engine

| Item | Required | Expected Answer |
| --- | --- | --- |
| Owns Customer source of truth | Yes | Yes |
| Owns Reservation source of truth | Yes | Yes |
| Owns Payment source of truth | Yes | Yes |
| Owns Sales source of truth | Yes | Yes |
| Owns Public Site source of truth | Yes | Yes |
| Stripe is the MVP payment provider | Yes | Yes |
| Does not send paymentStatus to Numeria Studio, SNS Planner, or AI Platform Core | Yes | Yes |
| Does not send salesAmount to Numeria Studio, SNS Planner, or AI Platform Core unless contract-approved | Yes | Yes |
| Growth Engine to SNS Planner test is success | Yes | Yes |
| Growth Engine to AI Platform Core test is success | Yes | Yes |
| Growth Engine to Numeria Studio test is success | Yes | Yes |

### Numeria Studio

| Item | Required | Expected Answer |
| --- | --- | --- |
| Owns Session source of truth | Yes | Yes |
| Owns Report source of truth | Yes | Yes |
| Uses Report terminology externally | Yes | Yes |
| Does not use Document terminology externally | Yes | Yes |
| Does not use legacy event names | Yes | Yes |
| Publishes studio.session.started.v1 where applicable | Yes | Yes |
| Publishes studio.session.completed.v1 where applicable | Yes | Yes |
| Publishes studio.report.generated.v1 where applicable | Yes | Yes |
| Does not treat studio.recommendation.created.v1 as stable | Yes | Yes |
| Does not store Growth Engine customer master data as canonical data | Yes | Yes |
| If local customer-like data remains, it is explicitly temporary and non-canonical | Yes | Yes |
| Does not send personal names, birthdays, full chart contents, or fullMeetingTranscript to AI Platform Core | Yes | Yes |
| Numeria Studio to AI Platform Core warning is ENVIRONMENT_LIMITATION only | Yes | Yes |

### SNS Planner

| Item | Required | Expected Answer |
| --- | --- | --- |
| Owns PostDraft source of truth | Yes | Yes |
| Does not own campaign strategy decisions | Yes | Yes |
| Does not own sales decisions | Yes | Yes |
| Does not own funnel analysis decisions | Yes | Yes |
| Receives Growth Engine brief by reference and content requirements | Yes | Yes |
| Publishes sns.post_draft.created.v1 where applicable | Yes | Yes |
| Publishes sns.post_draft.updated.v1 where applicable | Yes | Yes |
| Sends AI Activity reference payload only | Yes | Yes |
| Does not send customer personal information to AI Platform Core | Yes | Yes |
| SNS Planner to AI Platform Core warning is ENVIRONMENT_LIMITATION only | Yes | Yes |

### AI Platform Core

| Item | Required | Expected Answer |
| --- | --- | --- |
| Owns AI Activity source of truth | Yes | Yes |
| Owns AI Usage source of truth | Yes | Yes |
| Owns AI Capability source of truth | Yes | Yes |
| Does not own Customer source of truth | Yes | Yes |
| Does not own Reservation source of truth | Yes | Yes |
| Does not own Payment source of truth | Yes | Yes |
| Does not own Sales source of truth | Yes | Yes |
| POST /api/activities returns 201 on valid payload | Yes | Yes |
| Publishes ai.activity.created.v1 where applicable | Yes | Yes |
| Does not store full prompts, API keys, personal names, birthdays, full chart contents, or payment data in logs | Yes | Yes |

### Platform Admin

| Item | Required | Expected Answer |
| --- | --- | --- |
| Owns operational snapshot only | Yes | Yes |
| Does not own Customer source of truth | Yes | Yes |
| Does not own Payment source of truth | Yes | Yes |
| Does not own Sales source of truth | Yes | Yes |
| Does not own Session source of truth | Yes | Yes |
| Does not own Report source of truth | Yes | Yes |
| Does not own PostDraft source of truth | Yes | Yes |
| Does not own AI Activity source of truth | Yes | Yes |
| Displays observability fields for 5 MVP tests | Yes | Yes |
| Shows ENVIRONMENT_LIMITATION warnings without treating them as contract failures | Yes | Yes |
| Does not store personal information, payment data, full reports, full prompts, or secrets | Yes | Yes |

## Required App Response Format

Each app should respond with the following format:

```json
{
  "appName": "growth-engine",
  "checklistVersion": "mvp-production-readiness-0.1.0",
  "status": "ready | needs_fix | blocked",
  "checkedAt": "ISO-8601 timestamp",
  "items": [
    {
      "id": "string",
      "answer": "yes | no | not_applicable",
      "evidence": "short explanation or endpoint/file reference",
      "issue": null
    }
  ],
  "summary": {
    "yes": 0,
    "no": 0,
    "notApplicable": 0
  }
}
```

## Release Gate

MVP production readiness can be accepted when:

- all required global items are Yes
- all required app-specific items are Yes or explicitly accepted as known limitations
- no app stores another app's canonical data as source of truth
- no app stores prohibited sensitive data in logs or operational snapshots
- warning statuses are limited to accepted environment limitations
- Platform Admin shows current status and issues clearly
