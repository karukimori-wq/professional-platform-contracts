# AI Capabilities

## Principle

AI Platform Core owns prompt text, prompt versions, model selection, provider abstraction, execution, usage logs, and cost data.

Professional Studio products call AI by Capability name.

## Allowed Numeria Capabilities

- `Reading.Interpret`
- `Reading.GenerateDraft`
- `Document.GenerateSection`
- `Document.SummarizeForFollowup`

## Product Rule

Numeria Studio should send structured reading data and receive generated output.

Numeria Studio should not store prompt bodies or model choices as product logic.

## Future Studio Examples

- `FinancialPlan.Interpret`
- `CoachingSession.GenerateDraft`
- `MarriageConsultation.GenerateSummary`
- `Document.GenerateSection`
