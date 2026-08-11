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

## AI Platform Core APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `Capability.Register` | Product repository | `capabilityId` | None |
| `Activity.Create` | Product runtime | `activityId` | `ai.activity.created.v1` |
| `Activity.Get` | Product runtime | Activity status | None |
| `Usage.List` | Growth Engine, Studio admin, Velvet | Usage summary / point-accounting state | None |
| `PromptTemplate.Render` | Product runtime | Rendered prompt | None |
| `VelvetCapture.Structure` | Velvet | Structured candidates only; no Velvet mutation | `ai.activity.created.v1` / completion events |
| `VelvetSearch.ParseIntent` | Velvet | Search intent / terms only; no Velvet dataset results | `ai.activity.created.v1` / completion events |

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

## SNS Planner APIs

| Operation | Caller | Response | Event |
| --- | --- | --- | --- |
| `PostDraft.Generate` | Growth Engine | Draft variants | `sns.post_draft.created.v1` |
| `PostDraft.Rewrite` | Growth Engine | Updated draft | `sns.post_draft.updated.v1` |
| `PostTemplate.List` | Growth Engine | Template list | None |

## Naming Rules

- Use PascalCase dotted operation names.
- Operation names describe commands or queries, not HTTP routes.
- Product repositories may map these operations to HTTP, RPC, server actions, or SDK methods.
- Cross-system API names must remain stable even if transport changes.
