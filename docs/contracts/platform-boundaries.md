# Platform Boundaries

This document defines what each system owns and what it must not own.

## System Responsibility Map

| System | Owns | Does Not Own |
| --- | --- | --- |
| Growth Engine | Customer canonical data, leads, reservations, payments, sales flow, nurturing, campaign intent, business workflow state, Business plan feature rules | Appraisal logic, report rendering, AI runtime internals, SNS text generation details, 1-to-1 conversation internals |
| Professional Studio | Domain-specific workflow, professional records, report generation, appraisal history, domain calculations | Customer canonical data, acquisition strategy, cross-channel nurturing decisions |
| Numeria Studio | Fortune-telling domain data, numerology and destiny-method workflows, appraisal reports, PDF previews | Growth strategy, customer master data, AI platform internals |
| Velvet | Professional visits, professional memory, service notes, professional timeline, professional recall | Customer master, payment state, sales ledger, reservation source of truth, 1-to-1 channel inbox source of truth |
| SNS Planner | Post drafts, hashtags, format variants, SNS-specific text adaptation, media idea generation, simple business-initiated message drafts | Sales judgement, target selection, campaign objectives, CTA strategy, live conversation context, channel sending, reply safety checks |
| Communication Planner | Unified Inbox, Communication Person projection, ChannelIdentity, Conversation, Message, ConversationContext, Topic, Promise, Communication NextAction, ReplyDraft, SafetyCheck, send workflow | Customer master, payment state, sales ledger, campaign strategy, SNS PostDraft, Professional App domain records, AI usage ledger |
| AI Platform Core | Workspace, project, API keys, capabilities, activities, usage, prompts, tools, workflows, evaluators | Business workflow decisions, customer nurturing policy, report domain logic, conversation or memory source-of-truth ownership |
| Platform Admin | Operational snapshots, health/status, contract monitoring, integration logs, error summaries | Customer master, message bodies, conversation context bodies, professional memory bodies, payment data, sales ledger |
| Event Engine | Publishing and delivering state-change events | Synchronous UI operations, source-of-truth ownership |

## Integration Rule

Use APIs for synchronous operations.

Examples:

- Open customer detail
- Create appraisal report
- Generate SNS draft
- Create or check a conversation reply draft
- Fetch AI usage summary

Use events for state-change notifications.

Examples:

- Customer created
- Lead converted
- Session completed
- Report generated
- Message received
- Reply safety checked
- AI activity completed

## Customer Ownership

Growth Engine is the canonical owner of customer basic information.

Professional Studio repositories and Communication Planner may store domain-specific records that reference `customerId`, but they must not create a separate customer master.

Allowed outside Growth Engine:

- `customerId`
- domain-specific professional records
- Communication Planner `personId` and channel identities
- Conversation or message references
- Session history
- Report history
- Domain notes required for professional work

Not allowed outside Growth Engine as canonical data:

- Customer name master
- contact master
- Lead status master
- Acquisition source master
- Nurturing status master
- Payment state
- Sales ledger

## Communication Planner Rule

Communication Planner is person-first, not channel-first.

It owns the records required to answer:

- who needs a response
- what the current conversation context is
- what was promised
- what the next communication action is
- whether a reply draft is safe to send

It must scope reply generation and safety checks by `workspaceId + personId + conversationId`.

It must not use another person's context to generate or send a reply.

Full message bodies, full conversation histories and full ConversationContext bodies are not default cross-app payloads.

## SNS Planner vs Communication Planner Rule

SNS Planner is for 1-to-many public or semi-public content and simple business-initiated message drafts.

Communication Planner is for 1-to-1 conversations, live reply context, channel send and safety checks.

If a workflow requires ConversationContext or send confirmation, it belongs to Communication Planner.

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
- Whether a reply should be sent

Those decisions belong to Growth Engine, Communication Planner, or the Professional Studio depending on domain responsibility.
