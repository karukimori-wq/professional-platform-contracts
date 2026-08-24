# AI SNS Growth Office Repository Contract

AI SNS Growth Office is the AI-agent-operated SNS marketing company app in the Professional Platform family.

The owner acts as CEO. Secretary AI structures CEO instructions, assigns work to AI employees/departments, and returns decision-ready outputs. The product designs the route from SNS attention to purchase, not isolated SNS posts.

Repository:

- `https://github.com/karukimori-wq/ai-sns-growth-office`

Latest requirement source:

- `docs/ai-sns-growth-office-requirements-v1.3.md`
- `docs/external-intelligence-record-ai-sns-growth-office-2026-08-24-v1.3.md`

## Role

AI SNS Growth Office owns AI-company marketing operations for app promotion.

Initial scope:

- owner-only use
- marketing the owner's own apps
- first campaign target: Numeria Studio
- second campaign target: Velvet
- first channel: X
- Japanese-only posts
- image-based X posts included in MVP
- daily metric entry where possible
- later expansion to fortune tellers, customer support, and SaaS

## Required Contracts

This repository must follow:

- `docs/contracts/api-catalog.md`
- `docs/contracts/event-catalog.md`
- `docs/contracts/event-flow.md`
- `docs/contracts/data-ownership.md`
- `docs/contracts/app-responsibilities.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/observability-contract.md`

## Canonical Ownership

AI SNS Growth Office owns:

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

AI SNS Growth Office does not own:

- Customer master
- Lead lifecycle
- Reservation / Visit Schedule
- Payment
- Sales / Revenue
- SNS Planner PostDraft / MessageDraft until an explicit migration contract is approved
- Communication Planner Conversation / Message / ConversationContext / ReplyDraft / SafetyCheck
- AI Activity / Usage / Capability
- Platform Admin operational snapshots
- External Intelligence development knowledge records

## Approval Model

AI SNS Growth Office requires three approval stages.

| Stage | Scope | Examples |
| --- | --- | --- |
| Strategy Approval | Direction before production | target, offer angle, marketing route, campaign policy, image policy |
| Draft Approval | Generated content/assets before release preparation | X posts, threads, image ideas, profile copy, pinned post, DM route |
| Publish/Schedule Approval | Final customer-facing action | X media upload, X post, scheduled publish, manual export |

Rules:

- AI may create strategy proposals, drafts, image concepts, and image assets.
- AI must not publish, schedule, upload final media to X, or mark customer-facing output final without CEO approval.
- Publish/Schedule Approval may create `XMediaUploadJob` and `XPublishJob`.
- Failed X jobs must not delete approved drafts, approved images, or schedule intent.
- Failed execution must be marked `failed` or `manual_required`.

## X Media and Publishing Rule

Image-based X posting has separate source-of-truth records:

- `MediaAsset`: internal asset and provenance
- `XMediaUploadJob`: X media upload execution state
- `XPublishJob`: final post or schedule execution state

X media upload and X post creation must not be collapsed into one record.

## Daily Metrics Rule

MVP daily performance snapshots may include:

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

## Existing App Boundaries

- Growth Engine owns sales route, campaigns, booking, customer development, payments, and sales state.
- SNS Planner currently owns SNS PostDraft and simple MessageDraft. AI SNS Growth Office may absorb these functions only after an explicit future migration contract.
- Communication Planner owns DM, 1-to-1 conversation context, mis-send prevention, reply safety, and channel send workflow.
- AI Platform Core owns AI execution, AI Activity, Usage, and Capability.
- Platform Admin owns cross-app operational monitoring only.
- External Intelligence owns development knowledge, decisions, rules, and evidence. It is not an operational source of truth.
- professional-platform-contracts owns responsibility, API, event, and boundary definitions.

## Required MVP Endpoints

Minimum public/status endpoints:

- `GET /health`
- `GET /version`
- `GET /contracts/status`

