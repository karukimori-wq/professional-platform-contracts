# Professional Platform Architecture

## Purpose

The Professional Platform separates business growth, professional work, AI execution, and SNS content generation into independent responsibilities.

Numeria Studio is the first implementation of Professional Studio. The architecture must allow future studios, such as FP Studio or Coach Studio, to use the same customer, session, document, AI, and event structure.

## Responsibility Layers

```text
Growth Engine
  owns customer master, reservation, sales, follow-up

Professional Studio
  owns professional session work and documents

AI Platform Core
  owns AI execution capabilities

SNS Planner
  owns SNS content generation only
```

## Growth Engine Responsibilities

Growth Engine owns:

- Customer master
- Customer basic profile
- Contact details
- LINE and SNS identifiers
- Acquisition source
- Reservation records
- Contract and payment state
- Sales records
- Referral data
- Repeat and follow-up analysis
- Campaigns
- Public sales menus
- Reservation slots

## Professional Studio Responsibilities

Professional Studio owns:

- Session
- Professional profile
- Professional input data
- Consultation or meeting content
- Professional history
- Practitioner notes
- Generated document
- Document preview
- PDF or export state
- Professional service references

Numeria Studio owns divination-specific data such as:

- Divination profile
- Birth data
- Consultation theme
- Chart or reading structure
- Reading notes
- Reading document

Numeria Studio must not own the customer master.

## Customer Boundary

Customer master data belongs to Growth Engine.

Professional Studio products reference the customer by `customerId`.

Professional Studio products may cache display data only as a temporary adapter and must not become the source of truth for customer basic information.

## Session Boundary

`Session` is the shared professional work unit.

- Numeria Studio: Session = reading
- FP Studio: Session = financial planning meeting
- Coach Studio: Session = coaching session
- Marriage Studio: Session = consultation
- Counselor Studio: Session = counseling session

Numeria Studio may use `Reading` internally. External APIs and events should use `Session`.

## Reservation Boundary

Growth Engine owns reservation creation, changes, cancellation, calendar source, and payment status.

Professional Studio starts and completes a Session linked to a reservation. It does not own the reservation calendar.

## Service Reference Boundary

Professional Studio provides professional service references:

- Professional method
- Session type
- Required input fields
- Default duration
- Professional service code

Growth Engine turns those references into sellable products:

- Sales name
- Public description
- Price
- Public state
- Campaigns
- Payment
- Reservation slots

## Integration Boundary

Use API for:

- Screen data retrieval
- Immediate commands
- Starting or completing a Session
- Fetching Customer or Reservation references
- Listing ServiceReferences

Use Events for:

- State-change notification
- Non-blocking downstream processing
- Follow-up creation
- Document generation notification

## Standalone Operation

Professional Studio products must work without Growth Engine.

If Growth Engine is disconnected, Numeria Studio must still support:

- Reading creation
- Divination input
- Chart calculation
- Reading history
- Document preview
- PDF generation

Growth Engine adds Business functionality. It is not a hard dependency for professional work.
