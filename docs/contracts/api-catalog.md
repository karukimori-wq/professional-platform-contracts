# API Catalog

This catalog lists approved cross-system synchronous operations.

APIs are used when the caller needs an immediate result. State changes that downstream systems should react to must also publish events.

## Growth Engine APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Customer.Create` | Professional Studio, Growth Engine UI | `customerId` | `growth.customer.created.v1` |
| `Customer.Get` | Professional Studio | Customer display profile | None |
| `Customer.Find` | Professional Studio | Customer list | None |
| `Customer.UpdateStatus` | Growth Engine UI | Updated status | Status event |
| `Reservation.Create` | Growth Engine UI | `reservationId` | `growth.reservation.created.v1` |
| `Reservation.Get` | Professional Studio | Reservation reference | None |

## Professional Studio APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Session.Start` | Growth Engine, Studio UI | `sessionId` | `studio.session.started.v1` |
| `Session.Complete` | Studio UI | Completed session | `studio.session.completed.v1` |
| `Report.Generate` | Studio UI | `reportId` or `activityId` | `studio.report.generated.v1` |
| `Report.Preview` | Studio UI | Preview artifact | None |
| `Report.ExportPdf` | Studio UI | PDF artifact | `studio.report.generated.v1` when newly generated |
| `ServiceReference.List` | Growth Engine | Service references | None |

### Numeria Studio HTTP and Cloudflare Production Mapping

Numeria Studio production runtime is Cloudflare Worker API plus Cloudflare Static Assets, not Next.js.

Minimum production readiness endpoints:

| Endpoint | Purpose | Status |
| --- | --- | --- |
| `GET /health` | Worker health | Production verified |
| `GET /version` | App and contract version | Production verified |
| `GET /contracts/status` | Contract status | Production verified |
| `GET /api/persistence/status` | D1 persistence status | Production verified |
| `POST /api/persistence/roundtrip` | D1 write/read roundtrip | Production verified |

Growth Engine to Numeria Studio requests must be reference-first:

- `workspaceId`
- `userId`
- `reservationId`
- `customerId`
- `traceId`
- `correlationId`

Numeria Studio to Growth Engine responses must be reference-first:

- `sessionId`
- `reportId`
- `reportRef`
- `traceId`
- `correlationId`

Numeria Studio APIs must not return Report body, Customer information, Payment, Sales, conversation bodies, full Communication Planner context, SNS draft bodies, AI prompts, API keys, access tokens, or provider secrets by default.

D1 persistence is verified for Session, Report, Numeria persistence status, and roundtrip. Business feature expansion and AI integration enhancement are next product phases.

## Velvet APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `VelvetVisit.Start` | Growth Engine, Velvet UI | `visitId` | `velvet.visit.started.v1` |
| `VelvetVisit.Complete` | Velvet UI | `visitId`, `summaryRef`, `lastVisitAt` | `velvet.visit.completed.v1` |
| `VelvetMemory.Get` | Velvet UI | Customer professional memory projection | None |
| `VelvetMemory.Update` | Velvet UI | `memoryId` | `velvet.memory.updated.v1` |
| `VelvetNote.Create` | Velvet UI | `noteId` | `velvet.note.created.v1` |
| `VelvetTimeline.List` | Velvet UI | Timeline entries | None |
| `VelvetNextAction.Create` | Velvet UI | `nextActionRef` | `velvet.next_action.created.v1` |
| `VelvetHandoff.Start` | Growth Engine | `visitId` or handoff status | `velvet.visit.started.v1` when visit starts |

### Velvet Cloudflare Production Mapping

Velvet production runtime is Next.js 16 + OpenNext Cloudflare on Cloudflare Workers with Cloudflare D1.

Production base URL:

- `https://velvet.karukimori.workers.dev`

Production storage mode:

- `VELVET_STORAGE_MODE=d1`

Production auth mode:

- `VELVET_AUTH_MODE=session`

Minimum production readiness endpoints:

| Endpoint | Purpose | Status |
| --- | --- | --- |
| `GET /health` | Worker health | Production verified |
| `GET /version` | App and contract version | Production verified |
| `GET /contracts/status` | Contract status | Production verified |
| `GET /api/persistence/status` | D1 persistence status | Production verified |
| `POST /api/persistence/roundtrip` | D1 write/read roundtrip | Production verified |

