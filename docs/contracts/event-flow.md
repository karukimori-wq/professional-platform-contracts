# Event Flow

This document defines the approved MVP event and integration flows between apps.

Use this document together with:

- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/app-responsibilities.md`
- `docs/contracts/observability-contract.md`

## Core Rule

APIs perform immediate work. Events record state changes that other apps may react to.

Each flow must preserve canonical ownership:

- Growth Engine owns customers, reservations, payments, sales, public sites, and business workflow state.
- Numeria Studio owns sessions, reports, and domain appraisal output.
- Velvet owns professional visits, professional memory, service notes, and customer-specific professional timelines.
- SNS Planner owns SNS post drafts and simple message drafts.
- AI SNS Growth Office owns AI-company SNS marketing orchestration, campaign route design, content planning, draft production, image concepts, media assets, approval workflow, X media upload jobs, X publish jobs, and marketing performance snapshots.
- Communication Planner owns 1-to-1 conversations, conversation context, reply drafts, and safety checks.
- AI Platform Core owns AI activities and usage tracking.
- Platform Admin observes status and logs. It does not become a business source of truth.

## MVP Flow Summary

| Flow | API Operation | Event Outcome | Status |
| --- | --- | --- | --- |
| Growth Engine to SNS Planner PostDraft | `PostDraft.Generate` | `sns.post_draft.created.v1` | Stable |
| Growth Engine to SNS Planner MessageDraft | `MessageDraft.Generate` | `sns.message_draft.created.v1` | Stable, simple draft only |
| AI SNS Growth Office CEO Instruction | `AISNSCEOInstruction.Create` | `ai_company.ceo_instruction.created.v1` | Stable |
| AI SNS Growth Office Secretary Brief | `AISNSSecretaryBrief.Create` | `ai_company.secretary_brief.created.v1` | Stable |
| AI SNS Growth Office Company / Agent Tasks | `AISNSCompanyTask.Create` / `AISNSAgentTask.Create` | `ai_company.company_task.created.v1` / `ai_company.agent_task.created.v1` | Stable |
| AI SNS Growth Office Approval | `AISNSApproval.Request` / `AISNSApproval.Complete` | `ai_company.approval.requested.v1` / `ai_company.approval.completed.v1` | Stable, three-stage approval |
| AI SNS Growth Office Content and Image Planning | `AISNSContentPlan.Create` / `AISNSContentDraft.Create` / `AISNSImageConcept.Create` | `ai_company.content_plan.created.v1` / `ai_company.content_draft.created.v1` / `ai_company.image_concept.created.v1` | Stable |
| AI SNS Growth Office X Media Upload | `AISNSXMediaUploadJob.Create` | `ai_company.x_media_upload_job.created.v1` | Stable, CEO approval required |
| AI SNS Growth Office X Publish | `AISNSXPublishJob.Create` | `ai_company.x_publish_job.created.v1` | Stable, CEO approval required |
| AI SNS Growth Office Performance Snapshot | `AISNSPerformanceSnapshot.Record` | `ai_company.performance_snapshot.recorded.v1` | Stable |
| Channel to Communication Planner Message Receive | `CommunicationChannelEvent.ReceiveMessage` | `communication.message.received.v1` | Stable |
| Communication Planner ReplyDraft | `CommunicationReplyDraft.Create` | `communication.reply_draft.created.v1` | Stable |
| Communication Planner SafetyCheck | `CommunicationReplySafety.Check` | `communication.reply_safety.checked.v1` | Stable |
| Communication Planner Send | `CommunicationReplyDraft.Send` | `communication.message.sent.v1` | Stable |
| Communication Planner Context Update | `CommunicationContext.Update` | `communication.context.updated.v1` | Stable |
| Communication Planner to AI Platform Core | `Activity.Create` / communication capabilities | `ai.activity.created.v1` | Stable |
| SNS Planner to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable |
| Numeria Studio to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable, Cloudflare Production verified for Numeria persistence baseline |
| Growth Engine to AI Platform Core | `Activity.Create` | `ai.activity.created.v1` | Stable |
| Growth Engine to Numeria Studio | `Session.Start` | `studio.session.started.v1` | Stable |
| Growth Engine to Velvet | `VelvetHandoff.Start` / `VelvetVisit.Start` | `velvet.visit.started.v1` | Stable, Velvet Cloudflare Production verified |
| Velvet Visit Completion | `VelvetVisit.Complete` | `velvet.visit.completed.v1` | Stable, repository D1 coverage continues |
| Velvet Memory Update | `VelvetMemory.Update` | `velvet.memory.updated.v1` | Stable, Customer Memory D1 E2E verified |
| Platform Admin to Apps | Health/status read | None | Stable |

## 1. Growth Engine to SNS Planner PostDraft

Purpose: Growth Engine asks SNS Planner to create a post draft from business intent.

Required API:

- Operation: `PostDraft.Generate`
- Caller: Growth Engine
- Receiver: SNS Planner

Required references:

- `workspaceId`
- `userId`
- `objective`
- `targetAudience`
- `topic`
- `contentType`
- `channel`
- `cta`
- `destinationUrl`

SNS Planner returns:

- `draftId`
- `workspaceId`
- `status`
- `channel`

Event outcome:

- SNS Planner publishes or records `sns.post_draft.created.v1`.

Ownership rules:

- Growth Engine owns the campaign intent and destination.
- SNS Planner owns the post draft.
- SNS Planner must not decide sales strategy, funnel stage, payment state, or customer lifecycle state.

## 2. Growth Engine to SNS Planner MessageDraft

Purpose: Growth Engine asks SNS Planner to create a simple customer communication draft from business intent.

Required API:

- Operation: `MessageDraft.Generate`
- Caller: Growth Engine
- Receiver: SNS Planner

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "targetStudio": "velvet",
  "channel": "line",
  "purpose": "follow_up",
  "audienceSegment": "repeat_candidate",
  "tone": "warm",
  "cta": "book_next_visit",
  "inputRef": {
    "customerId": "customer_test_001",
    "reservationId": "reservation_test_001",
    "followupId": "followup_test_001"
  }
}
```

