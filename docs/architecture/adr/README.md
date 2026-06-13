# Architecture Decision Records (ADR)

We document significant architectural decisions here using a lightweight ADR format.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-monolith-first.md) | Monolith-first with Next.js | Accepted |
| [0002](0002-json-store-bootstrap.md) | JSON file store for Phase 1 bootstrap | Accepted |
| [0003](0003-human-review-mandatory.md) | Human review mandatory before delivery | Accepted |

## When to write an ADR

Create a new ADR when changing:

- Database or persistence layer
- Auth model
- Payment flow
- Major vendor selection
- Service extraction (monolith → microservices)
- Programming/pricing engine logic with compliance impact

## Format

```markdown
# ADR-NNNN: Title
## Status
## Context
## Decision
## Consequences
## Alternates considered
```

Number sequentially: `0004-next-decision.md`.

## Process

1. Draft ADR on feature branch
2. Reference in MR description
3. Reviewer confirms ADR matches implementation
4. Merge with code

## Related

- [overview.md](../overview.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — approval matrix for architectural changes