Customer Memory D1 write/read and workspace/user isolation are Production verified. Full D1 Production E2E coverage for Visit, Note, Timeline, Next Action, Capture, and other Professional Memory repositories remains in progress.

Velvet session bridge auth uses:

- `x-velvet-auth-bridge`
- `x-velvet-workspace-id`
- `x-velvet-user-id`
- `x-velvet-owner-user-id`

`VELVET_SESSION_BRIDGE_SECRET` is a Cloudflare Secret and must not be stored in this repository.

Velvet may call AI Platform Core through Cloudflare Service Binding:

- `AI_PLATFORM_CORE_SERVICE`

Representative capabilities:

- `velvet.capture.structure`
- `velvet.search.parse_intent`

AI Platform Core remains canonical for AI Activity, AI Usage, Capability, Prompt, Knowledge, and Workflow.

### Velvet HTTP Mapping

MVP HTTP mapping:
- `POST /api/visits` maps to `VelvetVisit.Start`.
- `PATCH /api/visits/{visitId}` maps to `VelvetVisit.Complete`.
- `GET /api/customers/{customerId}/memory` maps to `VelvetMemory.Get`.
- `PATCH /api/customers/{customerId}/memory` maps to `VelvetMemory.Update`.
- `POST /api/customers/{customerId}/notes` maps to `VelvetNote.Create`.
- `GET /api/customers/{customerId}/timeline` maps to `VelvetTimeline.List`.
- `POST /api/customers/{customerId}/next-actions` maps to `VelvetNextAction.Create`.

