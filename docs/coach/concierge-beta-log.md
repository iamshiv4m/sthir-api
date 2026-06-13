# Concierge Beta Delivery Log

Manual coach-reviewed program deliveries during validation (E2 experiment) and pre-MVP fallback.

**Goal:** 10 manual deliveries → NPS ≥40, Week-4 adherence ≥40%

## Log format

| # | Date | Athlete | Goal | Federation | Price (₹) | Delivered by | SLA (h) | Week-4 check-in | NPS | Notes |
|---|------|---------|------|------------|-----------|--------------|---------|-----------------|-----|-------|
| 1 | | | | | | founder | | ☐ | | |
| 2 | | | | | | founder | | ☐ | | |
| 3 | | | | | | founder | | ☐ | | |
| 4 | | | | | | founder | | ☐ | | |
| 5 | | | | | | founder | | ☐ | | |
| 6 | | | | | | founder | | ☐ | | |
| 7 | | | | | | founder | | ☐ | | |
| 8 | | | | | | founder | | ☐ | | |
| 9 | | | | | | founder | | ☐ | | |
| 10 | | | | | | founder | | ☐ | | |

Also tracked in `data/db.json` → `concierge` collection when using MVP admin.

## Concierge process (manual)

1. Athlete completes intake (form or WhatsApp)
2. Razorpay payment link sent manually if pre-MVP
3. Founder selects template in Google Sheet master
4. Adjust loads per [review-sop.md](review-sop.md)
5. Deliver sheet link + PDF via email/WhatsApp
6. Log row above
7. Week-4: WhatsApp check-in — "Still following program? Any pain?"

## Week-4 check-in script

> Hey [name], 4 weeks into your [goal] block — quick check:
> 1. Roughly what % of sessions completed?
> 2. Any pain or exercises you skipped?
> 3. 0–10, how likely to recommend Sthir?
> Reply whenever — no rush.

## Success criteria (E2)

| Metric | Pass | Fail |
|--------|------|------|
| NPS (avg) | ≥ 40 | < 20 → pivot |
| Week-4 adherence | ≥ 40% sessions | < 25% → template problem |
| Deliveries completed | 10 | — |

## Learnings → product

After each delivery, note:
- Template gaps
- Questionnaire fields missing
- Federation edge cases
- Time to deliver (target <12h even manual)

File GitLab issues for patterns seen 2+ times.

## Related

- [../growth/validation-log.md](../growth/validation-log.md)
- [../operations/runbook-program-delivery-sla.md](../operations/runbook-program-delivery-sla.md)
