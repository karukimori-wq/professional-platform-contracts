# Implementation Repository Template

Copy this structure into each product repository as `docs/contracts.md` and adapt it.

## Repository Responsibility

This repository owns:

- ...

This repository does not own:

- ...

## Shared IDs

| ID | Required | Purpose |
| --- | --- | --- |
| `workspaceId` | Yes | Tenant boundary |
| `professionalId` | Yes | Paying professional |
| `customerId` | When customer-linked | Growth Engine canonical customer reference |

## APIs Provided

| Operation | Caller | Notes |
| --- | --- | --- |
| `...` | `...` | `...` |

## APIs Consumed

| Operation | Provider | Notes |
| --- | --- | --- |
| `...` | `...` | `...` |

## Events Published

| Event | When Published |
| --- | --- |
| `...` | `...` |

## Events Consumed

| Event | Purpose |
| --- | --- |
| `...` | `...` |

## Forbidden Local Ownership

This repository must not own:

- ...

## Contract References

- `professional-platform-contracts/docs/contracts/platform-boundaries.md`
- `professional-platform-contracts/docs/contracts/api-catalog.md`
- `professional-platform-contracts/docs/contracts/event-catalog.md`
- `professional-platform-contracts/docs/contracts/data-ownership.md`
