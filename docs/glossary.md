# Shared Glossary

## Terms

| Term | Owner | Meaning |
| --- | --- | --- |
| Customer | Growth Engine | Master customer record. Professional Studio references it by `customerId`. |
| customerId | Growth Engine | Shared customer identifier used across the platform. |
| Professional Studio | Platform | Product family for expert work tools. Examples: Numeria Studio, FP Studio, Coach Studio. |
| Session | Professional Studio | Shared unit of professional work. Numeria = reading, FP = meeting, Coach = coaching. |
| Reading | Numeria Studio | Numeria-internal interpretation record. Do not use as an external cross-system event noun. |
| Reading Profile / 鑑定カルテ | Numeria Studio | Divination-specific profile and reading data owned by Numeria. |
| Document | Professional Studio | Generated deliverable such as report, PDF, template, preview, or export. |
| ServiceReference | Professional Studio | Professional menu reference provided to Growth Engine. |
| Reservation | Growth Engine | Booking source of truth. |
| Capability | AI Platform Core | AI execution unit called by product code. |
| ConsultationTag | Professional Studio | Minimal category shared to Growth Engine for follow-up and trend analysis. |
| AnonymizedTendencySummary | Professional Studio | Non-sensitive tendency summary. It must not contain detailed professional notes. |
| SNS Planner | Growth Engine tool | SNS content generation tool called by Growth Engine. |

## Terms To Avoid

Avoid `Customerカルテ` inside Numeria Studio. Use `鑑定カルテ` or `Reading Profile`.

Avoid external `Reading.Started` or `Reading.Completed` events. Use `Session.Started` and `Session.Completed`.

Avoid prompt names in product code. Use AI Capability names.

Avoid Growth Engine fields inside Professional Studio domain models, such as `paymentStatus`, `salesAmount`, and `campaignCode`.
