# Data Sharing Rules

## Principle

Professional Studio products share the minimum data needed for Growth Engine follow-up.

Detailed professional content remains inside the Professional Studio product by default.

## Growth Engine Allowlist

Professional Studio products may share:

- `customerId`
- `professionalSessionId`
- `sessionStartedAt`
- `sessionCompletedAt`
- `serviceType`
- `consultationTags`
- `anonymizedTendencySummary`
- `documentGenerated`
- `recommendedNextTiming`
- `followupAllowed`
- `reviewRequestAllowed`

## Denied By Default

Professional Studio products must not share these fields by default:

- `fullReadingText`
- `detailedConsultationText`
- `aiGeneratedFullText`
- `privatePractitionerNotes`
- `fullChartInterpretation`
- `fullMeetingTranscript`
- `paymentStatus`
- `salesAmount`
- `campaignCode`

## Payload Rule

Payload builders should reject denied fields instead of silently dropping them.

Silent drops hide data-boundary bugs.