SNS Planner returns:

- `messageDraftId`
- `messageDraftStatus`
- `workspaceId`
- `channel`
- `purpose`

Event outcome:

- SNS Planner publishes or records `sns.message_draft.created.v1`.

Ownership rules:

- Growth Engine owns the business reason for the communication.
- SNS Planner owns simple message draft state only.
- SNS Planner must not receive customer master records, payment state, sales amount, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts.
- Live conversation context, channel sending, and SafetyCheck belong to Communication Planner.

## 3. AI SNS Growth Office Company Operation Flow

Purpose: The CEO issues a marketing instruction, Secretary AI organizes it, and AI employees execute scoped marketing tasks.

Current implementation status:

- CEO dashboard first screen exists.
- Company task listing endpoint exists at `GET /api/company-tasks`.
- Approval Center UI exists.
- Approval listing endpoint exists at `GET /api/approvals`.
- Approval action endpoints exist at `POST /api/approvals/{approvalId}/approve` and `POST /api/approvals/{approvalId}/revision`.
- API handler tests report 21 passed / 0 failed.
- Current persistence is seed repository plus in-process persistence, not DB-backed durable storage.

Required APIs:

- `AISNSCEOInstruction.Create`
- `AISNSSecretaryBrief.Create`
- `AISNSCompanyTask.Create`
- `AISNSCompanyTask.Complete`
- `AISNSAgentTask.Create`
- `AISNSAgentTask.Complete`
- `AISNSAgentOutput.Create`

Required references:

- `workspaceId`
- `userId`
- `appProjectId`
- `ceoInstructionId`
- `secretaryBriefId`
- `companyTaskId`
- `agentTaskId`
- `agentOutputId`

Event outcomes:

- `ai_company.ceo_instruction.created.v1`
- `ai_company.secretary_brief.created.v1`
- `ai_company.company_task.created.v1`
- `ai_company.company_task.completed.v1`
- `ai_company.agent_task.created.v1`
- `ai_company.agent_task.completed.v1`
- `ai_company.agent_output.created.v1`

Ownership rules:

- AI SNS Growth Office owns company operation records and task execution records.
- CEOInstruction and ApprovalRequest belong to AI SNS Growth Office, not Growth Engine.
- AI Platform Core may record AI Activity and Usage for AI execution, but it does not own company tasks or outputs.
- Platform Admin observes status only.

## 4. AI SNS Growth Office Marketing Route and Content Flow

Purpose: AI SNS Growth Office designs a route from recognition to purchase and produces content and image planning artifacts for an app campaign.

Initial campaign scope:

- First app: Numeria Studio
- Next app: Velvet
- First SNS: X
- Language: Japanese
- Image-attached posts are in MVP scope

Current implementation status:

- App project listing endpoint exists at `GET /api/app-projects`.
- Image Assets UI exists.
- Media asset listing endpoint exists at `GET /api/media-assets`.
- Current content planning and route entities may be represented by seeded MVP state until DB-backed repository persistence is added.

Required APIs:

- `AISNSAppProject.Create`
- `AISNSAudience.Create`
- `AISNSOffer.Create`
- `AISNSMarketingRoute.Create`
- `AISNSDiagnosisReport.Create`
- `AISNSContentPlan.Create`
- `AISNSContentDraft.Create`
- `AISNSImageConcept.Create`
- `AISNSMediaAsset.Create`
- `AISNSPublishPlan.Create`

Required references:

- `workspaceId`
- `userId`
- `appProjectId`
- `targetAppKey`
- `audienceId`
- `offerId`
- `marketingRouteId`
- `routeStageId`
- `contentPlanId`
- `contentDraftId`
- `imageConceptId`
- `mediaAssetId`
- `publishPlanId`

Event outcomes:

- `ai_company.app_project.created.v1`
- `ai_company.audience.created.v1`
- `ai_company.offer.created.v1`
- `ai_company.marketing_route.created.v1`
- `ai_company.diagnosis_report.created.v1`
- `ai_company.content_plan.created.v1`
- `ai_company.content_draft.created.v1`
- `ai_company.image_concept.created.v1`
- `ai_company.media_asset.created.v1`
- `ai_company.publish_plan.created.v1`

Ownership rules:

- AI SNS Growth Office owns route design, content plans, draft content, image concepts, media assets, and publish plans.
- Growth Engine owns the business sales route, customer lifecycle state, reservation state, payment state, and revenue state.
- SNS Planner owns existing SNS PostDraft and MessageDraft records until an explicit future migration contract changes ownership.
- AI SNS Growth Office may produce marketing artifacts for SNS Planner by reference; it must not silently take over SNS Planner canonical draft records.

## 5. AI SNS Growth Office Approval and Publishing Flow

Purpose: AI-generated strategy, drafts, image concepts, media assets, X media upload jobs, and X publish jobs move through CEO approval before public action.

Required approval stages:

1. Strategy Approval: target, appeal, route, campaign policy, image policy.
2. Draft Approval: X posts, threads, image proposals, profile copy, pinned post, DM route.
3. Publish/Schedule Approval: X media upload, X post creation, scheduled publish, manual export.

Current implementation status:

- X Publish Queue UI exists.
- X media upload job endpoints exist at `GET /api/media-upload-jobs` and `POST /api/media-upload-jobs`.
- X publish job endpoints exist at `GET /api/publish-jobs` and `POST /api/publish-jobs`.
- Client-side approval actions exist.

Required APIs:

- `AISNSApproval.Request`
- `AISNSApproval.Complete`
- `AISNSXMediaUploadJob.Create`
- `AISNSXMediaUploadJob.Complete`
- `AISNSXMediaUploadJob.Fail`
- `AISNSXPublishJob.Create`
- `AISNSXPublishJob.Complete`
- `AISNSXPublishJob.Fail`

Event outcomes:

- `ai_company.approval.requested.v1`
- `ai_company.approval.completed.v1`
- `ai_company.x_media_upload_job.created.v1`
- `ai_company.x_media_upload_job.completed.v1`
- `ai_company.x_media_upload_job.failed.v1`
- `ai_company.x_publish_job.created.v1`
- `ai_company.x_publish_job.completed.v1`
- `ai_company.x_publish_job.failed.v1`

