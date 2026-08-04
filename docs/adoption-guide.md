# Adoption Guide

This guide explains how each product repository should adopt these contracts.

## Goal

Each repository can be developed independently, but cross-system behavior must use the same terms, IDs, API names, event names, and data ownership rules.

## Minimum Adoption

Every product repository should add a short contract note that links to this repository and states:

- Which system responsibility it owns
- Which shared IDs it references
- Which APIs it calls or provides
- Which events it publishes or consumes
- Which data it must not own

## Recommended Local Files

Each implementation repository should include:

```text
docs/contracts.md
docs/integration.md
```

`docs/contracts.md` should summarize the repository's responsibility boundary.

`docs/integration.md` should list API and event integration points.

## Product-Specific Adoption

| Repository | Required Contract File |
| --- | --- |
| Growth Engine | `docs/repositories/growth-engine.md` |
| Numeria Studio | `docs/repositories/numeria-studio.md` |
| AI Platform Core | `docs/repositories/ai-platform-core.md` |
| SNS Planner | `docs/repositories/sns-planner.md` |

## Implementation Order

1. Confirm the repository's owner boundary.
2. Add local `docs/contracts.md`.
3. Add local `docs/integration.md`.
4. Rename ambiguous terms to shared terms.
5. Replace duplicated customer ownership with `customerId` references where applicable.
6. Register API operations from `docs/contracts/api-catalog.md`.
7. Register event names from `docs/contracts/event-catalog.md`.
8. Add tests for forbidden ownership and naming drift.

## Adoption Rule

If a product repository needs a new cross-system field, event, API, or ownership rule, update this repository first or in the same change batch.

Do not invent local cross-system contracts inside application repositories.
