# Integration Naming

## API Naming

Use APIs for synchronous reads and commands.

Pattern:

```text
Resource.Action
```

Allowed examples:

- `Customer.Get`
- `Reservation.Get`
- `Session.Start`
- `Session.Complete`
- `ServiceReference.List`
- `AICapability.Run`

## Event Naming

Use Events for asynchronous state changes.

Pattern:

```text
Noun.PastTense
```

Published examples:

- `Session.Started`
- `Session.Completed`
- `Document.Generated`
- `Professional.RecommendationCreated`

Subscribed examples:

- `Customer.Created`
- `Reservation.Created`
- `Reservation.Cancelled`

## Naming Rules

- External Professional Studio events use `Session`, not `Reading`.
- Numeria Studio may use `Reading` internally.
- API commands use present-tense actions such as `Start`, `Complete`, `Get`, and `List`.
- Events use past-tense actions such as `Started`, `Completed`, `Generated`, and `Created`.
- Cross-system contracts must remain reusable across future studios.
