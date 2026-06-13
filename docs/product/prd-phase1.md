# Phase 1 PRD — Personalized Powerlifting Program in 12 Hours

**Status:** Living document  
**Owner:** PM  
**Last updated:** 2026-06-14

## Problem

Indian powerlifters train in warehouse gyms with WhatsApp-based advice and free spreadsheets. Global apps (Boostcamp, JuggernautAI) ignore local federations, pricing, and meet culture. Lifters preparing for a first meet or chasing a total plateau need **structured, reviewed programming** they can trust.

## Solution

Sthir Phase 1 delivers a coach-reviewed training block (8–16 weeks) within 12 hours of payment, exported as Google Sheet-compatible CSV and PDF.

## Goals (Phase 1)

| Goal | Metric | Target (Month 6) |
|------|--------|------------------|
| Revenue validation | Paid programs | 80+ |
| Delivery quality | SLA within 12h | 90% |
| Satisfaction | NPS | ≥ 40 |
| Retention signal | Repeat purchase intent | 25% |

## User stories

### Athlete (P1 — Arjun)

- As a first-meet lifter, I select my goal and federation so my program matches PI/WRPF rules.
- As an athlete, I pay via UPI/card and receive confirmation with SLA deadline.
- As an athlete, I download my program as CSV/PDF after coach approval.

### Coach / Founder (review)

- As a reviewer, I see a queue of paid intakes sorted by SLA urgency.
- As a reviewer, I edit coach notes, approve, and trigger delivery.
- As a reviewer, I reject intakes that need clarification (refund flow manual Phase 1).

### Admin

- As admin, I authenticate via API key to access review endpoints.
- As admin, I see audit logs for payment and delivery events.

## In scope (MVP)

- [x] Landing page + 8 goal cards + waitlist
- [x] Adaptive intake questionnaire (demographics, SBD maxes, injuries, equipment, federation)
- [x] Rules-based template selection (8 templates)
- [x] Auto load calculation (% / RPE / mixed)
- [x] Razorpay checkout + webhook confirmation
- [x] Auto-generate draft program on payment
- [x] Admin review queue (approve / deliver / reject)
- [x] CSV + PDF export
- [x] 12h SLA deadline on intake
- [x] JSON file store (bootstrap)
- [ ] Email delivery (Resend — Phase 1.5)
- [ ] WhatsApp delivery (Phase 1.5)
- [ ] Google Sheets API push (optional; CSV works)
- [ ] SLA alert cron (T+8h warning)

## Out of scope (Phase 1)

- User accounts / login (email-only identification)
- Workout tracker UI
- Community, forums, leaderboards
- Coach marketplace
- Mobile app
- Form check video upload
- Multi-language UI

## Functional requirements

### Intake questionnaire

- 15-minute max completion time
- Required: goal, email, name, age, gender, bodyweight, experience, federation, SBD 1RMs, training days, style, gym type, equipment checklist, injuries, disclaimer acceptance
- Optional: meet date, weight class, secondary goal, referral code
- Validate lift ratios (flag suspicious SBD ratios for coach review)

### Program generation

- Select template by goal + experience + federation tags
- Generate weekly blocks with sets/reps/load/RPE
- Round loads to nearest 2.5 kg
- Phase multipliers for accumulation → intensification → peaking
- Generate coach notes summary for reviewer

### Payment

- Razorpay order on intake submit
- Webhook moves status: `pending_payment` → `pending_review`
- Mock mode (no Razorpay keys): skip payment, auto-generate program

### Review & delivery

- Status flow: `pending_review` → `approved` → `delivered` (or `rejected`)
- Coach MUST approve before delivery (see ADR-0003)
- Delivery generates CSV + PDF, updates status

## Pricing (Phase 1)

| SKU | Price (INR) | Goal ID |
|-----|-------------|---------|
| Founding program | ₹499 | most goals |
| Standard block | ₹799 | default |
| Meet prep | ₹1,499 | first_meet (16 wk) |
| Fat loss + strength | ₹699 | fat_loss_strength |
| Waitlist deposit | ₹99 | waitlist only |

See `src/lib/pricing.ts` for implementation.

## Success metrics (analytics)

- Funnel: landing → questionnaire start → submit → payment → delivery
- Template distribution by goal
- SLA compliance % and median review time
- Questionnaire drop-off by step (Phase 1.5)

## Dependencies

- Razorpay merchant account
- Vercel hosting
- Reviewer capacity (founder → part-time coach at 30+ programs/week)

## Open questions

- [ ] Email vs WhatsApp as primary delivery channel
- [ ] Founding price cap (first 100 users at ₹499)
- [ ] Reject/refund automation vs manual

## Related docs

- [personas.md](personas.md)
- [../coach/review-sop.md](../coach/review-sop.md)
- [../architecture/api.md](../architecture/api.md)
