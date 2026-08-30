# Data Ownership

This document defines canonical ownership for shared data.

## Ownership Table

| Data | Canonical Owner | Referenced By |
| --- | --- | --- |
| Customer profile / Customer master | Growth Engine | Professional Apps and Communication Planner by reference/projection |
| Lead status | Growth Engine | Professional Apps where contracted |
| Acquisition source | Growth Engine | Professional Apps where contracted |
| Nurturing status | Growth Engine | Professional Apps where contracted |
| Reservation / Visit Schedule | Growth Engine | Professional Apps by reference |
| Payment / Stripe payment state | Growth Engine | Other apps by reference/snapshot only when necessary |
| Sales / Revenue ledger | Growth Engine | Other apps by reference/query only |
| Customer-level sales aggregation | Growth Engine | Velvet Business and other contracted consumers |
| Repeat / referral / contact-measure Business state | Growth Engine | Velvet Business / SNS Planner / Communication Planner where contracted by reference |
| Communication Person projection | Communication Planner | Growth Engine by reference where customer linkage exists |
| ChannelIdentity | Communication Planner | Communication Planner; Platform Admin by operational status only |
| Conversation | Communication Planner | Communication Planner; Growth Engine by reference only where contracted |
| Message | Communication Planner | Communication Planner only; other apps by reference only |
| ConversationContext | Communication Planner | Communication Planner; AI Platform Core by scoped execution only |
| Communication Topic | Communication Planner | Communication Planner; Growth Engine by reference where contracted |
| Communication Promise | Communication Planner | Communication Planner; Growth Engine by reference where contracted |
| Communication NextAction | Communication Planner | Communication Planner; Growth Engine by reference where contracted |
| ReplyDraft | Communication Planner | Communication Planner; Platform Admin by operational status only |
| SafetyCheck | Communication Planner | Communication Planner; Platform Admin by operational status only |
| Session | Numeria Studio | Growth Engine by reference only; Platform Admin by operational status only |
| Report | Numeria Studio | Growth Engine by `reportRef`/reference only; Platform Admin by operational status only |
| Calculation Result | Numeria Studio | AI Platform Core by scoped execution only |
| Numeria Snapshot | Numeria Studio | Growth Engine by reference only where contracted |
| Numeria Persistence | Numeria Studio | Platform Admin by readiness status only |
| Domain appraisal data | Numeria Studio | AI Platform Core by scoped execution only |
| SNS post draft | SNS Planner | Growth Engine, Velvet by reference only where needed |
| SNS message draft | SNS Planner | Growth Engine, Velvet by reference only where needed |
| Campaign intent | Growth Engine | SNS Planner |
| CEOInstruction | AI SNS Growth Office | Platform Admin by operational status only |
| SecretaryBrief | AI SNS Growth Office | Platform Admin by operational status only |
| CompanyTask | AI SNS Growth Office | Platform Admin by operational status only |
| AgentTask | AI SNS Growth Office | Platform Admin by operational status only |
| AgentOutput | AI SNS Growth Office | Platform Admin by operational status only |
| ApprovalRequest | AI SNS Growth Office | Platform Admin by operational status only |
| AppProject | AI SNS Growth Office | Growth Engine by reference where contracted |
| MarketingRoute / RouteStage | AI SNS Growth Office | Growth Engine by reference where contracted |
| Audience / Offer | AI SNS Growth Office | Growth Engine by reference where contracted |
| DiagnosisReport | AI SNS Growth Office | Growth Engine by reference where contracted |
| ContentPlan / ContentDraft | AI SNS Growth Office | SNS Planner by explicit handoff where contracted |
| ImageConcept / MediaAsset | AI SNS Growth Office | SNS Planner by reference where contracted |
| PublishPlan | AI SNS Growth Office | SNS Planner / Platform Admin by reference where contracted |
| XMediaUploadJob | AI SNS Growth Office | Platform Admin by operational status only |
| XPublishJob | AI SNS Growth Office | Platform Admin by operational status only |
| SNS marketing PerformanceSnapshot | AI SNS Growth Office | Growth Engine by summary/reference where contracted |
| ExternalKnowledgeReference | AI SNS Growth Office | External Intelligence by referenced record only |
| Customer-scoped Professional Memory | Velvet | Growth Engine by reference/summary only where contracted; AI Platform Core by scoped execution only |
| Velvet professional Visit | Velvet | Growth Engine by reference/summary where needed |
| Velvet ServiceNote / conversation note | Velvet | Other apps only by minimum necessary reference/summary |
| Velvet preferences / cautions / previous handling | Velvet | Velvet; AI Platform Core only as scoped execution input |
| Velvet professional timeline | Velvet | Velvet; Growth Engine only through contracted refs/summaries |
| Velvet next action / summary reference | Velvet | Growth Engine by contracted reference only |
| Velvet Gift / relationship memory | Velvet | Velvet |
| Velvet SelfInvestmentEntry | Velvet | Velvet |
| Velvet Capture | Velvet | AI Platform Core may process scoped content; Velvet remains canonical owner |
| Velvet Persistence / D1 roundtrip | Velvet | Platform Admin by readiness status only |
| Velvet dictionary/suggestion state | Velvet | Velvet |
| Capability | AI Platform Core | All apps |
| AI activity | AI Platform Core | All apps |
| AI usage | AI Platform Core | All apps |
| AI Activity Outcome | AI Platform Core | Calling app by reference/status |
| AI Activity Feedback | AI Platform Core | Calling app by reference/status |
| AI Prompt Template | AI Platform Core | Product runtimes by rendered output only |
| AI Runtime Storage | AI Platform Core | AI Platform Core only unless explicit contract exists |

