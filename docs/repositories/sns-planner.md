# SNS Planner Repository Contract

SNS Planner creates SNS post content.

Growth Engine decides business purpose, target, offer, and CTA. SNS Planner turns those inputs into post drafts.

## Must Implement

- Post text generation
- Hashtag suggestions
- Reel ideas
- Story ideas
- Image idea prompts
- SNS-specific format adaptation
- Post templates
- Draft management
- Events with `sns.*` prefix when draft state changes

## Must Not Implement

- Sales judgement
- Customer segmentation decisions
- Campaign objective decisions
- Lead nurturing workflow
- Business plan rules
- AI usage ledger

## Required Input From Growth Engine

| Field | Meaning |
| --- | --- |
| `purpose` | Why this post exists |
| `targetAudience` | Who the post is for |
| `cta` | Desired next action |
| `tone` | Writing tone |
| `channel` | SNS channel |
| `constraints` | Length, forbidden wording, required topics |

## Required Contracts

- `docs/contracts/shared-glossary.md`
- `docs/contracts/platform-boundaries.md`
- `docs/contracts/api-contract.md`
