# Contract Change Checklist

Use this checklist before changing shared contracts.

## Ownership

- [ ] Does this change alter which system owns data?
- [ ] Does this change create duplicate master data?
- [ ] Does this change keep Customer canonical ownership in Growth Engine?
- [ ] Does this change keep professional domain data in Professional Studio?
- [ ] Does this change keep AI execution and usage in AI Platform Core?

## Naming

- [ ] Does the change use terms from `docs/contracts/shared-glossary.md`?
- [ ] Are event names past tense and versioned?
- [ ] Are API operations PascalCase dotted names?
- [ ] Are external service IDs namespaced?

## API vs Event

- [ ] Is synchronous work represented as an API?
- [ ] Is asynchronous state-change notification represented as an event?
- [ ] Is the event describing something that already happened?
- [ ] Is the consumer expected to be idempotent?

## Privacy and Data Sharing

- [ ] Does the payload avoid detailed professional notes by default?
- [ ] Does it avoid full generated appraisal text unless explicitly required?
- [ ] Does it avoid duplicating payment or sales state outside Growth Engine?
- [ ] Does it include only the minimum data required by the consumer?

## Versioning

- [ ] Is this a patch, minor, or major contract change?
- [ ] Does a required field change need a new major version?
- [ ] Does a new optional field need a minor version note?
- [ ] Is an ADR required?

## Tests

- [ ] Did `npm test` pass?
- [ ] Did schema JSON parse successfully?
- [ ] Did new events or APIs get added to `src/contracts.js`?
- [ ] Did tests cover the new contract rule?
