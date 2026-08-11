# Velvet synchronous AI capabilities

Status: approved in `docs/contracts/api-catalog.md`.

## Purpose

Velvet uses user-triggered synchronous AI assistance while keeping Velvet business data canonical in Velvet and AI usage canonical in AI Platform Core.

The UI remains Pull-first. These capabilities are not an unsolicited daily coaching mechanism.

## Approved operations

### `VelvetCapture.Structure`
Caller: Velvet

Purpose: interpret a raw user-created post-visit memo into candidate structured updates.

Request should prefer:
- workspaceId when applicable
- userId / ownerUserId reference when required for usage/account scope
- captureId/reference when needed
- only the raw Capture text necessary for this invocation
- traceId / correlationId / requestId

Response:
- candidate list only
- candidate type and normalized value, with confidence/ambiguity metadata where useful
- no direct mutation of Velvet canonical data

Velvet shows lightweight confirmation before applying inferred candidates.

### `VelvetSearch.ParseIntent`
Caller: Velvet

Purpose: parse a user-entered natural-language search into a safe structured query intent.

Request should contain only the query plus the minimum identity/reference and observability metadata required by the shared contract.

Response contains structured search intent/terms/filters only.

AI Platform Core does not receive the user's entire Velvet guest database for this operation. Velvet executes the resulting query against owner-scoped Velvet data.

## Data boundaries

Do not automatically send:
- full guest/contact dataset
- raw full visit history unrelated to the requested operation
- payment or receivable history
- private relationship graph
- image library
- unrelated Capture entries

## Source of truth

- Velvet: Person/Guest, Visit, Knowledge, Gift, Relationship, Schedule, Capture and all Velvet business state.
- AI Platform Core: AI execution and AI usage accounting.

## Observability

Top-level operational status uses only:
- success
- warning
- error
- skipped

Preserve traceId, correlationId and requestId. Operational logs/events must not contain private guest content.

## Transport mapping

Stable operation names are approved in `docs/contracts/api-catalog.md`. Concrete HTTP paths remain deployment/repository-specific and must be configured by the product runtime rather than inferred from operation names.