Minimum product API candidates:

- `POST /api/ceo/instructions`
- `POST /api/secretary/briefs`
- `POST /api/company-tasks`
- `POST /api/agent-tasks`
- `POST /api/agent-outputs`
- `POST /api/approvals`
- `PATCH /api/approvals/{approvalRequestId}`
- `POST /api/app-projects`
- `POST /api/app-projects/{appProjectId}/diagnosis-reports`
- `POST /api/app-projects/{appProjectId}/marketing-routes`
- `POST /api/app-projects/{appProjectId}/content-plans`
- `POST /api/app-projects/{appProjectId}/content-drafts`
- `POST /api/app-projects/{appProjectId}/image-concepts`
- `POST /api/app-projects/{appProjectId}/media-assets`
- `POST /api/app-projects/{appProjectId}/publish-plans`
- `POST /api/x/media-upload-jobs`
- `POST /api/x/publish-jobs`
- `POST /api/app-projects/{appProjectId}/performance-snapshots`
- `POST /api/intelligence/search`
- `POST /api/intelligence/experience-records`

## Required Stable Events

- `ai_company.ceo_instruction.created.v1`
- `ai_company.secretary_brief.created.v1`
- `ai_company.company_task.created.v1`
- `ai_company.company_task.completed.v1`
- `ai_company.agent_task.created.v1`
- `ai_company.agent_task.completed.v1`
- `ai_company.agent_output.created.v1`
- `ai_company.approval.requested.v1`
- `ai_company.approval.completed.v1`
- `ai_company.app_project.created.v1`
- `ai_company.offer.created.v1`
- `ai_company.audience.created.v1`
- `ai_company.marketing_route.created.v1`
- `ai_company.content_plan.created.v1`
- `ai_company.content_draft.created.v1`
- `ai_company.image_concept.created.v1`
- `ai_company.media_asset.created.v1`
- `ai_company.publish_plan.created.v1`
- `ai_company.x_media_upload_job.created.v1`
- `ai_company.x_media_upload_job.completed.v1`
- `ai_company.x_media_upload_job.failed.v1`
- `ai_company.x_publish_job.created.v1`
- `ai_company.x_publish_job.completed.v1`
- `ai_company.x_publish_job.failed.v1`
- `ai_company.performance_snapshot.recorded.v1`
- `ai_company.diagnosis_report.created.v1`
- `ai_company.external_intelligence.referenced.v1`

## Data Minimization

Cross-app integrations must be reference-first.

Allowed by default:

- `workspaceId`
- `userId`
- `appProjectId`
- `campaignId` where defined
- `contentPlanId`
- `contentDraftId`
- `mediaAssetId`
- `publishPlanId`
- `xMediaUploadJobId`
- `xPublishJobId`
- `approvalRequestId`
- `traceId`
- `correlationId`

Not allowed by default:

- Customer master records outside Growth Engine
- `paymentStatus`
- `salesAmount`
- Stripe data
- Communication Planner full messages or full ConversationContext
- Velvet full professional memory or note bodies
- Numeria Report bodies
- API keys, access tokens, or secret prompts

## MVP Readiness

AI SNS Growth Office is MVP-ready when:

- CEO can create an instruction for Numeria Studio marketing.
- Secretary AI can create a structured brief.
- CompanyTask and AgentTask are separate.
- The dashboard shows company progress, agent progress, and approval queue.
- The system creates a Numeria Studio route diagnosis.
- The system creates a 30-day Japanese X route plan.
- The system creates Japanese X drafts with image concepts/assets.
- Three-stage CEO approval blocks publishing, scheduling, and final X media upload.
- Image upload and X publishing jobs are separate.
- Failed jobs preserve approved drafts, images, and schedule intent.
- Daily metrics can be recorded with missing values as `unknown`.
- External Intelligence references and final decisions are recorded without making External Intelligence operational source of truth.
