# API Contract

APIs are used for synchronous operations where the caller needs an immediate response.

## API Principles

- APIs return current state or accepted work results.
- APIs are not used as event logs.
- API endpoints must be scoped by `workspaceId`.
- Cross-system API calls must pass stable IDs, not duplicated master objects.
- Long-running work should return an operation or activity ID.

## Growth Engine APIs

| Operation | Purpose | Notes |
| --- | --- | --- |
| `Customer.Create` | Create canonical customer | Emits `growth.customer.created.v1` |
| `Customer.Find` | Search customers in a workspace | Growth Engine owns customer profile |
| `Customer.UpdateStatus` | Update lead/customer lifecycle status | Emits status event |
| `Campaign.IntentCreate` | Create campaign intent | May call SNS Planner |
| `Nurture.ActionPlanCreate` | Create nurturing action plan | Business judgement stays here |

## Professional Studio APIs

| Operation | Purpose | Notes |
| --- | --- | --- |
| `Session.Create` | Create professional work session | References `customerId` |
| `Report.Generate` | Generate professional report | May call AI Platform Core |
| `Report.Preview` | Render preview | Synchronous UI operation |
| `Report.ExportPdf` | Export PDF | Emits `studio.report.generated.v1` when completed |

## SNS Planner APIs

| Operation | Purpose | Notes |
| --- | --- | --- |
| `PostDraft.Generate` | Generate SNS draft | Caller provides purpose, target, CTA |
| `PostDraft.Rewrite` | Rewrite a post draft for SNS format | Does not choose business goal |
| `PostTemplate.List` | List available templates | Template responsibility only |

## AI Platform Core APIs

| Operation | Purpose | Notes |
| --- | --- | --- |
| `Capability.Register` | Register app capability | App-side setup |
| `Activity.Create` | Execute or record AI activity | Emits AI events |
| `Usage.List` | Query usage | Workspace/project scoped |
| `PromptTemplate.Render` | Render prompt template | No business decision |

## Error Shape

All cross-system APIs should return a stable error shape.

```json
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer was not found.",
    "details": {}
  }
}
```
