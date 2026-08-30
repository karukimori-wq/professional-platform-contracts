# Event Catalog

This catalog lists approved cross-system events.

Events are state-change notifications. They must be versioned and past tense.

## Growth Engine Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `growth.customer.created.v1` | Growth Engine | Professional Studio, AI Platform Core | A canonical customer was created |
| `growth.customer.updated.v1` | Growth Engine | Professional Studio | Canonical customer display or contact metadata changed |
| `growth.lead.converted.v1` | Growth Engine | Professional Studio, AI Platform Core | A lead became a client or booked customer |
| `growth.reservation.created.v1` | Growth Engine | Professional Studio | A reservation was created |
| `growth.reservation.cancelled.v1` | Growth Engine | Professional Studio | A reservation was cancelled |

## Professional Studio Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `studio.session.started.v1` | Professional Studio | Growth Engine, AI Platform Core | A professional work session started |
| `studio.session.completed.v1` | Professional Studio | Growth Engine, AI Platform Core | A professional work session completed |
| `studio.report.generated.v1` | Professional Studio | Growth Engine, AI Platform Core | A report was generated |
| `studio.service_reference.updated.v1` | Professional Studio | Growth Engine | A sellable service reference changed |

### Professional Studio Event Constraints

Numeria Studio stable events are:

- `studio.session.started.v1`
- `studio.session.completed.v1`
- `studio.report.generated.v1`

Legacy Numeria or report event names must not be used.

Allowed cross-app payload is reference-first:

- `workspaceId`
- `userId`
- `sessionId`
- `reportId`
- `reportRef`
- `customerId` only as a Growth Engine reference where contracted
- `reservationId` only as a Growth Engine reference where contracted
- `traceId`
- `correlationId`
- `eventId`

Numeria Studio events must not include Report body, Customer master records, Payment, Sales, conversation bodies, Communication Planner context, SNS draft bodies, AI prompts, API keys, access tokens, or provider secrets by default.

## Velvet Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `velvet.visit.started.v1` | Velvet | Growth Engine | A professional visit record was started |
| `velvet.visit.completed.v1` | Velvet | Growth Engine | A professional visit record was completed |
| `velvet.memory.updated.v1` | Velvet | Velvet, Growth Engine by reference only | Customer professional memory was updated |
| `velvet.note.created.v1` | Velvet | Velvet | A professional note was created |
| `velvet.next_action.created.v1` | Velvet | Growth Engine | A next action reference was created |

### Velvet Event Constraints

Velvet events are stable contracts for professional-memory and visit-record workflows.

Current Velvet Cloudflare Production baseline keeps these event names unchanged. Legacy Velvet event names must not be introduced.

Allowed cross-app payload is reference-first:
- `workspaceId`
- `userId`
- `customerId`
- `visitId`
- `reservationId` or `visitScheduleId`
- `noteId`
- `summaryRef`
- `nextActionRef`
- `lastVisitAt`
- `traceId`
- `correlationId`
- `eventId`

Velvet events must not include Customer master records, `paymentStatus`, `salesAmount`, Stripe data, Payment records, Sales records, full professional note bodies, full conversation histories, API keys, access tokens, or secret prompts unless a future explicit contract approves a minimum scoped subset.

## Communication Planner Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `communication.message.received.v1` | Communication Planner | Growth Engine, Platform Admin by operational reference | A channel message was received and linked to a person/conversation |
| `communication.message.sent.v1` | Communication Planner | Growth Engine, Platform Admin by operational reference | A user-approved reply was sent through a channel adapter |
| `communication.context.updated.v1` | Communication Planner | Communication Planner, AI Platform Core by activity reference | A conversation context projection was updated |
| `communication.promise.created.v1` | Communication Planner | Growth Engine by reference where contracted | A communication promise was created from conversation context |
| `communication.next_action.created.v1` | Communication Planner | Growth Engine by reference where contracted | A communication next action was created |
| `communication.reply_draft.created.v1` | Communication Planner | Communication Planner, Platform Admin by operational reference | A conversation-contextual reply draft was created |
| `communication.reply_safety.checked.v1` | Communication Planner | Communication Planner, Platform Admin by operational reference | A reply safety check was completed |
| `communication.person_channel.linked.v1` | Communication Planner | Growth Engine by reference where customer linkage exists | A channel identity was linked to a communication person |