Growth Engine to Velvet requests must be reference-first:
- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`
- `traceId`
- `correlationId`

Velvet to Growth Engine responses must be reference-first:
- `visitId`
- `noteId`
- `lastVisitAt`
- `nextActionRef`
- `summaryRef`
- `traceId`
- `correlationId`

Velvet APIs must not receive or return Customer master records, `paymentStatus`, `salesAmount`, Stripe data, Payment records, Sales records, full professional note bodies, full conversation histories, API keys, access tokens, or secret prompts unless a future explicit contract approves a minimum scoped subset.

## Communication Planner APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `CommunicationChannelEvent.ReceiveMessage` | Channel Adapter | `messageId`, `personId`, `conversationId` | `communication.message.received.v1` |
| `CommunicationInbox.List` | Communication Planner UI, Growth Engine by reference where contracted | Inbox rows | None |
| `CommunicationPerson.Get` | Communication Planner UI | Person projection with linked channels | None |
| `CommunicationConversation.List` | Communication Planner UI | Conversation list | None |
| `CommunicationContext.Get` | Communication Planner UI | Conversation context projection | None |
| `CommunicationContext.Update` | Communication Planner, AI-assisted workflow | `contextId` | `communication.context.updated.v1` |
| `CommunicationPromise.Create` | Communication Planner, AI-assisted workflow | `promiseId` | `communication.promise.created.v1` |
| `CommunicationNextAction.Create` | Communication Planner, AI-assisted workflow | `nextActionId` | `communication.next_action.created.v1` |
| `CommunicationReplyDraft.Create` | Communication Planner UI | `replyDraftId` | `communication.reply_draft.created.v1` |
| `CommunicationReplySafety.Check` | Communication Planner UI | `safetyCheckId`, safety status | `communication.reply_safety.checked.v1` |
| `CommunicationReplyDraft.Send` | Communication Planner UI | `messageId`, send status | `communication.message.sent.v1` |
| `CommunicationPersonChannel.Link` | Communication Planner UI | `personId`, `channelIdentityId` | `communication.person_channel.linked.v1` |

### Communication Planner HTTP Mapping

MVP HTTP mapping:
- `POST /api/channel-events/messages` maps to `CommunicationChannelEvent.ReceiveMessage`.
- `GET /api/inbox` maps to `CommunicationInbox.List`.
- `GET /api/persons/{personId}` maps to `CommunicationPerson.Get`.
- `GET /api/persons/{personId}/conversations` maps to `CommunicationConversation.List`.
- `GET /api/persons/{personId}/context` maps to `CommunicationContext.Get`.
- `POST /api/conversations/{conversationId}/reply-drafts` maps to `CommunicationReplyDraft.Create`.
- `POST /api/reply-drafts/{replyDraftId}/safety-check` maps to `CommunicationReplySafety.Check`.
- `POST /api/reply-drafts/{replyDraftId}/send` maps to `CommunicationReplyDraft.Send`.
- `POST /api/persons/{personId}/channel-identities` maps to `CommunicationPersonChannel.Link`.

Communication Planner requests must be scoped and reference-first:
- `workspaceId`
- `userId`
- `personId`
- `conversationId`
- `channelIdentityId`
- `customerId` only as a Growth Engine reference when linked
- `inputRef`
- `traceId`
- `correlationId`

Reply generation must require `personId` and `conversationId`. Context lookup must be limited to `workspaceId + personId`.

`CommunicationReplySafety.Check` must verify that generated reply content is supported by the target person's conversation context. If another person's context is detected, the response should be `warning` or `blocked` according to the safety result.

`CommunicationReplyDraft.Send` must require a successful or explicitly accepted SafetyCheck. Send responses should include:
- top-level `status` using `success`, `warning`, `error`, or `skipped`
- `replyDraftId`
- `messageId`
- `sendStatus`
- `personId`
- `conversationId`
- `channel`
- `eventName: communication.message.sent.v1`
- `traceId`
- `correlationId`
- `requestId`

Communication Planner APIs must not receive or return Customer master records, payment state, sales amounts, Stripe data, full Report bodies, full Velvet professional memory bodies, unrelated full conversation histories, API keys, access tokens, or secret prompts.

## AI SNS Growth Office APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `AISNSCEOInstruction.Create` | CEO UI | `ceoInstructionId` | `ai_company.ceo_instruction.created.v1` |
| `AISNSSecretaryBrief.Create` | Secretary AI, CEO UI | `secretaryBriefId` | `ai_company.secretary_brief.created.v1` |
| `AISNSCompanyTask.Create` | Secretary AI | `companyTaskId` | `ai_company.company_task.created.v1` |
| `AISNSCompanyTask.Complete` | Secretary AI, system workflow | `companyTaskId`, completion status | `ai_company.company_task.completed.v1` |
| `AISNSAgentTask.Create` | Secretary AI | `agentTaskId` | `ai_company.agent_task.created.v1` |
| `AISNSAgentTask.Complete` | AI employee workflow | `agentTaskId`, completion status | `ai_company.agent_task.completed.v1` |
| `AISNSAgentOutput.Create` | AI employee workflow | `agentOutputId` | `ai_company.agent_output.created.v1` |
| `AISNSApproval.Request` | Secretary AI, system workflow | `approvalRequestId` | `ai_company.approval.requested.v1` |
| `AISNSApproval.Complete` | CEO UI | `approvalRequestId`, approval status | `ai_company.approval.completed.v1` |
| `AISNSAppProject.Create` | CEO UI, Secretary AI | `appProjectId` | `ai_company.app_project.created.v1` |
| `AISNSAudience.Create` | Customer Insight AI, CEO UI | `audienceId` | `ai_company.audience.created.v1` |
| `AISNSOffer.Create` | Offer Design AI, CEO UI | `offerId` | `ai_company.offer.created.v1` |
| `AISNSMarketingRoute.Create` | SNS Strategy AI, Funnel Design AI | `marketingRouteId` | `ai_company.marketing_route.created.v1` |
| `AISNSDiagnosisReport.Create` | Analytics AI, Strategy AI | `diagnosisReportId` | `ai_company.diagnosis_report.created.v1` |
| `AISNSContentPlan.Create` | Content Planning AI | `contentPlanId` | `ai_company.content_plan.created.v1` |
| `AISNSContentDraft.Create` | Content Production AI | `contentDraftId` | `ai_company.content_draft.created.v1` |
| `AISNSImageConcept.Create` | Image Direction AI | `imageConceptId` | `ai_company.image_concept.created.v1` |
| `AISNSMediaAsset.Create` | Image Direction AI, CEO UI | `mediaAssetId` | `ai_company.media_asset.created.v1` |
| `AISNSPublishPlan.Create` | Secretary AI, CEO UI | `publishPlanId` | `ai_company.publish_plan.created.v1` |
| `AISNSXMediaUploadJob.Create` | system workflow after CEO approval | `xMediaUploadJobId` | `ai_company.x_media_upload_job.created.v1` |
| `AISNSXMediaUploadJob.Complete` | X integration worker | `xMediaUploadJobId`, media id reference | `ai_company.x_media_upload_job.completed.v1` |
| `AISNSXMediaUploadJob.Fail` | X integration worker | `xMediaUploadJobId`, failure status | `ai_company.x_media_upload_job.failed.v1` |
| `AISNSXPublishJob.Create` | system workflow after CEO approval | `xPublishJobId` | `ai_company.x_publish_job.created.v1` |
| `AISNSXPublishJob.Complete` | X integration worker | `xPublishJobId`, published reference | `ai_company.x_publish_job.completed.v1` |
| `AISNSXPublishJob.Fail` | X integration worker | `xPublishJobId`, failure status | `ai_company.x_publish_job.failed.v1` |
| `AISNSPerformanceSnapshot.Record` | CEO UI, analytics import workflow | `performanceSnapshotId` | `ai_company.performance_snapshot.recorded.v1` |
| `AISNSExternalIntelligence.Reference` | Secretary AI, system workflow | `externalKnowledgeReferenceId` | `ai_company.external_intelligence.referenced.v1` |

### AI SNS Growth Office HTTP Mapping

MVP HTTP mapping candidates:

- `POST /api/ceo/instructions` maps to `AISNSCEOInstruction.Create`.
- `POST /api/secretary/briefs` maps to `AISNSSecretaryBrief.Create`.
- `POST /api/company-tasks` maps to `AISNSCompanyTask.Create`.
- `PATCH /api/company-tasks/{companyTaskId}` maps to `AISNSCompanyTask.Complete` where completion status is applied.
- `POST /api/agent-tasks` maps to `AISNSAgentTask.Create`.
- `PATCH /api/agent-tasks/{agentTaskId}` maps to `AISNSAgentTask.Complete` where completion status is applied.
- `POST /api/agent-outputs` maps to `AISNSAgentOutput.Create`.
- `POST /api/approvals` maps to `AISNSApproval.Request`.
- `PATCH /api/approvals/{approvalRequestId}` maps to `AISNSApproval.Complete`.
- `POST /api/app-projects` maps to `AISNSAppProject.Create`.
- `POST /api/app-projects/{appProjectId}/audiences` maps to `AISNSAudience.Create`.
- `POST /api/app-projects/{appProjectId}/offers` maps to `AISNSOffer.Create`.
- `POST /api/app-projects/{appProjectId}/marketing-routes` maps to `AISNSMarketingRoute.Create`.
- `POST /api/app-projects/{appProjectId}/diagnosis-reports` maps to `AISNSDiagnosisReport.Create`.
- `POST /api/app-projects/{appProjectId}/content-plans` maps to `AISNSContentPlan.Create`.
- `POST /api/app-projects/{appProjectId}/content-drafts` maps to `AISNSContentDraft.Create`.
- `POST /api/app-projects/{appProjectId}/image-concepts` maps to `AISNSImageConcept.Create`.
- `POST /api/app-projects/{appProjectId}/media-assets` maps to `AISNSMediaAsset.Create`.
- `POST /api/app-projects/{appProjectId}/publish-plans` maps to `AISNSPublishPlan.Create`.
- `POST /api/x/media-upload-jobs` maps to `AISNSXMediaUploadJob.Create`.
- `PATCH /api/x/media-upload-jobs/{xMediaUploadJobId}` maps to upload completion/failure state.
- `POST /api/x/publish-jobs` maps to `AISNSXPublishJob.Create`.
- `PATCH /api/x/publish-jobs/{xPublishJobId}` maps to publish completion/failure state.
- `POST /api/app-projects/{appProjectId}/performance-snapshots` maps to `AISNSPerformanceSnapshot.Record`.
- `POST /api/external-knowledge-references` maps to `AISNSExternalIntelligence.Reference`.

Current implemented HTTP surface:

- `GET /api/health` is the current health endpoint for monitoring.
- `GET /api/version` is the current version endpoint for monitoring.
- `GET /api/contracts/status` is the current contract-status endpoint for monitoring.
- `GET /api/company-tasks` lists current company task state.
- `GET /api/approvals` lists current approval requests.
- `POST /api/approvals/{approvalId}/approve` completes an approval with an approved outcome.
- `POST /api/approvals/{approvalId}/revision` completes an approval with a revision-required outcome.
- `GET /api/app-projects` lists marketed app projects.
- `GET /api/media-assets` lists media assets and approval state.
- `GET /api/media-upload-jobs` lists X media upload job preparation state.
- `POST /api/media-upload-jobs` creates an X media upload job after the required approval gate.
- `GET /api/publish-jobs` lists X publish queue state.
- `POST /api/publish-jobs` creates an X publish job after the required approval gate.
- `GET /api/performance-snapshots` lists daily marketing performance snapshots.

Current monitoring endpoints:

- `GET {AI_SNS_GROWTH_OFFICE_BASE_URL}/api/health`
- `GET {AI_SNS_GROWTH_OFFICE_BASE_URL}/api/version`
- `GET {AI_SNS_GROWTH_OFFICE_BASE_URL}/api/contracts/status`

The current implementation uses seed repository plus in-process persistence. These endpoints are valid for MVP skeleton verification, but DB-backed persistence readiness is not yet established.

### AI SNS Growth Office Approval Constraints

AI SNS Growth Office must enforce three approval stages:

1. Strategy Approval: target, appeal, marketing route, campaign policy, image policy.
2. Draft Approval: X posts, threads, image ideas, profile copy, pinned post, DM route.
3. Publish/Schedule Approval: X media upload, X post, scheduled publish, manual export.

Publishing, scheduling, final X media upload, and customer-facing finalization require CEO approval.

X image publishing must keep `MediaAsset`, `XMediaUploadJob`, and `XPublishJob` separate. Failed upload or publish execution must not delete approved drafts, approved images, or schedule intent. Use `failed` or `manual_required`.

Performance snapshot missing metrics must be represented as `unknown`, not `0`.

AI SNS Growth Office APIs must not receive or return Customer master records, payment state, sales amounts, Stripe data, full Communication Planner message bodies, full ConversationContext bodies, full Velvet professional memory bodies, full Report bodies, API keys, access tokens, or secret prompts unless a future explicit contract approves a minimum scoped subset.

## AI Platform Core APIs

Production base URL:

`https://ai-platform-core.karukimori.workers.dev`

