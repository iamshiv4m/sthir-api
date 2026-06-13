# Coach Review SOP

Standard operating procedure for reviewing and delivering Sthir programs.

**Rule:** No program ships without completing this checklist (ADR-0003).

## Before you start

- [ ] Queue sorted by SLA deadline
- [ ] Federation rules doc open if WRPF intake
- [ ] 15–20 min blocked per program

## Review checklist

### 1. Athlete context (2 min)

- [ ] Name, goal, experience level match template selected
- [ ] Federation correct (IPF/PI vs WRPF vs Other)
- [ ] Meet date noted — peaking/taper weeks appropriate
- [ ] Training days/week realistic for template volume
- [ ] Training style (% vs RPE vs mixed) reflected in load strings

### 2. Lift numbers (3 min)

- [ ] SBD 1RMs plausible for experience/bodyweight
- [ ] Review API warnings (bench:squat, deadlift:squat ratios)
- [ ] If suspicious — adjust working loads down 5–10% or email athlete
- [ ] Meet PRs (if provided) compared to training maxes

### 3. Injury & equipment (3 min)

- [ ] All reported injuries reflected in coach notes
- [ ] Exercise substitutions if needed (e.g., shoulder → neutral grip bench)
- [ ] Equipment available matches program demands (belt, boards, etc.)
- [ ] Sleep/recovery notes considered — add readiness guidance

### 4. Program blocks (5 min)

- [ ] Weekly volume appropriate for experience
- [ ] Load progression sane week-to-week
- [ ] Peak/taper aligns with meet date (if applicable)
- [ ] Accessory work supports weak points for goal
- [ ] Deload weeks present where template specifies

### 5. Coach notes (3 min)

- [ ] Personalized opening (not generic template text)
- [ ] Key focus areas for this athlete stated
- [ ] Injury modifications documented
- [ ] Readiness rule included: "Reduce 2–5% if sleep <6h or RPE overshoots"
- [ ] Meet day guidance if meet prep program

### 6. Approve & deliver (2 min)

- [ ] Edit `coachNotes` if needed
- [ ] Admin action: **approve**
- [ ] Spot-check CSV/PDF output
- [ ] Admin action: **deliver**
- [ ] Notify athlete with download link

## Red flags — reject or pause

| Flag | Action |
|------|--------|
| Minor (<18) without guardian consent flow | Reject — legal |
| Disclaimer not accepted | Reject |
| Impossible lifts (e.g., 300kg bench, 60kg bodyweight) | Email verify or reject |
| Serious injury + high intensity template | Modify or reject |
| Wrong federation rules (wraps vs raw) | Regenerate with correct template |

## Modification guidelines

| Change | Allowed |
|--------|---------|
| Edit coach notes | Yes |
| Adjust individual loads ±5–10% | Yes — document in notes |
| Swap accessory exercise | Yes |
| Change main lift structure | Requires template change — flag for Eng |
| Extend program duration | Manual — note in delivery email |

## Post-delivery

- [ ] Week-4 check-in scheduled (concierge beta)
- [ ] Log any template issues for Eng backlog
- [ ] Collect NPS at week 4

## Escalation

- SLA < 4h remaining → prioritize
- Unsure on injury modification → conservative loads + refer to physio disclaimer
- Template engine bug → manual sheet + hotfix issue

## Related

- [template-guide.md](template-guide.md)
- [federation-rules.md](federation-rules.md)
- [../operations/runbook-program-delivery-sla.md](../operations/runbook-program-delivery-sla.md)