Rules:

- AI may create drafts, image concepts, and media assets.
- AI must not perform final X media upload, public posting, scheduling, or manual export without CEO approval.
- X image upload and X post creation are separate jobs.
- `MediaAsset`, `XMediaUploadJob`, and `XPublishJob` must remain separate records.
- Failed jobs must move to `failed` or `manual_required`; approved drafts, media assets, and publish intent must not be deleted because an X upload or publish job failed.

## 6. AI SNS Growth Office to SNS Planner

Purpose: AI SNS Growth Office may hand off approved content requirements or references to SNS Planner while SNS Planner remains canonical for current PostDraft and MessageDraft records.

Allowed handoff references:

- `workspaceId`
- `userId`
- `appProjectId`
- `contentPlanId`
- `contentDraftId`
- `imageConceptId`
- `mediaAssetId`
- `publishPlanId`
- `marketingRouteId`

Ownership rules:

- SNS Planner owns `PostDraft` and `MessageDraft` until an explicit future consolidation contract exists.
- AI SNS Growth Office may eventually absorb SNS Planner functions only after a documented migration of source-of-truth records, event names, APIs, monitoring, rollback, and historical data.
- AI SNS Growth Office must not pass Growth Engine payment state, sales amount, Stripe data, customer master records, full Communication Planner conversation bodies, full Velvet memory, full Report bodies, API keys, access tokens, or secret prompts to SNS Planner.

## 7. AI SNS Growth Office to Communication Planner

Purpose: AI SNS Growth Office may design DM routes or propose message copy, but Communication Planner owns live 1-to-1 conversation execution.

Allowed references:

- `workspaceId`
- `userId`
- `appProjectId`
- `marketingRouteId`
- `routeStageId`
- `contentDraftId`
- `campaignRef`

Ownership rules:

- Communication Planner owns Person, Conversation, Message, ConversationContext, ReplyDraft, SafetyCheck, ReplySendDecision, and ChannelAdapter integration state.
- AI SNS Growth Office must not send live DM replies or bypass Communication Planner SafetyCheck.
- AI SNS Growth Office must not receive full message histories, full ConversationContext bodies, channel tokens, or private provider metadata by default.

## 8. AI SNS Growth Office to AI Platform Core

Purpose: AI SNS Growth Office records AI execution activity and usage while keeping company operation records in AI SNS Growth Office.

Required API:

- Operation: `Activity.Create`
- Caller: AI SNS Growth Office
- Receiver: AI Platform Core

Allowed references:

- `workspaceId`
- `userId`
- `sourceApp: ai-sns-growth-office`
- `capability`
- `inputRef`
- `outputRef`
- `companyTaskId`
- `agentTaskId`
- `agentOutputId`

Event outcome:

- AI Platform Core publishes or records `ai.activity.created.v1`.

Ownership rules:

- AI Platform Core owns AI Activity, AI Usage, and AI Capability.
- AI SNS Growth Office owns CEOInstruction, SecretaryBrief, CompanyTask, AgentTask, AgentOutput, ApprovalRequest, and marketing artifacts.
- AI Platform Core must not receive API keys, access tokens, secret prompts, full customer records, full conversation histories, full professional memory, full report bodies, payment state, or sales amounts.

## 9. AI SNS Growth Office to External Intelligence

Purpose: AI SNS Growth Office references development knowledge, decisions, rules, or evidence recorded in External Intelligence.

Required API:

- `AISNSExternalIntelligence.Reference`

Required references:

- `workspaceId`
- `userId`
- `appProjectId`
- `externalKnowledgeReferenceId`
- `externalRecordRef`
- `sourceDocumentRef`

Event outcome:

- `ai_company.external_intelligence.referenced.v1`

Ownership rules:

- External Intelligence may store development Knowledge, judgments, rules, and evidence.
- External Intelligence must not become operational source of truth for AI SNS Growth Office tasks, approvals, drafts, media assets, publish jobs, performance snapshots, customers, payments, sales, or revenue.