Minimum production readiness endpoints:

| Endpoint | Purpose | Status |
| --- | --- | --- |
| `GET /health` | Worker health | Production verified |
| `GET /version` | App and contract version | Production verified |
| `GET /contracts/status` | Contract status | Production verified |
| `GET /api/persistence/status` | D1 persistence status | Production verified |
| `POST /api/persistence/roundtrip` | D1 write/read roundtrip | Production verified |

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Capability.Register` | Product repository | `capabilityId` | None |
| `Activity.Create` | Product runtime | `activityId` | `ai.activity.created.v1` |
| `Activity.Get` | Product runtime | Activity status | None |
| `Usage.List` | Growth Engine, Studio admin, Velvet, Communication Planner | Usage summary / point-accounting state | None |
| `PromptTemplate.Render` | Product runtime | Rendered prompt | None |
| `VelvetCapture.Structure` | Velvet | Structured candidates only; no Velvet mutation | `ai.activity.created.v1` / completion events |
| `VelvetSearch.ParseIntent` | Velvet | Search intent / terms only; no Velvet dataset results | `ai.activity.created.v1` / completion events |
| `CommunicationContext.Summarize` | Communication Planner | Context summary candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationTopic.Extract` | Communication Planner | Topic candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationPromise.Extract` | Communication Planner | Promise candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationNextAction.Suggest` | Communication Planner | Next-action candidates only; no Communication mutation | `ai.activity.created.v1` / completion events |
| `CommunicationReply.Generate` | Communication Planner | Reply draft candidates only; no send | `ai.activity.created.v1` / completion events |
| `CommunicationReply.SafetyCheck` | Communication Planner | Safety assessment only; no send | `ai.activity.created.v1` / completion events |
| `CommunicationIntent.Classify` | Communication Planner | Intent classification only; no Communication mutation | `ai.activity.created.v1` / completion events |