### Communication Planner Event Constraints

Communication Planner events are stable contracts for 1-to-1 conversation, reply, and safety workflows.

Allowed cross-app payload is reference-first:
- `workspaceId`
- `userId`
- `personId`
- `customerId` only as a Growth Engine reference when linked
- `conversationId`
- `channelIdentityId`
- `messageId`
- `contextId`
- `topicId`
- `promiseId`
- `nextActionId`
- `replyDraftId`
- `safetyCheckId`
- `channel`
- `safetyStatus`
- `traceId`
- `correlationId`
- `eventId`

Communication Planner events must not include Customer master records, payment state, sales amounts, Stripe data, full message bodies, full conversation histories, full ConversationContext bodies, full Velvet professional memory bodies, full Report bodies, API keys, access tokens, or secret prompts.

`communication.message.sent.v1` must be emitted only after SafetyCheck is completed or explicitly accepted by the user according to the send contract.

## AI SNS Growth Office Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `ai_company.ceo_instruction.created.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | A CEO instruction was created |
| `ai_company.secretary_brief.created.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | A Secretary AI brief was created |
| `ai_company.company_task.created.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | A company-level task was created |
| `ai_company.company_task.completed.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | A company-level task was completed |
| `ai_company.agent_task.created.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | An AI employee task was created |
| `ai_company.agent_task.completed.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | An AI employee task was completed |
| `ai_company.agent_output.created.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | An AI employee output was created |
| `ai_company.approval.requested.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | CEO approval was requested |
| `ai_company.approval.completed.v1` | AI SNS Growth Office | AI SNS Growth Office, Platform Admin | CEO approval was completed |
| `ai_company.app_project.created.v1` | AI SNS Growth Office | Growth Engine by reference where contracted, Platform Admin | A marketed app project was created |
| `ai_company.offer.created.v1` | AI SNS Growth Office | Growth Engine by reference where contracted, Platform Admin | A marketing offer was created |
| `ai_company.audience.created.v1` | AI SNS Growth Office | Growth Engine by reference where contracted, Platform Admin | A target audience was created |
| `ai_company.marketing_route.created.v1` | AI SNS Growth Office | Growth Engine by reference where contracted, Platform Admin | A marketing route was created |
| `ai_company.content_plan.created.v1` | AI SNS Growth Office | SNS Planner by reference where contracted, Platform Admin | A content plan was created |
| `ai_company.content_draft.created.v1` | AI SNS Growth Office | SNS Planner by reference where contracted, Platform Admin | A content draft was created |
| `ai_company.image_concept.created.v1` | AI SNS Growth Office | SNS Planner by reference where contracted, Platform Admin | An image concept was created |
| `ai_company.media_asset.created.v1` | AI SNS Growth Office | SNS Planner by reference where contracted, Platform Admin | A media asset was created |
| `ai_company.publish_plan.created.v1` | AI SNS Growth Office | SNS Planner by reference where contracted, Platform Admin | A publish plan was created |
| `ai_company.x_media_upload_job.created.v1` | AI SNS Growth Office | Platform Admin | An X media upload job was created after CEO approval |
| `ai_company.x_media_upload_job.completed.v1` | AI SNS Growth Office | Platform Admin | An X media upload job completed |
| `ai_company.x_media_upload_job.failed.v1` | AI SNS Growth Office | Platform Admin | An X media upload job failed |
| `ai_company.x_publish_job.created.v1` | AI SNS Growth Office | Platform Admin | An X publish job was created after CEO approval |
| `ai_company.x_publish_job.completed.v1` | AI SNS Growth Office | Platform Admin | An X publish job completed |
| `ai_company.x_publish_job.failed.v1` | AI SNS Growth Office | Platform Admin | An X publish job failed |
| `ai_company.performance_snapshot.recorded.v1` | AI SNS Growth Office | Growth Engine by summary/reference where contracted, Platform Admin | A daily SNS marketing performance snapshot was recorded |
| `ai_company.diagnosis_report.created.v1` | AI SNS Growth Office | Growth Engine by reference where contracted, Platform Admin | A route or funnel diagnosis report was created |
| `ai_company.external_intelligence.referenced.v1` | AI SNS Growth Office | External Intelligence by referenced record, Platform Admin | External Intelligence knowledge was referenced |

### AI SNS Growth Office Event Constraints

AI SNS Growth Office events are stable contracts for AI-company SNS marketing orchestration.

Current implementation status:

- API handler tests for the current AI SNS Growth Office implementation report 21 passed / 0 failed.
- Event contracts are stable, but production event persistence must remain pending until DB-backed repository persistence is implemented and verified.
- Current seed/in-process state is suitable for MVP skeleton verification only.

Allowed cross-app payload is reference-first:
- `workspaceId`
- `userId`
- `ceoInstructionId`
- `secretaryBriefId`
- `companyTaskId`
- `agentTaskId`
- `agentOutputId`
- `approvalRequestId`
- `appProjectId`
- `marketingRouteId`
- `routeStageId`
- `audienceId`
- `offerId`
- `diagnosisReportId`
- `contentPlanId`
- `contentDraftId`
- `imageConceptId`
- `mediaAssetId`
- `publishPlanId`
- `xMediaUploadJobId`
- `xPublishJobId`
- `performanceSnapshotId`
- `externalKnowledgeReferenceId`
- `approvalStage`
- `channel`
- `status`
- `traceId`
- `correlationId`
- `eventId`

AI SNS Growth Office events must not include Customer master records, payment state, sales amounts, Stripe data, full Communication Planner message bodies, full ConversationContext bodies, full Velvet professional memory bodies, full Report bodies, API keys, access tokens, or secret prompts.

X image publishing events must keep `MediaAsset`, `XMediaUploadJob`, and `XPublishJob` distinct. Failed upload or publish jobs must preserve approved drafts, approved image assets, and schedule intent by marking execution as `failed` or `manual_required`.

Performance snapshot events must treat missing metrics as `unknown`, not `0`.

## AI Platform Core Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `ai.activity.created.v1` | AI Platform Core | Calling app, Growth Engine | AI activity was accepted |
| `ai.activity.completed.v1` | AI Platform Core | Calling app, Growth Engine | AI activity completed |
| `ai.activity.failed.v1` | AI Platform Core | Calling app | AI activity failed |
| `ai.usage.recorded.v1` | AI Platform Core | Growth Engine | AI usage was recorded |

### AI Platform Core Event Readiness

AI Platform Core now runs on Cloudflare Workers + D1 in production.

Production D1 persistence has been verified for Activity and Usage. Event Store / Event Dispatcher production persistence and observability hardening remain next work; do not mark all AI event infrastructure complete solely from Activity and Usage E2E.

## SNS Planner Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `sns.post_draft.created.v1` | SNS Planner | Growth Engine | A post draft was created |
| `sns.post_draft.updated.v1` | SNS Planner | Growth Engine | A post draft was updated |
| `sns.message_draft.created.v1` | SNS Planner | Growth Engine | A simple contact or follow-up message draft was created |
| `sns.message_draft.updated.v1` | SNS Planner | Growth Engine | A simple contact or follow-up message draft was updated |

### SNS MessageDraft Event Constraints

MessageDraft events are stable contracts for simple business-initiated contact draft creation and update flows. They do not cover live conversation reply, channel send, or safety-check workflows; those belong to Communication Planner.

Allowed event payload is reference-first:
- `workspaceId`
- `userId`
- `messageDraftId`
- `channel`
- `purpose`
- `targetStudio`
- `inputRef`
- `traceId`
- `correlationId`
- `eventId`

MessageDraft events must not include Customer master records, payment state, sales amounts, Stripe data, full professional notes, full report bodies, full conversation histories, API keys, access tokens, or secret prompts.

## Pending Events

These events are expected but not yet approved as stable contracts.

| Event | Reason |
| --- | --- |
| `growth.campaign.created.v1` | Campaign model is not finalized |
| `growth.nurture_action.created.v1` | Nurturing workflow model is not finalized |
| `studio.recommendation.created.v1` | Recommendation payload requires privacy review |

## External Intelligence Development Records

External Intelligence development records are not product domain events.

The current development-support baseline records:

- Development Result.
- Experience.
- Evidence.
- Knowledge Observation.
- Pattern candidate.
- Project Snapshot update.
- Token ledger entry.

Do not introduce application runtime event ownership into External Intelligence. Product events remain in their owning app and event contracts.
