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
| AI SNS Growth Office | AI-company SNS marketing orchestration, CEOInstruction, SecretaryBrief, CompanyTask, AgentTask, AgentOutput, ApprovalRequest, AppProject, MarketingRoute, RouteStage, Audience, Offer, DiagnosisReport, ContentPlan, ContentDraft, ImageConcept, MediaAsset, PublishPlan, XMediaUploadJob, XPublishJob, PerformanceSnapshot, ExternalKnowledgeReference | Customer master, payment state, sales ledger, live 1-to-1 conversations, reply safety checks, AI usage ledger, Platform Admin monitoring, External Intelligence knowledge source of truth |
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

## AI SNS Growth Office Rule

AI SNS Growth Office is the AI-agent SNS marketing company orchestration layer.

It owns:

- CEO instructions and Secretary AI briefs
- company-level and agent-level marketing tasks
- AI employee outputs
- three-stage CEO approval workflow
- marketed app projects
- audience, offer, diagnosis, marketing route and route stages
- content plans, content drafts, image concepts and media assets
- publish plans, X media upload jobs and X publish jobs
- SNS marketing performance snapshots
- references to External Intelligence knowledge used during marketing work

It does not own:

- Growth Engine Customer, Lead, Reservation, Payment, Sales or Revenue source of truth
- SNS Planner PostDraft or MessageDraft source of truth until an explicit future migration contract is approved
- Communication Planner live DM, Conversation, Message, ConversationContext, ReplyDraft, SafetyCheck or send workflow
- AI Platform Core AI Activity, Usage or Capability source of truth
- Platform Admin operational snapshot source of truth
- External Intelligence development knowledge source of truth

AI SNS Growth Office can create strategy, drafts, image concepts and media assets. It cannot publish, schedule, upload final media to X, or finalize customer-facing output without CEO approval.

Current implementation boundary:

- Current runtime is an MVP skeleton with Next.js App Router, CEO dashboard, Approval Center, Image Assets, X Publish Queue, and Daily Metrics UI.
- Current persistence is seed repository plus in-process persistence. It must not be treated as durable production storage.
- Platform Admin may monitor `GET /api/health`, `GET /api/version`, and `GET /api/contracts/status`.
- Production readiness remains incomplete until durable DB-backed persistence and deployment verification are completed.

## AI SNS Growth Office and SNS Planner Future Consolidation Rule

SNS Planner remains the current canonical owner of SNS PostDraft and simple MessageDraft.

AI SNS Growth Office may eventually absorb SNS Planner functions, but that is not automatic. A future consolidation requires an explicit migration contract that defines:

- which PostDraft and MessageDraft entities move
- which APIs and events are deprecated or replaced
- data migration and compatibility rules
- Platform Admin monitoring changes
- approval and publish/schedule gate preservation

Until that contract exists, AI SNS Growth Office may hand off approved requirements or references to SNS Planner, but SNS Planner remains canonical for its existing draft records.

## AI SNS Growth Office and Communication Planner Rule

AI SNS Growth Office may design DM routes, DM copy, and customer movement strategy.

Communication Planner remains canonical for actual 1-to-1 conversation state, person context, safety checks, and channel sending.

If a workflow requires live ConversationContext, cross-person safety prevention, send confirmation, or channel dispatch, it belongs to Communication Planner.

## AI SNS Growth Office and External Intelligence Rule

AI SNS Growth Office may reference External Intelligence records as development knowledge, rules, decisions, or evidence.

External Intelligence must not become the operational source of truth for AI SNS Growth Office tasks, approvals, drafts, media assets, publish jobs, performance snapshots, customers, payments, or sales.

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