Production D1 persistence has been verified for Activity and Usage. Outcome, Feedback, Prompt Template, Event Store, and Event Dispatcher production E2E remain next hardening work.

The current scoped-read E2E may use `x-client-id`, but this is not the final formal authentication contract.

### Velvet AI contract constraints

`VelvetCapture.Structure`
- Caller: Velvet only.
- Input is limited to the user-triggered raw Capture text plus reference/observability metadata needed for the request.
- Do not send the user's full People dataset, unrelated contact details, payment/receivable data, image library, or unrelated private notes.
- Response returns candidate structured items only. AI Platform Core must not write Velvet canonical Person, Knowledge, Gift, Schedule, Relationship, Visit, or Capture state.
- Velvet performs user confirmation before applying any inferred mutation.

`VelvetSearch.ParseIntent`
- Caller: Velvet only.
- Input is limited to the user-entered search query plus reference/observability metadata.
- Response returns a normalized search intent such as terms/filters; it does not query or return the user's Velvet dataset.
- Velvet executes owner-scoped retrieval locally against Velvet-owned data.

Both operations must preserve or return `traceId`, `correlationId`, and `requestId` according to the shared observability contract. AI usage accounting remains canonical in AI Platform Core.

### Communication Planner AI contract constraints

Communication Planner AI operations are execution-only. They must not write canonical Communication records directly.

