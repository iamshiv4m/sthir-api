# Gym Partners

Tracker for warehouse gym B2B2C partnerships. Target: **5 signed partners** in Delhi, Mumbai, Bangalore by M1.

Also stored in `data/db.json` → `gymPartners` when using MVP.

## Pipeline

| Gym | City | Contact | Status | Referral code | Referrals | Signed date | Notes |
|-----|------|---------|--------|---------------|-----------|-------------|-------|
| | Delhi | | prospect | | 0 | | |
| | Delhi | | prospect | | 0 | | |
| | Mumbai | | prospect | | 0 | | |
| | Mumbai | | prospect | | 0 | | |
| | Bangalore | | prospect | | 0 | | |

**Status:** `prospect` → `signed` → `active`

## Partner offer (Phase 1)

| Benefit | Detail |
|---------|--------|
| Athlete discount | ₹100 off first program with gym code |
| Gym commission | ₹100–200 per paid conversion OR 10% rev share |
| Marketing | A3 QR poster (PDF template) |
| Activation | Optional mock meet / lifter spotlight |

## Outreach script

> Hi [name], I'm [founder] from Sthir — we write personalized powerlifting programs for Indian lifters, reviewed by a real coach, delivered in 12 hours.
>
> Your members probably ask you for meet prep advice. We handle the programming — you keep the community credit. We give your members ₹100 off with code [GYMNAME].
>
> Can I drop a poster and explain in 10 min?

## Partner requirements

- Strength-focused gym (not general commercial)
- 50+ active barbell members preferred
- Willing to display QR poster at rack area
- Point of contact for referral questions

## Referral code format

`GYM_{CITY}_{SHORTNAME}` — e.g., `GYM_DELHI_IRONFORGE`

Implement in waitlist/intake `referralCode` field.

## Activation checklist (signed partner)

- [ ] Referral code created in system
- [ ] QR poster delivered (physical or PDF)
- [ ] Partner contact added to WhatsApp group (optional)
- [ ] First referral tracked
- [ ] 30-day check-in — referrals, feedback

## Success metrics

| Metric | M1 target | M6 target |
|--------|-----------|-----------|
| Signed partners | 5 | 10 |
| Referrals per partner | 2 | 10+ |
| Partner-sourced revenue % | 20% | 40% |

## Phase 2+ (defer)

- White-label dashboard for gym owners (Persona P3 — Vikram)
- ₹2,999–9,999/mo SaaS tier
- Member management integration

## Related

- [gtm-playbook.md](gtm-playbook.md)
- [../product/personas.md](../product/personas.md)
