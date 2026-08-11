# Data Ownership

This document defines canonical ownership for shared data.

## Ownership Table

| Data | Canonical Owner | Referenced By |
| --- | --- | --- |
| Customer profile | Growth Engine | Numeria Studio, SNS Planner, AI Platform Core |
| Lead status | Growth Engine | Numeria Studio |
| Acquisition source | Growth Engine | Numeria Studio |
| Nurturing status | Growth Engine | Numeria Studio |
| Reservation | Growth Engine | Numeria Studio |
| Payment / Stripe payment state | Growth Engine | Other apps by reference/snapshot only |
| Sales / Revenue ledger | Growth Engine | Other apps by reference/snapshot only |
| Session | Numeria Studio | Growth Engine |
| Report | Numeria Studio | Growth Engine |
| Domain appraisal data | Numeria Studio | AI Platform Core by reference only |
| SNS post draft | SNS Planner | Growth Engine, Velvet by reference only where needed |
| Campaign intent | Growth Engine | SNS Planner |
| Velvet Guest/Person | Velvet | Velvet; other apps only by explicit contract/reference |
| Velvet Visit | Velvet | Velvet; other apps only by explicit contract/reference |
| Velvet GuestKnowledge | Velvet | Velvet; AI Platform Core only as scoped execution input, not canonical storage |
| Velvet GuestRelationship | Velvet | Velvet |
| Velvet Gift | Velvet | Velvet |
| Velvet personal ScheduleEntry | Velvet | Velvet |
| Velvet SelfInvestmentEntry | Velvet | Velvet |
| Velvet Capture | Velvet | AI Platform Core may process scoped content, Velvet remains canonical owner |
| Velvet dictionary/suggestion state | Velvet | Velvet |
| Capability | AI Platform Core | All apps |
| AI activity | AI Platform Core | All apps |
| AI usage | AI Platform Core | All apps |

## Growth Engine Customer vs Velvet Guest

These are separate canonical domains.

- Growth Engine `Customer` represents the shared Professional Platform business CRM entity.
- Velvet `Guest/Person` represents the individual user's private night-work relationship and visit-memory entity.
- A Velvet Guest does not automatically create a Growth Engine Customer.
- A Growth Engine Customer does not automatically create a Velvet Guest.
- Cross-reference is allowed only through an explicit mapped reference and documented user intent.
- Neither side may silently overwrite the other's canonical fields.

## Velvet Visit Amounts and Payment Notes

Velvet may retain user-entered visit sales amounts, payment-method notes and receivable/売掛 notes as private visit-history data.

These records are not:

- the Growth Engine canonical Sales/Revenue ledger;
- Stripe payment state;
- proof of settlement.

They must not silently mutate Growth Engine Sales, Payment or Revenue records.

## Duplication Rules

Allowed duplication:

- Cached display name for UI performance
- Snapshot fields in generated reports
- External service metadata needed for traceability
- Explicit reference IDs across contracted integrations
- User-entered Velvet private visit notes that resemble business fields but are clearly scoped as Velvet personal records

Not allowed duplication:

- Independent Growth Engine Customer master in Numeria Studio
- Velvet Guest presented as if it were the Growth Engine Customer source of truth
- Independent AI usage ledger in application repositories
- Independent business lifecycle status in SNS Planner
- AI Platform Core storing Velvet private guest/history data as its canonical business record

## Snapshot Rule

Reports may include snapshots of customer-facing information at generation time.

Snapshots are historical records, not canonical data.

## Privacy Rule for Velvet

Velvet private guest information is not general platform context.

Other apps must not receive Velvet contact details, private notes, visit histories, gift histories, relationship graphs or raw Capture content unless the user explicitly invokes a contracted feature that requires a minimum scoped subset.