Allowed AI input is limited to minimum scoped context selected by Communication Planner:
- `workspaceId`
- `userId`
- `personId`
- `conversationId`
- `contextId`
- relevant message references or short scoped excerpts selected for the operation
- `traceId`
- `correlationId`

Do not send Customer master records, payment state, sales amounts, Stripe data, full unrelated conversation histories, other-person memory, full Report bodies, full Velvet professional memory bodies, API keys, access tokens, or secret prompts.

AI responses return candidates or safety assessments only. Communication Planner owns confirmation, mutation, SafetyCheck records, and final send decisions.

## SNS Planner APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `PostDraft.Generate` | Growth Engine | Draft variants | `sns.post_draft.created.v1` |
| `PostDraft.Rewrite` | Growth Engine | Updated draft | `sns.post_draft.updated.v1` |
| `PostTemplate.List` | Growth Engine | Template list | None |
| `MessageDraft.Generate` | Growth Engine | Simple contact or follow-up message draft | `sns.message_draft.created.v1` |
| `MessageDraft.Rewrite` | Growth Engine | Updated simple contact or follow-up message draft | `sns.message_draft.updated.v1` |
| `PostDraft.Metadata` | Growth Engine, Platform Admin | Post draft capability metadata | None |
| `MessageDraft.Metadata` | Growth Engine, Platform Admin | Message draft capability metadata | None |

### SNS MessageDraft HTTP Mapping

MVP HTTP mapping:
- `POST /api/message-drafts` maps to `MessageDraft.Generate`.
- `GET /api/message-drafts/metadata` maps to `MessageDraft.Metadata`.
- `GET /api/post-drafts/metadata` maps to `PostDraft.Metadata`.

`POST /api/message-drafts` request must be reference-first and minimum necessary:
- `workspaceId`
- `userId`
- `sourceApp`
- `targetStudio`
- `channel`
- `purpose`
- `audienceSegment`
- `tone`
- `cta`
- `inputRef`

Response should include:
- top-level `status` using `success`, `warning`, `error`, or `skipped`
- `messageDraftId`
- `messageDraftStatus`, such as `draft_created`
- `channel`
- `purpose`
- `eventName: sns.message_draft.created.v1`
- `traceId`
- `correlationId`
- `requestId`

SNS `MessageDraft` is limited to simple business-initiated contact or follow-up drafts that do not require live ConversationContext, channel send, or SafetyCheck. Conversation-contextual replies and send safety belong to Communication Planner.

`MessageDraft` must not receive or return Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts.

## Naming Rules

- Use PascalCase dotted operation names.
- Operation names describe commands or queries, not HTTP routes.
- Product repositories may map these operations to HTTP, RPC, server actions, or SDK methods.
- Cross-system API names must remain stable even if transport changes.

## External Intelligence Development Support API

External Intelligence exposes development-support APIs and MCP-equivalent access for Token-First context and result recording.

Canonical development result write path:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/development/results` | Record a completed development result and allow successful outcomes to become Experience, Evidence, Knowledge Observation, and Pattern candidates. |

Contract rules:

- Successful results may generate reusable Knowledge.
- Failed results may be stored as Experience but must not be automatically promoted as successful Knowledge.
- Context retrieval must prefer compact snapshots and compact knowledge.
- Default Knowledge retrieval limit is 2.
- Default context budget is 4000 characters.
- Repository HEAD cache may skip Knowledge search when HEAD has not changed.
- HTTP and MCP access must follow the same Token-First policy.

External Intelligence APIs are for development workflow support. They are not runtime product APIs for customer-facing application behavior.
