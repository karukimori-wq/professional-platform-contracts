# Feedback Hub

Feedback Hub is the user-voice intelligence system for the professional platform.

It is not a general development-management app. Incoming questions, bugs, and improvement requests are only the entry point. The core responsibility is to understand what users are struggling with and transform raw user voice into product-improvement intelligence.

## Status

- Repository: TBD
- Production: TBD
- Platform role: user voice intake, AI analysis, issue clustering, and priority intelligence
- MVP state: requirements definition
- Durable persistence target: Cloudflare D1 for MVP

## Purpose

Feedback Hub receives questions, bugs, UX feedback, improvement requests, and feature requests from shared UI entry points embedded in apps such as Numeria Studio, Velvet, SNS Planner, and Communication Planner.

The system should:

- answer simple questions using app-specific knowledge when possible
- create a support/intake record when AI cannot confidently answer
- preserve original conversations and messages
- classify the user voice
- detect similar or duplicate feedback
- merge similar feedback into canonical issues
- calculate priority using severity, count, and impact
- surface rankings and urgent signals to the owner

## Owns

Feedback Hub is the source of truth for:

- Feedback Conversation
- Feedback Message
- Feedback AI Analysis
- Feedback Issue
- Similarity / duplicate grouping result
- Impact assessment
- Feedback priority score
- Feedback ranking views
- Feedback emergency notification state
- Intake metadata attached by client apps

## Does Not Own

Feedback Hub must not become the source of truth for:

- Customer master
- Lead lifecycle
- Reservation
- Payment
- Sales / revenue
- SNS PostDraft
- Communication Planner one-to-one conversation truth
- Numeria report truth
- Velvet professional memory
- AI usage accounting
- Engineering task management
- Sprint management
- GitHub issue source of truth

Feedback Hub may generate product-improvement intelligence that humans or other systems use to start development, but it does not manage development execution.

## Core Flow

1. User opens the shared `Question / Improvement` UI from a client app.
2. Feedback Hub starts a Conversation with client-provided metadata.
3. AI attempts a first answer using app-specific knowledge.
4. If the AI cannot answer confidently, the conversation becomes an intake.
5. AI asks follow-up questions only when needed.
6. AI creates an analysis record.
7. The analysis is linked to an existing Issue or creates a new canonical Issue.
8. Rankings and urgent notification rules are recalculated.

## MVP Features

- Shared chat entry point from supported apps
- Source app recognition
- App-specific knowledge retrieval for first answer
- AI first response
- Intake mode when unresolved
- AI follow-up questions for missing reproduction details
- Automatic metadata attachment
- AI classification
- Similar feedback grouping
- Canonical issue creation
- Original conversation preservation
- Impact assessment
- Priority score calculation
- Admin ranking views
- Emergency notification triggers

## Categories

Supported MVP categories:

- Question
- Bug
- Improvement
- Feature Request
- UX Feedback
- Other

## Severity

Recommended severity values:

- Critical
- High
- Medium
- Low

## Impact

Impact is an MVP requirement. Feedback Hub should estimate the affected scope and business risk from the user message and metadata.

Examples:

- Login failure: Critical impact because it can block broad access.
- Payment failure: Critical impact because it directly affects business conversion.
- Minor button-position confusion: Low impact because the workflow remains usable.

Impact must be stored separately from raw count. A low-count but high-impact issue can still rank high.

## Priority Formula

Initial formula:

```text
priorityScore = severityWeight * countWeight * impactWeight
```

The formula must be replaceable and auditable. Store the component values used to calculate each score.

## Automatic Metadata

Client apps should attach:

- appId
- appName
- appVersion
- route
- screenName
- workspaceId
- userId
- device
- browser
- occurredAt

Future metadata:

- screenshot attachment
- console/runtime error digest
- requestId / traceId / correlationId

Secrets, access tokens, and private credentials must never be captured.

## Data Model

### Conversation

- conversationId
- appId
- appName
- workspaceId
- userId
- route
- screenName
- appVersion
- device
- browser
- occurredAt
- status
- createdAt
- updatedAt

### Message

- messageId
- conversationId
- role
- body
- createdAt

### AI Analysis

- analysisId
- conversationId
- category
- severity
- impact
- confidence
- summary
- normalizedProblem
- suggestedQuestions
- metadata
- createdAt

### Issue

- issueId
- canonicalTitle
- category
- severity
- impact
- count
- priorityScore
- priorityComponents
- status
- firstSeenAt
- lastSeenAt
- createdAt
- updatedAt

### Issue Link

- issueLinkId
- issueId
- analysisId
- conversationId
- similarityScore
- matchReason
- createdAt

## API Candidates

MVP endpoints:

- `GET /health`
- `GET /version`
- `GET /contracts/status`
- `POST /api/feedback/conversations`
- `POST /api/feedback/conversations/{conversationId}/messages`
- `POST /api/feedback/conversations/{conversationId}/analyze`
- `GET /api/feedback/issues`
- `GET /api/feedback/issues/{issueId}`
- `GET /api/feedback/rankings/bugs`
- `GET /api/feedback/rankings/requests`
- `GET /api/feedback/rankings/questions`
- `GET /api/feedback/notifications/urgent`

## Ranking Views

Admin MVP should expose:

- Bug TOP 10
- Improvement / Feature Request TOP 20
- Question TOP 20
- Critical active issues
- New high-impact low-count issues

## Emergency Notification Rules

Initial triggers:

- any Critical Bug
- same Bug reaches 30 linked conversations
- payment-related Critical issue
- login/access Critical issue

Notification destination is owner-controlled and can be implemented after the MVP ranking and issue pipeline are stable.

## EIS Alignment

Feedback Hub should borrow the External Intelligence System pattern:

- Raw user conversation is preserved as evidence.
- AI Analysis is an interpreted observation.
- Similar repeated observations become a canonical Issue.
- Issue ranking uses evidence, count, impact, severity, confidence, and recency.
- The system must not equate frequency with truth.
- Original evidence must remain inspectable after AI summarization.

## Cloudflare MVP Direction

Recommended MVP infrastructure:

- Cloudflare Workers for API/runtime
- Cloudflare D1 for relational persistence
- R2 later for screenshots or larger attachments
- Queue later for async AI analysis and notification fan-out

Keep the first implementation small. Add Vectorize or other similarity infrastructure only after simple lexical/embedding storage is insufficient.

## Open Decisions

- Dedicated repository name
- Whether the first implementation is standalone or embedded in Platform Admin first
- First notification destination
- Exact app-specific Knowledge source for AI first answers
- Whether GitHub Issues are created automatically or only after owner approval
