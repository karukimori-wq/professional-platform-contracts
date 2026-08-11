# Proposal: Velvet synchronous AI capabilities

Status: proposed / not yet approved for the shared API catalog.

## Purpose

Velvet needs user-triggered synchronous AI assistance while keeping Velvet business data canonical in Velvet and AI usage canonical in AI Platform Core.

The UI must remain Pull-first. These capabilities are never an unsolicited daily coaching mechanism.

## Proposed operations

### `VelvetCapture.Structure`
Caller: Velvet

Purpose: interpret a raw user-created post-visit memo into candidate structured updates.

Request should prefer:
- workspaceId
- userId / ownerUserId reference
- captureId
- capability input containing only the user-selected/raw Capture text necessary for this invocation
- traceId / correlationId / requestId

Response:
- candidate list only
- candidate type, normalized value, confidence/ambiguity metadata as needed
- no direct mutation of Velvet canonical data

Velvet must show lightweight confirmation before applying inferred candidates.

### `VelvetSearch.ParseIntent`
Caller: Velvet

Purpose: parse a user-entered natural-language search into a safe structured query intent.

Request should contain:
- workspaceId
- userId / ownerUserId reference
- raw search query
- traceId / correlationId / requestId

Response should contain structured search intent/filters only.

AI Platform Core must not receive the user's entire Velvet guest database for this operation. Velvet executes the resulting query against owner-scoped Velvet data.

## Data boundaries

Do not automatically send:
- full guest/contact dataset
- raw full visit history unrelated to the requested operation
- payment or receivable history unless a future explicitly approved capability requires it
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

## Approval work

If approved, add stable PascalCase operation names to `docs/contracts/api-catalog.md` and define transport mappings/capability IDs in the relevant repositories. Until then, Velvet should report the synchronous AI contract as not ready and may use deterministic/local fallback behavior without pretending AI Platform Core integration is complete.
