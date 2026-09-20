# Velvet ↔ Growth Engine Customer Bridge

Status: active shared contract for the Velvet Free / Pro release.

Growth Engine remains the canonical owner of Customer. Velvet may provide a customer-registration experience, but the synchronous command is executed by Growth Engine and Velvet stores only the returned `customerId` plus a non-canonical display-name snapshot for resilience.

## Operations

### Customer.List

Velvet → Growth Engine.

Request scope:
- `workspaceId`
- authenticated/trusted `userId` context

Response:
- `customerId`
- `displayName`

Velvet uses this operation to render customer choices and to enforce the Free 30-customer limit. If Growth Engine is unavailable or the response shape is invalid, Velvet must not interpret that as an empty customer list.

### Customer.Get

Velvet → Growth Engine.

Request scope:
- `workspaceId`
- `customerId`
- authenticated/trusted `userId` context

Response:
- `customerId`
- `displayName`

A failed lookup must not cause Velvet to create a competing Customer record. Velvet may show its own previously saved display-name snapshot while the canonical source is unavailable.

### Customer.Create

Velvet → Growth Engine.

Allowed request body:
- `workspaceId`
- `userId`
- `displayName`

Growth Engine performs the canonical create, emits `growth.customer.created.v1`, and records the actor/source audit entry.

Expected success response:
- `status: "success"`
- `operation: "Customer.Create"`
- `eventName: "growth.customer.created.v1"`
- `customer.customerId`
- `customer.displayName`

Velvet must treat a success HTTP status with an incompatible response contract as unavailable/failed rather than assuming a Customer was created.

## Plan behavior

Customer registration is available in the Free / Pro release and is not a Business-only integration. Business remains unavailable for the current release.

For Free, Velvet must verify the canonical customer count before creating the 31st customer. If the canonical list cannot be verified, creation fails closed until Growth Engine is available.

For Pro, Velvet does not apply the Free 30-customer limit.

## Trust boundary

The server-to-server bridge uses:
- `X-Source-App: velvet`
- trusted `X-User-Id`
- integration secret header managed as runtime secret

Secret values must never be committed, logged, returned to the browser, or copied into development intelligence.

## Forbidden Customer.Create fields

Velvet must not send Customer master expansion or business-ledger fields through this narrow create command, including:
- contacts / phone / email
- reservation data
- payment data
- sales / revenue data
- Stripe data
- full Professional Memory
- full notes / conversation bodies

Additional Customer master editing belongs to Growth Engine unless a later shared contract explicitly adds a narrow command.

## Failure semantics

- missing bridge configuration → unavailable
- timeout/network/non-2xx → unavailable
- malformed success payload → unavailable
- Free customer-count read unavailable → create blocked, user input preserved for retry
- failed create → user input preserved for retry

An unavailable canonical source is not an empty canonical source.
