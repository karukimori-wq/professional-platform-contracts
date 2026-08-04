# Growth Engine Repository Contract

Growth Engine owns acquisition, sales, customer nurturing, and Business plan workflows.

## Must Implement

- Customer canonical model
- Lead lifecycle
- Acquisition source management
- LINE/SNS relationship references
- Business plan feature gating
- Campaign intent creation
- Nurturing workflow state
- Calls to SNS Planner for draft creation
- Calls to AI Platform Core for AI activities and usage
- Events with `growth.*` prefix

## Must Not Implement

- Fortune-telling calculations
- Report rendering and PDF layout
- SNS post strategy inside SNS Planner
- AI runtime internals
- Duplicate Professional Studio report master

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/identity-contract.md`
- `schemas/entities/customer.schema.json`
- `schemas/events/growth.customer.created.v1.schema.json`

## Implementation Note

Growth Engine appears inside Numeria Studio as Business plan features, but it remains a separate responsibility boundary.
