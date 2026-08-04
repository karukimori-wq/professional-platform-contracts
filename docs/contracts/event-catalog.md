# Event Catalog

This catalog lists approved cross-system events.

Events are state-change notifications. They must be versioned and past tense.

## Growth Engine Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `growth.customer.created.v1` | Growth Engine | Professional Studio, AI Platform Core | A canonical customer was created |
| `growth.customer.updated.v1` | Growth Engine | Professional Studio | Canonical customer display or contact metadata changed |
| `growth.lead.converted.v1` | Growth Engine | Professional Studio, AI Platform Core | A lead became a client or booked customer |
| `growth.reservation.created.v1` | Growth Engine | Professional Studio | A reservation was created |
| `growth.reservation.cancelled.v1` | Growth Engine | Professional Studio | A reservation was cancelled |

## Professional Studio Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `studio.session.started.v1` | Professional Studio | Growth Engine, AI Platform Core | A professional work session started |
| `studio.session.completed.v1` | Professional Studio | Growth Engine, AI Platform Core | A professional work session completed |
| `studio.report.generated.v1` | Professional Studio | Growth Engine, AI Platform Core | A report was generated |
| `studio.service_reference.updated.v1` | Professional Studio | Growth Engine | A sellable service reference changed |

## AI Platform Core Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `ai.activity.created.v1` | AI Platform Core | Calling app, Growth Engine | AI activity was accepted |
| `ai.activity.completed.v1` | AI Platform Core | Calling app, Growth Engine | AI activity completed |
| `ai.activity.failed.v1` | AI Platform Core | Calling app | AI activity failed |
| `ai.usage.recorded.v1` | AI Platform Core | Growth Engine | AI usage was recorded |

## SNS Planner Events

| Event | Publisher | Consumers | Purpose |
| --- | --- | --- | --- |
| `sns.post_draft.created.v1` | SNS Planner | Growth Engine | A post draft was created |
| `sns.post_draft.updated.v1` | SNS Planner | Growth Engine | A post draft was updated |

## Pending Events

These events are expected but not yet approved as stable contracts.

| Event | Reason |
| --- | --- |
| `growth.campaign.created.v1` | Campaign model is not finalized |
| `growth.nurture_action.created.v1` | Nurturing workflow model is not finalized |
| `studio.recommendation.created.v1` | Recommendation payload requires privacy review |
