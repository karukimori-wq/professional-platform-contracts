# Numeria AI Report Generation Contract

This contract is the implementation source of truth for AI-assisted appraisal report writing between Numeria Studio and AI Platform Core.

## Purpose

Numeria Studio sends a confirmed appraisal result to AI Platform Core. AI Platform Core generates structured report text from the confirmed Numeria input, prompt, policy, and domain knowledge.

AI Platform Core does not decide which divination method to use, does not calculate numerology, does not draw tarot cards, and does not own the final report.

## Ownership

### Numeria Studio owns

- Customer/appraisal-client workflow within Numeria's boundary.
- Appraisal Session.
- User request / consultation request.
- Divination method selection.
- Numerology and other deterministic calculation results.
- Tarot card draw and confirmed card result.
- Confirmed divination result source of truth.
- Fortune-teller Character management.
- Character Version management.
- AI generation preview, review, and edit workflow.
- Formal Report.
- Report Snapshot.
- PDF generation/export.

Numeria Studio is the only owner that can turn an AI draft into a formal Report.

### AI Platform Core owns

- Base Policy.
- AI Prompt.
- Prompt Version.
- Divination Knowledge.
- Knowledge Version.
- AI-facing interpretation of Character Snapshot.
- AI model selection.
- AI Generation execution.
- Output Schema validation.
- AI Usage.
- Activity.
- `generationId`.
- `traceId` / `correlationId`.
- Final plan / feature / usage checks for AI generation.

AI Platform Core must not own Customer, appraisal Session, confirmed divination result, formal Report, Report Snapshot, or PDF source-of-truth records.

## Direction Of Control

Numeria Studio must decide and confirm:

- which divination methods are used;
- all deterministic calculations;
- tarot draw/cards/result positions;
- the confirmed appraisal result;
- the Character Snapshot to use;
- the requested output format.

AI Platform Core receives the task as:

> Write this confirmed appraisal result, for this consultation request, in this Character Snapshot, using this requested structured report format.

APC must not reinterpret the request as "choose the divination method" or "calculate the result".

## V1 API

Endpoint candidate:

`POST /api/v1/generations/report`

Operation name:

`AIReportGeneration.Create`

Rule:

- 1 generation = 1 API request.
- Numeria Studio must not separately register Activity or Usage for this generation.
- AI Platform Core completes entitlement check, usage check, prompt/knowledge selection, AI generation, schema validation, Activity recording, and Usage recording internally.

Request schema:

- `schemas/studio-ai-report-request.v1.schema.json`

Response schema:

- `schemas/studio-ai-report-response.v1.schema.json`

## Required Numeria Input

Numeria sends five business input groups:

1. Character Snapshot.
2. Consultation request.
3. Divination methods used.
4. Confirmed Numeria appraisal result.
5. Requested output format.

System metadata:

- `appName`.
- `workspaceId`.
- `userId`.
- `sessionId`.
- `planId`.
- `featureKey`.
- `correlationId`.
- `contractVersion`.
- `locale`.

Recommended `featureKey`:

- `numeria.report.ai_generate`

## Character Contract

Character types:

- `preset`: Numeria standard Character.
- `custom`: User-created Character managed by Numeria Studio.

Character is not an AI Prompt. Character is structured writing configuration owned by Numeria Studio.

Character Snapshot fields:

- `characterId`.
- `type`.
- `version`.
- `name`.
- `personality`.
- `speakingStyle`.
- `writingRules`.
- `customInstruction`.

Numeria Studio must send the Character Snapshot used at generation time. This allows a past report generation to be traced to the exact Character Version even after Character settings change.

AI Platform Core may translate the Character Snapshot into AI-facing instructions, but that interpreted representation is not the Numeria Character source of truth.

## APC Internal Priority

AI Platform Core must apply instruction sources in this priority order:

1. Base Policy.
2. Domain Knowledge.
3. Character.
4. Tone.
5. Task Prompt.
6. Numeria Input Data.

Custom Character must not override Base Policy, safety policy, schema requirements, data minimization rules, or entitlement/usage enforcement.

Separation:

- Character = who the report sounds like.
- Tone = how this generation should feel.
- Task = what artifact to create.
- Numeria Input Data = confirmed facts/results to write from.

## Output Contract

AI Platform Core returns a Structured Report Draft, not a formal Report.

Minimum response shape:

- `generationId`.
- `correlationId`.
- `title`.
- `lead`.
- `sections[]`.
  - `key`.
  - `heading`.
  - `body`.
- `closing`.
- `promptKey`.
- `promptVersion`.
- `knowledgeVersions`.
- `model`.
- `generatedAt`.
- `usage`.
- `warnings`.

This supports section-level editing, section-level regeneration, PDF template changes, Free / Pro differentiation, and section reordering.

## Formal Report Rule

APC response status is AI Generation / AI Draft.

Formal report lifecycle:

1. AI Generation is returned from APC.
2. Numeria Studio shows preview.
3. Fortune-teller reviews and edits.
4. Numeria Studio finalizes.
5. Numeria Studio stores Report Snapshot.
6. Numeria Studio emits `studio.report.generated.v1`.

`studio.report.generated.v1` must be emitted when Numeria Studio stores the formal Report Snapshot, not when APC produces the draft.

APC may emit AI Platform Core activity/usage events for AI execution, but those are not formal Numeria report events.

## Error Contract

Common error codes:

| Code | Meaning |
| --- | --- |
| `INVALID_INPUT` | Request payload or required field is invalid. |
| `FEATURE_NOT_ALLOWED` | The user's plan/entitlement does not allow this AI report generation feature. |
| `USAGE_LIMIT_EXCEEDED` | Usage quota is exhausted. |
| `UNSUPPORTED_DIVINATION` | APC does not support writing from one of the supplied divination method result types. |
| `INSUFFICIENT_READING_DATA` | Numeria did not provide enough confirmed result data for generation. |
| `CHARACTER_INVALID` | Character Snapshot is missing, malformed, or violates policy. |
| `AI_GENERATION_FAILED` | Model/provider generation failed. |
| `OUTPUT_SCHEMA_INVALID` | Generated output did not pass response schema validation. |
| `SERVICE_UNAVAILABLE` | APC or provider dependency is unavailable. |

Error response fields should include:

- `status: "error"`.
- `error.code`.
- `error.message`.
- `error.retryable`.
- `generationId` when created.
- `correlationId`.
- `traceId` / `requestId` when available.

## Data Minimization

Allowed request content is limited to the consultation request and confirmed appraisal result needed to write the report.

Do not send Growth Engine Customer master full records, payment details, sales details, Stripe information, full Communication Planner conversation history, SNS draft bodies, API keys, secrets, or secret prompts.

Numeria Studio may send a Numeria-owned appraisal-client snapshot or summary only when needed for the report and only inside Numeria's ownership boundary.

## Versioning

Current contract version:

`studio-ai-report.v1`

Breaking changes require a new contract version and new schema files.
