# Platform Boundaries

This document defines what each system owns and what it must not own.

## System Responsibility Map

| System | Owns | Does Not Own |
| --- | --- | --- |
| Growth Engine | Customer canonical data, leads, sales flow, nurturing, campaign intent, business workflow state, Business plan feature rules | Appraisal logic, report rendering, AI runtime internals, SNS text generation details |
| Professional Studio | Domain-specific workflow, professional records, report generation, appraisal history, domain calculations | Customer canonical data, acquisition strategy, cross-channel nurturing decisions |
| Numeria Studio | Fortune-telling domain data, numerology and destiny-method workflows, appraisal reports, PDF previews | Growth strategy, customer master data, AI platform internals |
| SNS Planner | Post drafts, hashtags, format variants, SNS-specific text adaptation, media idea generation | Sales judgement, target selection, campaign objectives, CTA strategy |
| AI Platform Core | Workspace, project, API keys, capabilities, activities, usage, prompts, tools, workflows, evaluators | Business workflow decisions, customer nurturing policy, report domain logic |
| Event Engine | Publishing and delivering state-change events | Synchronous UI operations, source-of-truth ownership |

## Integration Rule

Use APIs for synchronous operations.

Examples:

- Open customer detail
- Create appraisal report
- Generate SNS draft
- Fetch AI usage summary

Use events for state-change notifications.

Examples:

- Customer created
- Lead converted
- Session completed
- Report generated
- AI activity completed

## Customer Ownership

Growth Engine is the canonical owner of customer basic information.

Professional Studio repositories may store domain-specific records that reference `customerId`, but they must not create a separate customer master.

Allowed in Professional Studio:

- `customerId`
- Domain-specific appraisal inputs
- Session history
- Report history
- Domain notes required for professional work

Not allowed in Professional Studio as canonical data:

- Customer name master
- LINE account master
- SNS account master
- Lead status master
- Acquisition source master
- Nurturing status master

## Business Plan Rule

Growth Engine is not sold as a separate standalone app in the initial strategy.

It is exposed inside Numeria Studio and future Professional Studio products as Business plan features.

The user experience may appear as one application, but responsibility remains split internally.

## AI Platform Core Rule

AI Platform Core provides the AI execution platform.

It does not decide:

- Which customer should be contacted
- Which campaign should run
- Which product should be sold
- Which appraisal should be recommended
- Which SNS goal should be selected

Those decisions belong to Growth Engine or the Professional Studio depending on domain responsibility.
