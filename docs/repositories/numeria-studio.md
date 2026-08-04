# Numeria Studio Repository Contract

Numeria Studio is the first Professional Studio implementation.

It owns fortune-telling professional work, appraisal sessions, report creation, previews, and PDF output.

## Must Implement

- Fortune-telling domain workflows
- Numerology, Nine Star Ki, Four Pillars, astrology, and other appraisal modules as selected
- Session records referencing `customerId`
- Report generation and report history
- PDF preview/export
- Domain-specific appraisal data
- Calls to Growth Engine for customer profile reads
- Calls to AI Platform Core for AI-assisted interpretation and report writing
- Events with `studio.*` prefix

## Must Not Implement

- Canonical customer master
- Lead lifecycle master
- Acquisition and nurturing strategy
- SNS campaign objective decisions
- AI usage ledger

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/data-ownership.md`
- `schemas/entities/session.schema.json`
- `schemas/events/studio.report.generated.v1.schema.json`

## Customer Handling

Numeria Studio should store `customerId` and appraisal-specific records.

It may display customer names fetched from Growth Engine, but Growth Engine remains the source of truth.
