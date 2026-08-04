# ADR 0001: Create Shared Contracts Repository

## Status

Accepted

## Context

Growth Engine, Numeria Studio, AI Platform Core, and SNS Planner are being developed as separate repositories.

They need a shared language for ownership, IDs, events, and cross-system integration.

Without a shared contract, each repository may independently define customer ownership, AI usage records, SNS responsibilities, and business workflows.

## Decision

Create `professional-platform-contracts` as the shared contract repository.

This repository owns:

- Shared glossary
- Responsibility boundaries
- Data ownership rules
- Identity contract
- API contract
- Event contract
- Entity schemas
- Event schemas
- Repository-specific implementation guidance

## Consequences

- Product repositories can evolve independently.
- Cross-repository changes must update this repository first or in the same implementation batch.
- Contract-breaking changes require explicit versioning and an ADR.