## Numeria Studio Cloudflare D1 Ownership

Numeria Studio now runs on Cloudflare Workers with Static Assets and Cloudflare D1.

Numeria Studio D1 may store canonical Numeria-owned records only:

- Session
- Report
- Calculation Result
- Numeria Snapshot
- Numeria persistence metadata required for `/api/persistence/status` and `/api/persistence/roundtrip`

Numeria Studio D1 must not become a source of truth for Growth Engine Customer, Reservation, Payment, Sales, Communication Planner Conversation/Message/ConversationContext/ReplyDraft/SafetyCheck, SNS Planner PostDraft/MessageDraft, AI Platform Core AI Activity/Usage/Capability, or Platform Admin operational snapshots.

Growth Engine integration remains reference-first. Numeria Studio may receive `workspaceId`, `userId`, `reservationId`, `customerId`, `traceId`, and `correlationId`; it may return `sessionId`, `reportId`, and `reportRef`.

Report body, Customer information, Payment, Sales, and conversation bodies are not default cross-app payloads.

## Growth Engine Customer and Communication Planner Person

There is one canonical shared Customer domain: Growth Engine `Customer`.

Communication Planner may maintain a `Person` projection for communication identity, channel linking, and conversation routing. This Person is not a competing Customer master.

- Communication Planner Person may reference Growth Engine `customerId` through `customerRef`.
- Channel display labels, avatar URLs, and external user IDs are ChannelIdentity metadata, not canonical Customer profile fields.
- Communication Planner must not silently overwrite Growth Engine Customer master fields.
- Growth Engine Customer changes must not silently overwrite Communication Planner conversation context, messages, promises, or safety records.

## Communication Planner Conversation Data

Communication Planner owns the 1-to-1 communication records needed to prevent context mixing:

- ChannelIdentity
- Conversation
- Message
- ConversationContext
- Topic
- Promise
- Communication NextAction
- ReplyDraft
- SafetyCheck

These records are scoped by `workspaceId` and `personId`.

Cross-app sharing is reference-first. Other apps may receive references such as `personId`, `conversationId`, `messageId`, `contextId`, `promiseId`, `nextActionId`, `replyDraftId`, and `safetyCheckId` only when a contracted workflow requires them.

Full message bodies, full conversation histories, and full ConversationContext bodies must not be sent to Growth Engine, SNS Planner, Velvet, Numeria Studio, Platform Admin, or AI Platform Core by default.

## Communication Planner vs Growth Engine Business State

Growth Engine owns the business reason for communication:

- lead lifecycle
- reservation / visit schedule
- repeat / referral / contact-measure state
- payment and sales status
- customer-level business analysis

Communication Planner owns the communication execution state:

- whether a conversation requires reply
- what was said in a scoped conversation
- what promise or next communication action exists
- whether a generated reply passed SafetyCheck
- whether an approved reply was sent

A Communication NextAction is not a Growth Engine Follow-up source of truth unless Growth Engine explicitly imports or references it through a contracted workflow.

