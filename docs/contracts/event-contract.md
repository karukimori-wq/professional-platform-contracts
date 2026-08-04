# Event Contract

Events describe state changes that already happened.

They are not commands.

## Event Naming

Use past-tense names.

Pattern:

```text
<domain>.<entity>.<pastAction>.v<version>
```

Examples:

- `growth.customer.created.v1`
- `growth.lead.converted.v1`
- `studio.session.completed.v1`
- `studio.report.generated.v1`
- `ai.activity.completed.v1`

## Event Envelope

All events use the same envelope.

| Field | Required | Meaning |
| --- | --- | --- |
| `eventId` | Yes | Unique event ID |
| `eventType` | Yes | Versioned event type |
| `occurredAt` | Yes | ISO 8601 timestamp |
| `workspaceId` | Yes | Tenant boundary |
| `projectId` | No | Project or app boundary |
| `sourceSystem` | Yes | System that emitted the event |
| `correlationId` | No | Cross-request trace ID |
| `actor` | No | User, system, or integration actor |
| `data` | Yes | Event-specific payload |

## Delivery Semantics

Consumers must be idempotent.

The same event may be delivered more than once. Consumers must use `eventId` to avoid duplicate side effects.

## Event Ownership

| Event Prefix | Publisher |
| --- | --- |
| `growth.*` | Growth Engine |
| `studio.*` | Professional Studio / Numeria Studio |
| `ai.*` | AI Platform Core |
| `sns.*` | SNS Planner |

## When Not To Use Events

Do not use events for:

- Button click handling
- Immediate UI reads
- Form validation
- Direct report preview generation
- Direct SNS draft generation

Use APIs for those operations.
