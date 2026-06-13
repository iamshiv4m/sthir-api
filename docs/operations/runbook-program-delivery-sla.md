# Runbook: Program Delivery SLA (12 Hours)

Coach operations runbook — payment se delivery tak. **Target: 90% programs within 12h of payment.**

## SLA definition

- **Clock starts:** Razorpay payment confirmed (webhook received) OR mock payment on intake submit
- **Clock stops:** Athlete receives program (status `delivered`, CSV/PDF available)
- **Deadline field:** `intake.slaDeadline` = payment time + 12 hours

## Status flow

```
pending_payment → pending_review → approved → delivered
                      ↓
                   rejected (manual refund)
```

Human review mandatory — see [ADR-0003](../architecture/adr/0003-human-review-mandatory.md).

## Reviewer daily checklist

### Morning (9 AM)

1. Open admin queue: `GET /api/v1/admin/queue` or `/admin`
2. Sort by `slaDeadline` ascending — **oldest first**
3. Count items with deadline < 4h remaining → priority

### Per program (target: 15–20 min review)

1. **Read intake summary** — goal, federation, SBD, injuries, meet date
2. **Check auto-warnings** — lift ratio flags from intake API
3. **Scan generated blocks** — loads reasonable? Week progression sane?
4. **Injury check** — modify exercises/loads if needed (see [review-sop](../coach/review-sop.md))
5. **Edit coach notes** — personalize readiness cues, meet taper notes
6. **Approve** → action `approve`
7. **Deliver** → action `deliver` → CSV + PDF generated
8. **Notify athlete** — email/WhatsApp with download link (manual Phase 1)

### SLA alerts (implement Phase 1.5)

| Time | Action |
|------|--------|
| T+0 | Payment confirmed — auto email "We're building your program" |
| T+8h | Warning if still `pending_review` — reviewer ping |
| T+11h | Escalate to founder — manual concierge fallback |
| T+12h | SLA breach — athlete apology + expedited delivery |

## Concierge fallback (SLA breach)

Agar system slow ya reviewer unavailable:

1. Export intake data from admin/DB
2. Manual Google Sheet from template ([template-guide](../coach/template-guide.md))
3. Deliver via email/WhatsApp within 2h of breach acknowledgment
4. Log in [concierge-beta-log](../coach/concierge-beta-log.md)
5. Root cause → [runbook-incidents](runbook-incidents.md)

## Capacity planning

| Volume | Reviewer need |
|--------|---------------|
| <5/day | Founder |
| 5–15/day | Founder + checklist discipline |
| 15–30/day | Part-time reviewer (hire trigger) |
| 30+/day | Dedicated CoachOps |

**Hire trigger:** SLA compliance <85% for 2 consecutive weeks.

## Metrics to track (weekly)

| Metric | Target |
|--------|--------|
| SLA compliance % | ≥ 90% |
| Median review time | < 3 hours |
| Revision rate (re-generate) | < 10% |
| Rejection rate | < 5% |
| NPS (post-delivery) | ≥ 40 |

## Rejection handling

When intake unusable (bad data, wrong goal, suspicious lifts):

1. Action `reject`
2. Email athlete — clarify data or offer refund
3. Manual Razorpay refund via dashboard
4. Update status `refunded` in DB (manual Phase 1)

## Federation-specific notes

See [federation-rules.md](../coach/federation-rules.md) for IPF/PI vs WRPF adjustments.

## Related

- [review-sop.md](../coach/review-sop.md)
- [template-guide.md](../coach/template-guide.md)
- [../product/prd-phase1.md](../product/prd-phase1.md)