## Communication Planner vs SNS Planner Drafts

SNS Planner owns PostDraft and existing simple MessageDraft creation state.

Communication Planner owns conversation-contextual ReplyDraft and SafetyCheck state.

Use SNS Planner when the task is a simple business-initiated contact or follow-up draft that does not require live conversation context or channel send.

Use Communication Planner when the task requires:

- person-centered inbox context
- live conversation history
- reply generation inside a conversation
- SafetyCheck
- channel send
- prevention of cross-person context mixing

A future migration may move SNS `MessageDraft` ownership into Communication Planner. Until then, both contracts are valid with the boundary above.

## AI SNS Growth Office Marketing Company Data

AI SNS Growth Office owns the AI-company marketing operation records used to plan and execute SNS marketing routes:

- CEOInstruction
- SecretaryBrief
- CompanyTask
- AgentTask
- AgentOutput
- ApprovalRequest
- AppProject
- MarketingRoute
- RouteStage
- Audience
- Offer
- DiagnosisReport
- ContentPlan
- ContentDraft
- ImageConcept
- MediaAsset
- PublishPlan
- XMediaUploadJob
- XPublishJob
- PerformanceSnapshot
- ExternalKnowledgeReference

These records are canonical for marketing-company operations only. They do not transfer ownership of Customer, Lead, Reservation, Payment, Sales, live DM conversation, SNS Planner draft state, AI usage ledger, or Platform Admin operational snapshots.

Current persistence status:

- Current implementation uses seed repository plus in-process persistence helpers.
- DB-backed repository persistence is not yet established.
- These records are contractually AI SNS Growth Office-owned, but production source-of-truth readiness must remain pending until durable storage is implemented and verified.

Current implemented owned surfaces:

- Company task state
- Approval request state
- App project state
- Media asset state
- X media upload job preparation state
- X publish queue preparation state
- Performance snapshot state

## AI SNS Growth Office vs Growth Engine Business State

Growth Engine owns the commercial source of truth:

- Customer
- Lead lifecycle
- Reservation / Visit Schedule
- Payment
- Sales / Revenue
- customer development
- campaign business state where derived from Customer, Lead, Reservation, Payment or Sales

AI SNS Growth Office may design a marketing route or campaign plan for an app such as Numeria Studio or Velvet. That route is not the canonical Growth Engine sales ledger, reservation workflow, payment state, or customer lifecycle state.

Cross-app payloads should use references such as:

- `workspaceId`
- `userId`
- `appProjectId`
- `marketingRouteId`
- `contentPlanId`
- `contentDraftId`
- `publishPlanId`
- `traceId`
- `correlationId`

AI SNS Growth Office must not receive or persist Growth Engine Customer master records, canonical `paymentStatus`, canonical `salesAmount`, Payment records, Sales records, Stripe data, API keys, access tokens, or secret prompts unless a future explicit contract approves a minimum scoped subset.

## AI SNS Growth Office vs SNS Planner

SNS Planner remains canonical for SNS PostDraft and simple MessageDraft until an explicit future migration contract changes ownership.

AI SNS Growth Office may:

- create company tasks and content requirements
- create ContentPlan / ContentDraft / ImageConcept / MediaAsset records for its own marketing-company workflow
- hand off approved references to SNS Planner where a contracted PostDraft or MessageDraft workflow is still used

AI SNS Growth Office must not silently take over SNS Planner PostDraft or MessageDraft source-of-truth records without an explicit migration contract.

## AI SNS Growth Office vs Communication Planner

Communication Planner remains canonical for:

- live DM / 1-to-1 conversations
- Conversation and Message
- ConversationContext
- ReplyDraft
- SafetyCheck
- send workflow
- mis-send prevention

AI SNS Growth Office may design a DM route or propose DM copy as part of marketing strategy, but live conversation context, safety checking, and channel sending belong to Communication Planner.

AI SNS Growth Office must not receive full Communication Planner message bodies, full conversation histories, full ConversationContext bodies, channel access tokens, or private channel metadata by default.

## AI SNS Growth Office PerformanceSnapshot Rule

AI SNS Growth Office owns SNS marketing performance snapshots for its own route diagnosis and analytics.

Recommended daily metrics:

- `impressions`
- `profile_visits`
- `follows`
- `engagement_count`
- `cta_clicks`
- `landing_page_visits`
- `trial_or_signup_count`
- `purchase_count`
- `revenue`

