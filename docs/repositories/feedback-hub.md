# Feedback Hub

Feedback Hub is the user-voice intelligence system for the professional platform.

It is not a generic inquiry-management app and it is not a development-management app. Incoming questions, bugs, and improvement requests are the entry point. The core responsibility is to help AI understand user voice and transform it into product-improvement intelligence that can support development decisions.

Repository: `karukimori-wq/feedback-hub`

## Status

- Platform role: user voice intake, AI analysis, issue clustering, priority intelligence, and emergency signal detection.
- MVP state: formal platform application.
- Production: TBD.
- Durable persistence target: Cloudflare D1 for MVP.
- AI dependency: AI Platform Core.
- Runtime source-of-truth boundary: Feedback Hub owns feedback records only.

## Purpose

Feedback Hub receives user questions, bugs, UX feedback, improvement requests, and feature requests from entry points embedded in platform applications.

Core transformation:

User question / bug / improvement request -> AI understanding -> classification -> similar feedback grouping -> severity/count/impact priority proposal -> development-ready Issue.

Feedback Hub helps decide what should be developed. It does not manage the development execution itself.

## Owns

Feedback Hub is the source of truth for:

- Feedback Conversation.
- Feedback Message.
- Feedback AI Analysis.
- Feedback Issue.
- Similarity and duplicate grouping result.
- Impact assessment.
- Feedback priority score.
- Feedback ranking views.
- Feedback emergency notification state.
- Intake metadata sent by client applications.

## Does Not Own

Feedback Hub must not become the source of truth for:

- Customer master.
- Lead lifecycle.
- Reservation.
- Payment.
- Sales / revenue.
- SNS PostDraft or MessageDraft.
- Communication Planner canonical Conversation, Message, ConversationContext, ReplyDraft, or SafetyCheck.
- Numeria Studio Session, Report, Calculation Result, or Numeria Snapshot.
- Velvet Professional Memory, Visit, Note, Timeline, Recall, or Next Action.
- AI Platform Core Activity, Usage, Capability, Prompt, Knowledge, or runtime AI ownership.
- Engineering task management.
- Sprint management.
- Pull request management.
- GitHub issue source of truth.

## Application Responsibility Split

Client applications own the embedded user-facing UI.

Client application responsibilities:

- Show the `Question / Improvement` or equivalent entry button.
- Render the chat UI or embedded feedback UI.
- Capture current screen context.
- Send `appId`, `workspaceId`, `userId`, `route`, `screenName`, `appVersion`, device/browser metadata, and the initial message.
- Display the first response or submission state to the user.

Feedback Hub responsibilities:

- Provide common intake APIs.
- Persist received feedback data.
- Use AI Platform Core for AI understanding.
- Classify, summarize, cluster, and prioritize feedback.
- Calculate impact and priority score.
- Display rankings and management screens.
- Trigger emergency notification signals for critical bugs or fast-rising duplicate reports.

UI body belongs to each app. Understanding, aggregation, analysis, and ranking belong to Feedback Hub.

## AI Usage

Feedback Hub uses AI Platform Core for AI processing.

AI Platform Core provides or mediates:

- App-specific Knowledge reference.
- First response assistance.
- Classification.
- Summarization.
- Similarity detection.
- Impact assessment.
- Priority assistance.

Feedback Hub is a client of AI Platform Core. AI Platform Core remains the runtime AI foundation and must not be turned into a product command center.

Feedback Hub must not be designed around direct OpenAI API calls or separate AI service calls unless the platform contract is explicitly changed.

## Data Model

Feedback Hub handles feedback in four stages:

Conversation -> Message -> AI Analysis -> Issue.

### Conversation

Conversation is the inquiry-level feedback thread.

Typical fields:

- `conversationId`
- `appId`
- `appName`
- `workspaceId`
- `userId`
- `route`
- `screenName`
- `appVersion`
- `device`
- `browser`
- `occurredAt`
- `status`

### Message

Message is a user, AI, or system utterance inside a Conversation.

Typical fields:

- `messageId`
- `conversationId`
- `role`
- `content`
- `createdAt`

### AI Analysis

AI Analysis is the AI interpretation result for a Conversation.

Typical fields:

- `analysisId`
- `conversationId`
- `category`
- `summary`
- `impact`
- `urgency`
- `confidence`
- `similarIssueCandidate`
- `requiredFollowUpQuestions`

Canonical categories:

- Question.
- Bug.
- Improvement.
- Feature Request.
- UX Feedback.
- Other.

### Issue

Issue is the canonical grouped unit for similar feedback.

Typical fields:

- `issueId`
- `title`
- `category`
- `status`
- `severity`
- `impact`
- `count`
- `priorityScore`
- `sourceConversationIds`
- `aiSummary`
- `latestReceivedAt`

## Priority Calculation

Priority must not be based on count alone.

Baseline formula:

`priorityScore = severity * count * impact`

Impact is AI-assisted and reviewed through Feedback Hub management views.

Examples:

| User signal | Expected treatment |
| --- | --- |
| Cannot log in | Critical |
| Cannot pay | Critical / high business impact |
| Cannot save | High |
| Button location is unclear | Low / UX Feedback |

Low-count critical bugs must still surface quickly.

## Similar Feedback Grouping

Feedback Hub's core value is merging similar user voice into a single Issue while preserving all source messages.

Examples that may map to one Issue:

- Cannot save.
- Data is not saved.
- Data disappears after refresh.
- Registration fails.

Canonical Issue example: "Save operation failure".

Original Conversations and Messages must be retained. AI summaries must not replace or erase the original user text.

## Rankings

Feedback Hub management screens should provide at least:

- Bug TOP10.
- Request / Improvement TOP20.
- Question TOP20.

Rankings should be based on severity, count, impact, and recency where appropriate.

## Emergency Notification

Feedback Hub may trigger emergency notification signals for:

- Critical Bug.
- Login failure.
- Payment failure.
- Save failure.
- Rapid increase of same or similar bug reports.

Emergency notification means surfacing an operational signal. It does not mean Feedback Hub owns development task execution.

## Planned APIs

Client applications use common Feedback Hub intake APIs.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/embed/config?appId=...` | Get app-specific embed configuration. |
| POST | `/api/embed/feedback` | Receive feedback from embedded UI. |
| POST | `/api/feedback/intake` | Canonical feedback intake endpoint. |

Baseline payload:

```json
{
  "appId": "numeria-studio",
  "appName": "Numeria Studio",
  "workspaceId": "ws_xxx",
  "userId": "user_xxx",
  "initialMessage": "保存できません",
  "route": "/sessions/123",
  "screenName": "鑑定詳細",
  "appVersion": "0.1.0",
  "device": "mobile",
  "browser": "Safari",
  "occurredAt": "2026-08-31T00:00:00.000Z"
}
```

## Integration Targets

Initial client applications:

- Numeria Studio.
- Velvet.
- SNS Planner.
- Communication Planner.
- Growth Engine.
- Future platform products.

## Development Boundary

Feedback Hub can produce development-ready Issue intelligence, but it does not own:

- Task assignment.
- Development progress tracking.
- Pull request management.
- Implementation management.
- Release management.

Those remain human/operator workflow or future dedicated development-management tooling.