## 10. AI SNS Growth Office Performance Snapshot Flow

Purpose: AI SNS Growth Office records daily SNS marketing performance for diagnosis and route improvement.

Current implementation status:

- Daily Metrics UI exists.
- Performance snapshot listing endpoint exists at `GET /api/performance-snapshots`.
- Metrics are current MVP operational data only until durable persistence is implemented.

Required API:

- `AISNSPerformanceSnapshot.Record`

Metrics:

- `impressions`
- `profile_visits`
- `follows`
- `engagement_count`
- `cta_clicks`
- `landing_page_visits`
- `trial_or_signup_count`
- `purchase_count`
- `revenue`

Event outcome:

- `ai_company.performance_snapshot.recorded.v1`

Rules:

- Missing values are `unknown`, not `0`.
- Growth Engine remains canonical for purchase, payment, sales, and revenue records.
- AI SNS Growth Office may record marketing performance snapshots for route analysis, but it must not become the canonical sales ledger.

## 11. AI SNS Growth Office Monitoring Flow

Purpose: Platform Admin monitors AI SNS Growth Office health, version, and contract status without storing AI SNS Growth Office operational data as canonical records.

Required monitoring endpoints:

- `GET {AI_SNS_GROWTH_OFFICE_BASE_URL}/api/health`
- `GET {AI_SNS_GROWTH_OFFICE_BASE_URL}/api/version`
- `GET {AI_SNS_GROWTH_OFFICE_BASE_URL}/api/contracts/status`

Current implementation status:

- `GET /api/health` exists.
- `GET /api/version` exists.
- `GET /api/contracts/status` exists.

Ownership rules:

- Platform Admin stores operational snapshot only.
- Platform Admin must not store CEOInstruction, SecretaryBrief, CompanyTask, AgentTask, AgentOutput, ApprovalRequest, AppProject, MarketingRoute, ContentDraft, MediaAsset, X job records, or PerformanceSnapshot as canonical data.
- AI SNS Growth Office remains responsible for its own operational records, subject to the current persistence limitation.

## 12. Channel to Communication Planner Message Receive

Purpose: A ChannelAdapter receives an inbound message and Communication Planner links it to a person and conversation.

Required API:

- Operation: `CommunicationChannelEvent.ReceiveMessage`
- Caller: Channel Adapter
- Receiver: Communication Planner

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "channel-adapter",
  "channel": "instagram",
  "externalAccountId": "acct_test_001",
  "externalUserId": "external_user_test_001",
  "externalConversationId": "external_conv_test_001",
  "externalMessageId": "external_msg_test_001",
  "direction": "inbound",
  "contentRef": "message_content_ref_001",
  "receivedAt": "2026-08-15T00:00:00.000Z"
}
```

Communication Planner returns:

- `personId`
- `channelIdentityId`
- `conversationId`
- `messageId`
- `requiresReply`
- `traceId`
- `correlationId`
- `requestId`

Event outcome:

- Communication Planner publishes or records `communication.message.received.v1`.

Ownership rules:

- Communication Planner owns Conversation and Message.
- `contentRef` may point to Communication Planner-owned message content; cross-app events must not include full message bodies.
- Growth Engine Customer may be linked by `customerId`, but Customer master remains Growth Engine.

## 13. Communication Planner Reply and Safety Flow

Purpose: Communication Planner generates or records a reply draft, checks it against person-scoped context, and sends only after safety confirmation.

Required APIs:

- `CommunicationReplyDraft.Create`
- `CommunicationReplySafety.Check`
- `CommunicationReplyDraft.Send`

Required ReplyDraft request shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "personId": "person_test_001",
  "conversationId": "conversation_test_001",
  "channel": "instagram",
  "purpose": "reply",
  "inputRef": {
    "contextId": "context_test_001",
    "messageId": "message_test_001"
  }
}
```

SafetyCheck must verify:

- `workspaceId + personId` context scope
- generated reply evidence references
- unsupported claims
- cross-person risk
- target person and channel before send

Event outcomes:

- `communication.reply_draft.created.v1`
- `communication.reply_safety.checked.v1`
- `communication.message.sent.v1` after approved send