Missing metrics must be stored as `unknown`, not `0`.

PerformanceSnapshot does not become the Growth Engine Sales / Revenue source of truth. Growth Engine remains canonical for sales and payment records.

## AI SNS Growth Office External Intelligence Rule

AI SNS Growth Office may store `ExternalKnowledgeReference` records that point to External Intelligence knowledge, decisions, rules, or evidence.

External Intelligence remains a development knowledge layer. It must not become the operational source of truth for AI SNS Growth Office tasks, approvals, drafts, assets, publish jobs, performance snapshots, customer records, or sales records.

## Velvet Cloudflare D1 Ownership

Velvet now runs on Cloudflare Workers with Next.js 16 + OpenNext Cloudflare and Cloudflare D1.

Cloudflare Production canonical storage mode is `VELVET_STORAGE_MODE=d1`.

Velvet storage abstraction may support `memory`, `postgres`, and `d1`, but new Production features must not be implemented as Postgres-only features.

Velvet D1 may store Velvet-owned professional data only:

- Customer-scoped Professional Memory
- Velvet Visit
- Velvet Note / Service Note
- Professional Timeline
- Professional Next Action
- Professional Recall
- Capture-related Velvet-owned structured information
- Persistence roundtrip records

Customer Memory D1 write/read and workspace/user isolation are Production verified.

Cloudflare migration complete does not mean all Velvet repositories have complete D1 Production E2E coverage. Visit, Note, Timeline, Next Action, Capture, and other Professional Memory repository D1 coverage remains `IN PROGRESS / NEXT` until separately verified.

Growth Engine Customer remains canonical. Velvet uses `customerId` as a reference and owns the Professional Memory attached to that reference.

Customer master != Velvet.

Customer-scoped Professional Memory = Velvet.

Velvet D1 must not become a source of truth for Customer, Reservation, Payment, Sales, Communication Planner records, SNS Planner MessageDraft records, or AI Platform Core AI Activity/Usage/Capability records.

## Growth Engine Customer and Velvet Professional Memory

There is one canonical shared Customer domain: Growth Engine `Customer`.

Velvet does not own a competing Guest/Person master.

- Velvet professional memory is keyed by/reference-linked to Growth Engine `customerId` where integrated.
- Velvet may retain minimum display/cache fields only when explicitly allowed by contract.
- Preferences, cautions, service notes, conversation notes, previous handling and professional timeline remain Velvet-owned professional data.
- Velvet professional memory must not silently overwrite Growth Engine Customer master fields.
- Growth Engine Customer changes must not silently overwrite Velvet confidential professional notes.

## Velvet Visit vs Growth Engine Reservation / Visit Schedule

Velvet owns the professional service-history record created during/after service.
Growth Engine owns the canonical Reservation / Visit Schedule business record.

A Velvet Visit may reference:

- `customerId`
- `reservationId`
- `visitScheduleId`

Velvet may return these contracted references/summaries to Growth Engine when a business workflow needs them:

- `visitId`
- `summaryRef`
- `nextActionRef`
- `lastVisitAt`
- `traceId`
- `correlationId`

The reference does not transfer Reservation, Visit Schedule, Customer, Payment, or Sales ownership to Velvet. A summary reference does not transfer the full professional note body to Growth Engine.

## SNS Planner Drafts vs Growth Engine Business State

SNS Planner owns PostDraft and simple MessageDraft creation state.

Growth Engine owns the business reason for the draft:

- campaign intent
- contact-measure intent
- repeat / referral / lead lifecycle state
- audience selection where derived from Customer, Lead, Sales or Reservation data

A MessageDraft may reference:

- `workspaceId`
- `userId`
- `messageDraftId`
- `channel`
- `purpose`
- `targetStudio`
- `inputRef`

SNS Planner must not persist or receive Customer master records, canonical `paymentStatus`, canonical `salesAmount`, Payment records, Sales records, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts as MessageDraft source data.

## Sales and Payment Rule

Growth Engine is the canonical owner of Payment, Sales and Revenue.

Communication Planner, Velvet, Numeria Studio, SNS Planner, AI Platform Core and Platform Admin must not persist:

- canonical `salesAmount`
- canonical `paymentStatus`
- Payment records
- Sales/Revenue ledger entries
- Stripe secrets or credentials

