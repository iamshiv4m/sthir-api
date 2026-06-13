# Validation Experiment Log

Results from Phase 1 validation experiments (Section 16). Update when each experiment completes.

## Summary

| ID | Experiment | Status | Result | Decision |
|----|------------|--------|--------|----------|
| E1 | Demand smoke test | In progress | — | — |
| E2 | Concierge delivery | Pending | — | — |
| E3 | Price sensitivity | Pending | — | — |
| E4 | Channel ROI | Pending | — | — |
| E5 | Substitute test | Pending | — | — |
| E6 | Coach willingness | Pending | — | — |
| E7 | Fat loss segment | Pending | — | — |

---

## E1: Demand smoke test

**Method:** Landing + ₹99 refundable waitlist deposit  
**Success:** 50 deposits in 14 days  
**Cost:** ~₹5k ads  
**Timeline:** Week 1–2  

### Setup

- [ ] Landing live with waitlist
- [ ] Razorpay deposit flow
- [ ] Meta ads ₹5k budget
- [ ] UTM tracking on all links

### Results

| Metric | Target | Actual | Date |
|--------|--------|--------|------|
| Deposits | 50 | | |
| Waitlist signups | 200 | | |
| Deposit conversion | — | | |
| Cost per deposit | < ₹100 | | |

### Learnings


### Decision

- [ ] Proceed to E2
- [ ] Pivot messaging
- [ ] Kill (<20 deposits)

---

## E2: Concierge delivery

**Method:** 10 manual coach-reviewed programs  
**Success:** NPS ≥40, Week-4 adherence ≥40%  
**Timeline:** Week 2–4  

See detailed log: [concierge-beta-log.md](../coach/concierge-beta-log.md)

### Results

| Metric | Target | Actual |
|--------|--------|--------|
| NPS avg | ≥ 40 | |
| Week-4 adherence | ≥ 40% | |
| Deliveries | 10 | |

### Decision

- [ ] Proceed to MVP build
- [ ] Pivot template approach
- [ ] Kill (NPS < 20)

---

## E3: Price sensitivity

**Method:** A/B ₹499 / ₹999 / ₹1,499  
**Success:** Highest revenue per visitor  
**Timeline:** Week 4–6  

### Results

| Variant | Visitors | Conversions | Rev/visitor |
|---------|----------|-------------|-------------|
| ₹499 | | | |
| ₹999 | | | |
| ₹1,499 | | | |

---

## E4: Channel ROI

**Method:** Gym poster vs Meta ₹5k each  
**Success:** CAC < ₹400  
**Timeline:** Week 4–8  

### Results

| Channel | Spend | Conversions | CAC |
|---------|-------|-------------|-----|
| Gym poster | | | |
| Meta ads | | | |

---

## E5: Substitute test

**Method:** Survey 20 users — Boostcamp + free sheet vs Sthir  
**Success:** <40% say substitute is "good enough"  
**Timeline:** Week 3  

### Results

| Response | Count | % |
|----------|-------|---|
| Good enough | | |
| Not good enough | | |

---

## E6: Coach willingness

**Method:** Interview 10 India PL coaches on marketplace  
**Success:** ≥6 would list at 20% take rate  
**Timeline:** Month 2  

### Results

| Would join at 20% take | Count |
|------------------------|-------|
| Yes | |
| No | |
| Maybe | |

---

## E7: Fat loss segment

**Method:** Include fat loss goal on landing, measure selection rate  
**Success:** ≥15% select fat loss goal  
**Timeline:** Month 1–2  

### Results

| Metric | Target | Actual |
|--------|--------|--------|
| Fat loss selection % | ≥ 15% | |

---

## Kill / pivot triggers (combined)

- E1 < 20 deposits → pause build, fix messaging
- E2 NPS < 20 → pivot programming approach
- E3 all variants < 5% conversion → pricing/offer problem

## Related

- [gtm-playbook.md](gtm-playbook.md)
- [../product/vision.md](../product/vision.md)