Ownership rules:

- Communication Planner owns ReplyDraft, SafetyCheck and send workflow.
- AI Platform Core may generate candidates or safety assessments, but must not send messages.
- Platform Admin may receive operational status only, not message bodies or full context bodies.

## 14. Communication Planner Context, Promise and NextAction Flow

Purpose: Communication Planner keeps person-centered conversation state current without mixing context between people.

Relevant APIs:

- `CommunicationContext.Update`
- `CommunicationPromise.Create`
- `CommunicationNextAction.Create`

Event outcomes:

- `communication.context.updated.v1`
- `communication.promise.created.v1`
- `communication.next_action.created.v1`

Allowed cross-app references:

- `workspaceId`
- `userId`
- `personId`
- `customerId` where linked
- `conversationId`
- `contextId`
- `topicId`
- `promiseId`
- `nextActionId`
- `messageRef`

Ownership rules:

- Communication Planner owns communication context, topics, promises and communication next actions.
- Growth Engine owns business Follow-up, repeat/referral state and lifecycle decisions.
- A Communication NextAction does not become Growth Engine Follow-up source of truth unless imported or referenced through an explicit contract.

## 15. Communication Planner to AI Platform Core

Purpose: Communication Planner records and uses AI-assisted communication tasks through AI Platform Core.

Required API:

- Operation: `Activity.Create` and communication capabilities
- Caller: Communication Planner
- Receiver: AI Platform Core

Capability candidates:

- `communication.context.summarize`
- `communication.topic.extract`
- `communication.promise.extract`
- `communication.next_action.suggest`
- `communication.reply.generate`
- `communication.reply.safety_check`
- `communication.intent.classify`

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "communication-planner",
  "activityType": "communication.reply.generated",
  "capability": "communication.reply.generate",
  "inputRef": {
    "personId": "person_test_001",
    "conversationId": "conversation_test_001",
    "contextId": "context_test_001",
    "replyDraftId": "reply_draft_test_001"
  }
}
```

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- AI Platform Core owns AI activity and usage only.
- AI Platform Core must not own Conversation, Message, ConversationContext, ReplyDraft, SafetyCheck or send workflow.
- Communication Planner selects minimum scoped input and applies user confirmation before mutation or send.

## 16. SNS Planner to AI Platform Core

Purpose: SNS Planner records AI-assisted draft generation as an AI Activity.

Required API:

- Operation: `Activity.Create`
- Caller: SNS Planner
- Receiver: AI Platform Core

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "sns-planner",
  "activityType": "sns.post_draft.created",
  "capability": "sns.post.generate",
  "inputRef": {
    "draftId": "draft_xxx",
    "channel": "instagram"
  }
}
```

For SNS MessageDraft, `activityType` and `capability` should identify simple message generation, and `inputRef` should contain only `messageDraftId`, `channel`, and other approved reference IDs.

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- AI Platform Core records AI activity and usage only.
- AI Platform Core must not own SNS post drafts, message drafts, or campaign/contact decisions.

## 17. Numeria Studio to AI Platform Core

Purpose: Numeria Studio records AI-assisted report generation as an AI Activity.

Required API:

- Operation: `Activity.Create`
- Caller: Numeria Studio
- Receiver: AI Platform Core

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "numeria-studio",
  "activityType": "studio.report.generated",
  "capability": "studio.report.generate",
  "inputRef": {
    "sessionId": "session_test_001",
    "reportId": "report_test_001",
    "reportType": "numerology"
  }
}
```

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- Use `Report`, not `Document`, for external contract naming.
- Send references only.
- Do not send customer master records, names, emails, birthdays, full appraisal notes, or full meeting transcripts.
- Do not send `paymentStatus`, `salesAmount`, or `campaignCode`.

Production status:

- Numeria Studio now runs on Cloudflare Workers with Static Assets and D1.
- The previous ChatGPT Sites server-side 522 caveat is no longer the current Production baseline for Numeria Studio.
- AI Platform Core remains canonical for AI Activity, Usage, Capability, Prompt, Knowledge, and Workflow records.
- Numeria Studio must send references only and must not create an independent AI ledger.

## 18. Growth Engine to AI Platform Core

Purpose: Growth Engine records AI-assisted business recommendations, follow-up suggestions, or analysis as an AI Activity.

Required API:

- Operation: `Activity.Create`
- Caller: Growth Engine
- Receiver: AI Platform Core

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "activityType": "growth.recommendation.created",
  "capability": "growth.recommendation.generate",
  "inputRef": {
    "recommendationId": "rec_test_001",
    "contextType": "followup",
    "targetType": "customer_segment"
  }
}
```

