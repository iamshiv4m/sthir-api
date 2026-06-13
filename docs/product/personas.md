# User Personas

Summary from founding plan Section 8. Use these when writing issues, copy, and acceptance criteria.

---

## P1: Arjun — First Meet Lifter (Primary)

| Attribute | Detail |
|-----------|--------|
| Demographics | 22–28, male, Delhi/Mumbai warehouse gym |
| Experience | 6–18 months training |
| Lifts | Squat ~100 / Bench ~70 / Deadlift ~130 kg |
| Goal | First PI or WRPF meet in 12 weeks |
| Pain | Overwhelmed by free programs; scared of peaking wrong; trains with gym crew on WhatsApp |
| WTP | ₹999–1,499 for reviewed program |
| Success | Completes meet, 9/9 or PR total, refers 2 gym mates |

**Design implications:** Simple questionnaire, federation selector prominent, meet date field, reassurance on 12h SLA.

---

## P2: Priya — Total Chaser

| Attribute | Detail |
|-----------|--------|
| Demographics | 25–34, female, Bangalore |
| Experience | 2–4 years, WRPF classic |
| Total | 350–450 kg; plateaued bench; shoulder history |
| Pain | Generic programs ignore weak points; coach too expensive (₹8–15k/mo) |
| WTP | ₹1,499/block + ₹499 form checks |
| Success | +15–25 kg total in 16 weeks |

**Design implications:** Injury flags, secondary goal, bench specialization template, form check upsell (Phase 1.5).

---

## P3: Vikram — Warehouse Gym Owner (B2B2C)

| Attribute | Detail |
|-----------|--------|
| Demographics | 30–45, 80–200 member strength gym, Tier-1/2 |
| Pain | Members ask for programs; uses WhatsApp + PDFs; loses members to online coaches |
| WTP | ₹2,999–9,999/mo white-label (Phase 2+) |
| Success | 20+ member referrals, retention lift |

**Design implications:** Referral codes, gym partner page, meet-day activation. Track in [gym-partners.md](../growth/gym-partners.md).

---

## P4: Coach Neha — Online PL Coach (Phase 4)

| Attribute | Detail |
|-----------|--------|
| Profile | IPF/PI or WRPF coach, 5–30 clients |
| Tools today | Sheets + TrueCoach/WhatsApp |
| Pain | TrueCoach 5% fee; no India payments; no athlete discovery |
| WTP | ₹999–2,999/mo platform + 20–25% rev share if athletes provided |
| Success | 2x client capacity without quality drop |

**Design implications:** Not Phase 1. Inform admin review UX for future multi-coach queue.

---

## P5: Rahul — Recomp / Powerbuilding

| Attribute | Detail |
|-----------|--------|
| Demographics | 24–32, commercial gym |
| Goal | Fat loss while maintaining strength |
| Pain | Fitbod/Cult.fit wrong modality; PL programs too meet-focused |
| WTP | ₹699–999/program |
| Success | −4 to −8 kg bodyweight, strength maintained or improved |

**Design implications:** `fat_loss_strength` goal, lower price tier, nutrition note in templates.

---

## Persona → Phase map

| Persona | Phase 1 | Phase 2+ |
|---------|---------|----------|
| Arjun | Primary | Tracker, community |
| Priya | Primary | Form checks |
| Vikram | Referral only | B2B white-label |
| Neha | — | Marketplace |
| Rahul | Secondary SKU | — |
