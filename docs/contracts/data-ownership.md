# Data Ownership

This document defines canonical ownership for shared data.

## Ownership Table

| Data | Canonical Owner | Referenced By |
| --- | --- | --- |
| Customer profile / Customer master | Growth Engine | Professional Apps by reference/projection |
| Lead status | Growth Engine | Professional Apps where contracted |
| Acquisition source | Growth Engine | Professional Apps where contracted |
| Nurturing status | Growth Engine | Professional Apps where contracted |
| Reservation / Visit Schedule | Growth Engine | Professional Apps by reference |
| Payment / Stripe payment state | Growth Engine | Other apps by reference/snapshot only when necessary |
| Sales / Revenue ledger | Growth Engine | Other apps by reference/query only |
| Customer-level sales aggregation | Growth Engine | Velvet Business and other contracted consumers |
| Repeat / referral / contact-measure Business state | Growth Engine | Velvet Business / SNS Planner where contracted |
| Session | Numeria Studio | Growth Engine |
| Report | Numeria Studio | Growth Engine |
| Domain appraisal data | Numeria Studio | AI Platform Core by scoped execution only |
| SNS post draft | SNS Planner | Growth Engine, Velvet by reference only where needed |
| Campaign intent | Growth Engine | SNS Planner |
| Velvet professional Visit | Velvet | Growth Engine by reference/summary where needed |
| Velvet ServiceNote / conversation note | Velvet | Other apps only by minimum necessary reference/summary |
| Velvet preferences / cautions / previous handling | Velvet | Velvet; AI Platform Core only as scoped execution input |
| Velvet professional timeline | Velvet | Velvet; Growth Engine only through contracted refs/summaries |
| Velvet Gift / relationship memory | Velvet | Velvet |
| Velvet SelfInvestmentEntry | Velvet | Velvet |
| Velvet Capture | Velvet | AI Platform Core may process scoped content; Velvet remains canonical owner |
| Velvet dictionary/suggestion state | Velvet | Velvet |
| Capability | AI Platform Core | All apps |
| AI activity | AI Platform Core | All apps |
| AI usage | AI Platform Core | All apps |

## Growth Engine Customer and Velvet Professional Memory

There is one canonical shared Customer domain: Growth Engine `Customer`.

Velvet does not own a competing Guest/Person master.

- Velvet professional memory is keyed by/reference-linked to Growth Engine `customerId` where integrated.
- Velvet may retain minimum display/cache fields only when explicitly allowed by contract.
- Preferences, cautions, service notes, conversation notes, previous handling and professional timeline remain Velvet-owned professional data.
- Velvet professional memory must not silently overwrite Growth Engine Customer master fields.
- Growth Engine Customer changes must not silently overwrite Velvet confidential professional notes.

## Velvet Visit vs Growth Engine Reservation / Visit Schedule

Velvet owns the professional service-history record created during/after service.
Growth Engine owns the canonical Reservation / Visit Schedule business record.

A Velvet Visit may reference:
- `customerId`
- `reservationId`
- `visitScheduleId`

The reference does not transfer Reservation ownership to Velvet.

## Sales and Payment Rule

Growth Engine is the canonical owner of Payment, Sales and Revenue.

Velvet must not persist:
- canonical `salesAmount`
- canonical `paymentStatus`
- Payment records
- Sales/Revenue ledger entries
- Stripe secrets or credentials

Velvet Business may display customer-level sales, sales trends and related Business analysis by querying/referencing Growth Engine. Those views do not become Velvet canonical data.

Growth Engine should not send `paymentStatus`, `salesAmount` or Stripe data to Velvet unless a future explicit contract establishes a minimum necessary field for a specific operation. Default integration omits them.

## Velvet Plan Value Boundary

### Pro — JPY 10,000/month
Professional value: **顧客を忘れない・接客品質を上げる**.

Velvet owns the professional memory/recall capabilities that support this value.

### Business — JPY 30,000/month
Business value: **来店・売上・リピートを増やす**.

Business uses Growth Engine canonical business data and state. Velvet must not duplicate those sources of truth merely to render Business features.

## Reference-first Integration

Growth Engine -> Velvet default references:
- `workspaceId`
- `userId`
- `customerId`
- `reservationId` or `visitScheduleId`
- `intent`

Velvet -> Growth Engine default references/summaries where needed:
- `visitId`
- `noteId`
- `lastVisitAt`
- `nextActionRef`
- `summaryRef`

Raw confidential note bodies and full conversation text are not default cross-app payloads.

## Duplication Rules

Allowed duplication:
- minimal cached display name where contractually justified
- historical report snapshots
- external-service metadata needed for traceability
- explicit reference IDs across contracted integrations
- derived UI-only values that do not become a competing source of truth

Not allowed duplication:
- independent Customer master in Velvet, Numeria Studio or SNS Planner
- independent Payment or Sales ledger in Velvet
- Velvet-persisted canonical `salesAmount` or `paymentStatus`
- independent AI usage ledger in application repositories
- independent business lifecycle state in SNS Planner or Velvet
- AI Platform Core storing Velvet professional memory as its canonical business record

## Snapshot Rule

Snapshots are historical/derived records, not canonical data. A snapshot must never be presented as the current source of truth when the canonical owner is another app.

## Privacy Rule for Velvet

Velvet professional memory is not general platform context.

Other apps must not receive Velvet contact details, confidential service notes, conversation histories, gift histories, relationship graphs or raw Capture content unless the user explicitly invokes a contracted feature that requires a minimum scoped subset.

Growth Engine receives reference IDs and summaries where needed, not raw confidential note bodies by default.
