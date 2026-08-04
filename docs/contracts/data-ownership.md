# Data Ownership

This document defines canonical ownership for shared data.

## Ownership Table

| Data | Canonical Owner | Referenced By |
| --- | --- | --- |
| Customer profile | Growth Engine | Professional Studio, SNS Planner, AI Platform Core |
| Lead status | Growth Engine | Professional Studio |
| Acquisition source | Growth Engine | Professional Studio |
| Nurturing status | Growth Engine | Professional Studio |
| Session | Professional Studio | Growth Engine |
| Report | Professional Studio | Growth Engine |
| Domain appraisal data | Professional Studio | AI Platform Core by reference only |
| SNS post draft | SNS Planner | Growth Engine |
| Campaign intent | Growth Engine | SNS Planner |
| Capability | AI Platform Core | All apps |
| AI activity | AI Platform Core | All apps |
| AI usage | AI Platform Core | Growth Engine, Professional Studio |

## Duplication Rules

Allowed duplication:

- Cached display name for UI performance
- Snapshot fields in generated reports
- External service metadata needed for traceability

Not allowed duplication:

- Independent customer master in Professional Studio
- Independent AI usage ledger in application repositories
- Independent business lifecycle status in SNS Planner

## Snapshot Rule

Reports may include snapshots of customer-facing information at generation time.

Snapshots are historical records, not canonical data.
