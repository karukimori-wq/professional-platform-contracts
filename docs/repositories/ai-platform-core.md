# AI Platform Core Repository Contract

AI Platform Core owns the common AI execution platform.

It is not a business application and does not own Growth Engine decisions or Professional Studio domain logic.

## Must Implement

- Workspace, project, environment, role, permission
- API key and webhook infrastructure
- Capability registry
- Activity execution and logging
- Usage tracking
- Prompt templates
- Tool registry
- Workflow runtime
- Evaluators
- Events with `ai.*` prefix

## Must Not Implement

- Customer acquisition strategy
- Nurturing workflow decisions
- Fortune-telling calculations
- Report PDF layout
- SNS post objective selection

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/api-contract.md`
- `schemas/entities/activity.schema.json`
- `schemas/events/ai.activity.completed.v1.schema.json`

## Capability Naming

Use dotted names with domain and action.

Examples:

- `Customer.Find`
- `Report.Generate`
- `PostDraft.Generate`
- `Usage.List`
