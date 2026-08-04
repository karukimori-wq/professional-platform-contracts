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
| `Usage.List` | Growth Engine, Studio admin | Usage summary | None |
| `PromptTemplate.Render` | Product runtime | Rendered prompt | None |

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
