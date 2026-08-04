# Shared Glossary

This glossary is the common language for all Professional Platform repositories.

## Platform Terms

| Term | Meaning | Owner |
| --- | --- | --- |
| Professional Platform | The overall product family for professional service businesses | Shared |
| Professional Studio | A domain-specific work application used by a professional | Each Studio |
| Numeria Studio | Professional Studio for fortune-telling professionals | Numeria Studio |
| Growth Engine | Business plan mode for acquisition, sales, customer nurturing, and business growth workflows | Growth Engine |
| AI Platform Core | Shared AI activity, capability, prompt, tool, workflow, and usage platform | AI Platform Core |
| Event Engine | Shared mechanism for publishing and consuming state-change events | AI Platform Core / Infrastructure |
| SNS Planner | SNS content creation tool called by Growth Engine | SNS Planner |

## Business Terms

| Term | Meaning | Owner |
| --- | --- | --- |
| Professional | The paying user, such as a fortune teller using Numeria Studio | Professional Studio / Growth Engine |
| Customer | A person managed by a professional as a lead, prospect, or client | Growth Engine |
| Lead | A customer before paid booking or confirmed business relationship | Growth Engine |
| Client | A customer with paid service history or confirmed booking | Growth Engine |
| Consultation | A customer inquiry or discussion theme | Growth Engine |
| Session | A professional service appointment or appraisal session | Professional Studio |
| Report | A generated professional deliverable such as an appraisal PDF | Professional Studio |
| Business Plan | Paid plan tier that unlocks Growth Engine features inside a Professional Studio UI | Growth Engine |

## Technical Terms

| Term | Meaning | Owner |
| --- | --- | --- |
| Workspace | Tenant boundary for one professional or organization | AI Platform Core |
| Project | A logical app or service area inside a workspace | AI Platform Core |
| Environment | Runtime environment such as development, staging, or production | AI Platform Core |
| Capability | A named AI-enabled action such as `Report.Generate` or `Customer.Find` | AI Platform Core |
| Activity | One execution of a capability or AI workflow | AI Platform Core |
| Usage | Token, request, or credit consumption record | AI Platform Core |
| Event | A state-change notification for asynchronous processing | Event Engine |

## Naming Rules

- Use `Customer` for the Growth Engine canonical customer.
- Use `Session` for professional work appointments.
- Use `Report` for generated professional deliverables.
- Do not use `User` unless referring to authentication identity.
- Do not use `Client` as a database root entity unless the entity is derived from `Customer`.
