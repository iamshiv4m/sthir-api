# Refund Policy

User-facing refund rules for Sthir Phase 1 programs.

**Status:** Draft — legal review before public launch. Link from landing FAQ and intake flow.

## Summary

| Scenario | Refund |
|----------|--------|
| Program not delivered within **24 hours** (2× SLA) | Full refund |
| Program delivered but materially incorrect (wrong goal/federation) | Full refund or free revision |
| Athlete provided false information | No refund |
| Change of mind after delivery | No refund |
| Waitlist ₹99 deposit | Fully refundable until program purchase |

## Standard program purchase

1. **Before delivery:** If we cannot deliver within 24h of payment, athlete may request full refund.
2. **After delivery:** Refunds considered within **7 days** if:
   - Program clearly mismatches stated goal or federation
   - Duplicate charge / payment error
   - Not: "I didn't like the exercises" if program matches intake
3. **Revision first:** We offer free program revision before refund when issue is fixable.

## Waitlist deposit (₹99)

- Fully refundable on request before purchasing a full program
- Applied as credit toward first program if athlete converts
- Refund via Razorpay within 5–7 business days

## Rejected intakes

If coach rejects intake (bad data, safety concern):
- Full refund automatically
- Email explanation within 24h

## How to request

Email: [support@sthir.in — set up before launch]  
Include: order ID, email used at purchase, reason.

**SLA:** Respond within 48h; process refund within 5–7 business days.

## Chargebacks

Contact us before chargeback — we resolve faster. Fraudulent chargebacks may result in service ban.

## Form check add-ons (Phase 1.5)

- Refund if review not delivered within 48h
- No refund after video review sent

## Implementation notes

- Phase 1: manual refunds via Razorpay dashboard
- Track refund in intake status: `refunded`
- Log in audit trail

## Related

- [disclaimers.md](disclaimers.md)
- [../operations/runbook-program-delivery-sla.md](../operations/runbook-program-delivery-sla.md)