Growth Engine should not send `paymentStatus`, `salesAmount` or Stripe data to Communication Planner, Velvet, Numeria Studio, SNS Planner, AI Platform Core or Platform Admin unless a future explicit contract establishes a minimum necessary field for a specific operation. Default integrations omit them.

## Velvet Plan Value Boundary

### Pro - JPY 10,000/month

Professional value: **顧客を忘れない・接客品質を上げる**.

Velvet owns the professional memory/recall capabilities that support this value.

### Business - JPY 30,000/month

Business value: **来店・売上・リピートを増やす**.

Business uses Growth Engine canonical business data and state. Velvet must not duplicate those sources of truth merely to render Business features.

## Reference-first Integration

Growth Engine -> Velvet default references:

- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`
- `traceId`
- `correlationId`

Growth Engine or Professional App -> Communication Planner default references:

- `workspaceId`
- `userId`
- `customerId` where linked
- `personId` where already known
- `conversationId` where already known
- `purpose`
- `inputRef`
- `traceId`
- `correlationId`

Communication Planner -> Growth Engine default references/summaries where contracted:

- `personId`
- `conversationId`
- `promiseId`
- `nextActionId`
- `replyDraftId`
- `safetyCheckId`
- `messageRef`
- `traceId`
- `correlationId`

Raw message bodies, full conversation histories, full ConversationContext bodies, raw confidential note bodies and full professional memory bodies are not default cross-app payloads.

## Duplication Rules

Allowed duplication:

- minimal cached display name where contractually justified
- channel display labels and avatars needed for communication routing
- historical report snapshots
- external-service metadata needed for traceability
- explicit reference IDs across contracted integrations
- derived UI-only values that do not become a competing source of truth

Not allowed duplication:

- independent Customer master in Communication Planner, Velvet, Numeria Studio or SNS Planner
- independent Payment or Sales ledger outside Growth Engine
- Communication Planner-persisted canonical `salesAmount` or `paymentStatus`
- Velvet-persisted canonical `salesAmount` or `paymentStatus`
- SNS Planner-persisted canonical `paymentStatus` or `salesAmount`
- Growth Engine-stored full Communication Planner message bodies as canonical data
- Growth Engine-stored full Velvet professional note bodies as canonical data
- Growth Engine-stored full Velvet professional memory bodies as canonical data
- independent AI usage ledger in application repositories
- independent business lifecycle state in SNS Planner, Communication Planner or Velvet
- AI Platform Core storing Communication Planner conversation history or Velvet professional memory as its canonical business record
- AI Platform Core storing Customer, Reservation, Payment, Sales, SNS PostDraft, SNS MessageDraft, Numeria Report, Communication Conversation/Message, or Velvet Professional Memory as canonical records

## Snapshot Rule

Snapshots are historical/derived records, not canonical data. A snapshot must never be presented as the current source of truth when the canonical owner is another app.

## Privacy Rule for Communication Planner

Communication Planner conversation data is not general platform context.

Other apps must not receive Communication Planner full message bodies, full conversation histories, full ConversationContext bodies, channel access tokens, private channel metadata, or SafetyCheck details beyond operational references unless the user explicitly invokes a contracted feature that requires a minimum scoped subset.

AI Platform Core may receive only the minimum scoped content selected for a user-triggered AI operation. It must not store Communication Planner conversation records as canonical data.

Platform Admin receives operational snapshot fields only, not message bodies or context bodies.

## Privacy Rule for Velvet

Velvet professional memory is not general platform context.

Other apps must not receive Velvet contact details, confidential service notes, conversation histories, gift histories, relationship graphs or raw Capture content unless the user explicitly invokes a contracted feature that requires a minimum scoped subset.

Growth Engine receives reference IDs and summaries where needed, not raw confidential note bodies by default.

## External Intelligence Data Ownership

External Intelligence owns development-support records, not product domain data.

Canonical External Intelligence records:

- Project Snapshot.
- Development Result.
- Experience.
- Evidence.
- Knowledge Observation.
- Pattern candidate.
- Token ledger and development KPI projections.

External Intelligence must not become the canonical owner for Customer, Reservation, Payment, Sales, Revenue, Report, Professional Memory, Communication records, SNS MessageDraft, AI Activity, AI Usage, AI Capability, or other application-owned production records.

Knowledge generated from development results is reusable engineering knowledge. It is not a copy of an application's business data source of truth.