Event outcome:

- AI Platform Core records `ai.activity.created.v1`.

Ownership rules:

- Growth Engine owns business workflow state.
- AI Platform Core records AI usage only.
- Do not send customer personal information, payment details, sales amount, or `paymentStatus`.

## 18A. Velvet to AI Platform Core

Purpose: Velvet uses AI Platform Core for scoped AI assistance while keeping Professional Memory mutations in Velvet.

Current Cloudflare Production transport:

- `AI_PLATFORM_CORE_SERVICE` Service Binding

Capability candidates:

- `velvet.capture.structure`
- `velvet.search.parse_intent`

Required API:

- Operation: `Activity.Create` and Velvet capabilities
- Caller: Velvet
- Receiver: AI Platform Core

Allowed references:

- `workspaceId`
- `userId`
- `customerId` as a Growth Engine reference
- `memoryId` / `captureId` / `visitId` / `noteId` where Velvet-owned
- `traceId`
- `correlationId`

Ownership rules:

- Velvet owns Professional Memory and confirmed mutations.
- AI Platform Core owns AI Activity, AI Usage, Capability, Prompt, Knowledge, and Runtime.
- Velvet must send minimum scoped context only.
- AI Platform Core must not store Velvet Professional Memory as canonical business data.

## 19. Growth Engine to Numeria Studio

Purpose: Growth Engine starts a Numeria Studio appraisal session from a reservation or customer workflow.

Required API:

