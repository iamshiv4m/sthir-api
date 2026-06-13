# ADR-0003: Human Review Mandatory Before Program Delivery

## Status

Accepted (2026-06-14)

## Context

AI-generated or purely rules-based programs can recommend unsafe loads for injured athletes, wrong peaking for meet dates, or federation-inappropriate exercise selection. Founder has coaching credibility — brand promise is "reviewed by a real coach." Legal liability for injury claims is significant in fitness programming.

Automated competitors (JuggernautAI) accept automation tradeoffs. Sthir's wedge is **trust**.

## Decision

**No program reaches the athlete without human approval:**

1. Rules engine selects template and generates draft blocks + coach notes
2. Optional AI may draft notes (future) — never auto-send
3. Reviewer MUST call admin `approve` action before `deliver`
4. Status machine enforces: `pending_review` → `approved` → `delivered`
5. Rejected intakes require manual follow-up/refund

Coach SOP: [review-sop.md](../../coach/review-sop.md)

## Consequences

**Positive:**
- Trust differentiation vs free apps
- Liability reduction — human checked programming
- Quality feedback loop into templates
- Coach notes personalization

**Negative:**
- Manual bottleneck — SLA depends on reviewer availability
- Need part-time reviewer hire at ~30 programs/week
- Cannot scale to 1000s/day without coach marketplace (Phase 4)

## Alternates considered

| Option | Verdict |
|--------|---------|
| Full JuggernautAI-style automation | Rejected for Phase 1 |
| AI review only (no human) | Rejected — liability |
| 100% manual (no template engine) | Rejected — doesn't scale past 10/week |

## Hiring trigger

Part-time coach reviewer when SLA compliance drops below 85% for 2 consecutive weeks.

## Related

- [../../coach/review-sop.md](../../coach/review-sop.md)
- [../../operations/runbook-program-delivery-sla.md](../../operations/runbook-program-delivery-sla.md)
