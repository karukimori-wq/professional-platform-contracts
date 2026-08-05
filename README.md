# Professional Platform Contracts

This repository defines the shared language and integration contracts for the Professional Platform family.

It is not an application repository. It exists so each product can be built independently while still sharing the same assumptions.

## Products

| Product | Responsibility |
| --- | --- |
| Growth Engine | Acquisition, sales, customer nurturing, business workflows, and Business plan features |
| Professional Studio | Domain-specific professional work such as appraisal, report creation, and customer-facing deliverables |
| Numeria Studio | The first Professional Studio implementation for fortune-telling professionals |
| SNS Planner | SNS post creation support used by Growth Engine |
| AI Platform Core | AI activity runtime, capability registry, usage tracking, prompt/tool/workflow platform |
| Platform Admin | Operator-only monitoring, contract compliance, workspace visibility, and integration health |
| Event Engine | State-change notification between systems |

## Core Rule

Each system owns its own business responsibility.

- UI actions and immediate reads/writes use APIs.
- State changes and follow-up processing use events.
- AI Platform Core does not decide business workflows.
- SNS Planner does not decide business strategy.
- Professional Studio does not own customer acquisition or nurturing.
- Growth Engine owns the canonical customer base and business workflow state.
- Platform Admin observes and audits app health; it does not become the source of truth for business data.

## Repository Structure

```text
docs/
  contracts/       Shared product contracts and boundaries
  repositories/    Instructions for each implementation repository
  decisions/       Architecture decisions
schemas/
  entities/        Shared entity contracts
  events/          Event payload contracts
examples/          Example payloads
```

## How To Use

1. Read `docs/contracts/platform-boundaries.md` before implementing cross-product features.
2. Use `docs/contracts/shared-glossary.md` for naming.
3. Use `docs/contracts/app-responsibilities.md` to confirm canonical ownership by app.
4. Use `schemas/entities/*.schema.json` when storing or exchanging shared entities.
5. Use `schemas/events/*.schema.json` for asynchronous events.
6. Use `docs/contracts/api-catalog.md` and `docs/contracts/event-catalog.md` when wiring repositories together.
7. Use `docs/adoption-guide.md` when applying these contracts to an implementation repository.
8. Use `docs/repositories/platform-admin.md` when implementing the operator-only admin app.
9. Use `docs/contract-change-checklist.md` before changing shared contracts.
10. Add an Architecture Decision Record when a contract changes.

## Validation

Run:

```sh
npm test
```

The tests enforce the minimum boundary rules:

- Customer master belongs to Growth Engine.
- External Professional Studio events use `Session`, not `Reading`.
- SNS Planner is called through Growth Engine.
- APIs and events have separate responsibilities.
- Growth Engine shared payloads are allowlisted.
- Sensitive professional fields are rejected.

## Contract Versioning

Contracts follow semantic versioning.

- Patch: wording, examples, or non-breaking optional fields
- Minor: new event type, new optional field, new repository guidance
- Major: ownership change, required field change, event meaning change

Current version: `0.1.0`