- Operation: `Session.Start`
- Caller: Growth Engine
- Receiver: Numeria Studio

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "reservationId": "reservation_test_001",
  "customerRef": {
    "customerId": "customer_test_001"
  },
  "sessionType": "numerology",
  "intent": "start_appraisal_session"
}
```

Numeria Studio returns:

- `sessionId`
- `reportId` when a report is generated in the same flow
- `reportRef` when a report reference is available
- `workspaceId`
- `status`
- `sourceApp`
- `sessionType`

Event outcome:

- Numeria Studio publishes or records `studio.session.started.v1`.

Ownership rules:

- Growth Engine owns the customer and reservation.
- Numeria Studio owns Session, Report, Calculation Result, and Numeria Snapshot.
- `customerId` and `reservationId` are references only.
- Numeria Studio must not store a competing customer master, reservation source of truth, payment state, sales amount, or `paymentStatus`.
- Numeria Studio must not return Report body, Customer information, Payment, Sales, or conversation bodies by default.

## 20. Growth Engine to Velvet

Purpose: Growth Engine starts a Velvet professional visit or handoff from a customer, reservation, or visit schedule workflow.

Required API:

- Operation: `VelvetHandoff.Start` or `VelvetVisit.Start`
- Caller: Growth Engine
- Receiver: Velvet

Required payload shape:

```json
{
  "workspaceId": "ws_test_001",
  "userId": "user_test_owner_001",
  "sourceApp": "growth-engine",
  "customerId": "customer_test_001",
  "reservationId": "reservation_test_001",
  "visitScheduleId": "visit_schedule_test_001",
  "intent": "start_professional_visit"
}
```

Use either `reservationId` or `visitScheduleId` when only one applies.

Velvet returns:

- `visitId`
- `workspaceId`
- `customerId`
- `status`
- optional `summaryRef`
- optional `nextActionRef`

Event outcome:

- Velvet publishes or records `velvet.visit.started.v1`.

Ownership rules:

- Growth Engine owns the customer, reservation, visit schedule, payment, sales, and business workflow state.
- Velvet owns the professional visit, customer-scoped Professional Memory, service notes, Professional Timeline, Professional Recall, and Capture-related Velvet-owned structured information.
- `customerId`, `reservationId`, and `visitScheduleId` are references only. Customer master remains Growth Engine; Customer-scoped Professional Memory remains Velvet.
- Velvet must not create a competing Customer master, Payment source of truth, or Sales source of truth.
- Growth Engine must not copy full Velvet professional notes or full professional memory bodies by default.

## 21. Velvet Visit Completion and Memory Flow

Purpose: Velvet records professional visit outcomes and memory updates while keeping Growth Engine as the source of truth for customer and business data.

Relevant APIs:

- `VelvetVisit.Complete`
- `VelvetMemory.Update`
- `VelvetNote.Create`
- `VelvetTimeline.List`
- `VelvetNextAction.Create`

Event outcomes:

- `velvet.visit.completed.v1`
- `velvet.memory.updated.v1`
- `velvet.note.created.v1`
- `velvet.next_action.created.v1`

Allowed cross-app references:

- `workspaceId`
- `userId`
- `customerId`
- `visitId`
- `reservationId`
- `visitScheduleId`
- `noteId`
- `summaryRef`
- `nextActionRef`
- `lastVisitAt`

Ownership rules:

- Velvet may update its own professional memory and timeline. Customer Memory D1 write/read and workspace/user isolation are Production verified in Cloudflare.
- Velvet may return references and small summaries to Growth Engine when a contracted business workflow needs them.
- Velvet must not return full professional note bodies, full conversation histories, or full professional memory bodies to Growth Engine by default.
- Velvet must not emit payment state, sales amount, Stripe data, customer master records, Communication Planner conversation bodies, SNS MessageDraft bodies, or AI Platform Core activity/usage records in events.

## 22. Platform Admin to Apps

Purpose: Platform Admin checks app health, version, contract status, and MVP connection test results.

Required read endpoints:

- `/health`
- `/version`
- `/contracts/status`
- Platform Admin may also expose `/api/mvp-connection-tests`.

Event outcome:

- None.

Ownership rules:

- Platform Admin stores operational snapshots only.
- Platform Admin must not become the source of truth for customers, reservations, sessions, reports, visits, professional memory, post drafts, message drafts, conversations, messages, reply drafts, safety checks, payments, sales, or AI activities.

## Event Naming Rules

- Event names must be lowercase dotted strings.
- Event names must be past tense.
- Event names must include a version suffix such as `.v1`.
- Stable events must be listed in `docs/contracts/event-catalog.md`.
- Pending events must not be treated as stable app contracts.

## Required Flow Status Values

Platform Admin and integration tests should use these status values:

| Status | Meaning |
| --- | --- |
| `passed` | API call and expected response succeeded |
| `conditional_pass` | Contract and direct receiver behavior passed, but known environment limitation blocked full server-to-server verification |
| `failed` | Contract, endpoint, response, or ownership rule failed |
| `not_run` | Test has not been executed |

## Privacy and Data Minimization

Cross-app flows must send the smallest useful reference set.

Allowed:

- `workspaceId`
- `userId`
- `ownerUserId`
- domain reference IDs such as `customerId`, `reservationId`, `visitScheduleId`, `sessionId`, `reportId`, `visitId`, `noteId`, `summaryRef`, `nextActionRef`, `draftId`, `messageDraftId`, `personId`, `conversationId`, `messageId`, `contextId`, `promiseId`, `replyDraftId`, `safetyCheckId`, `activityId`
- non-sensitive workflow context needed by the receiver

Not allowed unless a future contract explicitly approves it:

- customer master records outside Growth Engine
- payment details outside Growth Engine
- sales amount outside Growth Engine
- `paymentStatus` outside Growth Engine as a source of truth
- Stripe data outside Growth Engine
- full meeting transcript
- full appraisal notes sent to AI Platform Core
- full professional memory bodies outside Velvet
- full professional note bodies outside Velvet
- full Communication Planner message bodies outside Communication Planner
- full Communication Planner ConversationContext bodies outside Communication Planner
- unrelated full conversation histories
- personal identity fields when a reference ID is sufficient
