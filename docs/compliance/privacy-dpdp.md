# Privacy & Data Protection (DPDP)

Data handling practices for Sthir under India's Digital Personal Data Protection Act (DPDP) framework.

**Status:** Internal draft — legal review required before public launch.

## Data controller

Sthir (entity TBD at incorporation)  
Contact: [founder email — update before launch]

## Data we collect

| Category | Fields | Purpose | Legal basis |
|----------|--------|---------|-------------|
| Identity | Name, email, phone | Delivery, support | Contract |
| Demographics | Age, gender, height, weight | Program personalization | Consent |
| Health-adjacent | Injuries, sleep, recovery notes | Safe programming | Consent |
| Training | SBD maxes, experience, goals | Program generation | Contract |
| Payment | Razorpay order/payment IDs | Billing | Contract |
| Technical | IP, user agent (analytics) | Security, analytics | Legitimate interest |

We do **not** collect: Aadhaar, medical diagnoses, payment card numbers (handled by Razorpay).

## Data we do not sell

Athlete data is never sold to third parties. No advertising data brokers.

## Storage

| Phase | Location | Encryption |
|-------|----------|------------|
| Phase 1 dev | `data/db.json` local | File permissions |
| Phase 1 prod | PostgreSQL (Neon target) | At rest + TLS in transit |
| Exports | CSV/PDF on server disk | Access-controlled |

## Retention

| Data | Retention |
|------|-----------|
| Intake + program | 3 years after last interaction |
| Payment records | 7 years (tax compliance) |
| Waitlist (no purchase) | 12 months |
| Audit logs | 2 years |
| Analytics | Per PostHog settings (90 days default) |

## User rights (DPDP)

Users may request:

1. **Access** — copy of their data
2. **Correction** — update inaccurate fields
3. **Erasure** — delete account/data (subject to legal retention)
4. **Grievance** — contact DPO/email within 30 days

Process: email [privacy@sthir.in — set up before launch] with verification.

## Consent

- Intake disclaimer checkbox = training consent
- Marketing emails: separate opt-in (not pre-checked)
- WhatsApp messages: opt-in at delivery

## Processors (sub-processors)

| Vendor | Purpose | Data shared |
|--------|---------|-------------|
| Razorpay | Payments | Email, order amount |
| Vercel | Hosting | Request logs |
| Resend | Email | Email, name |
| PostHog | Analytics | Pseudonymous events |
| Google (optional) | Sheets export | Program data |

DPAs required with each before production.

## Security measures

- Admin API key authentication
- Razorpay webhook signature verification
- No secrets in repo
- HTTPS only in production
- MFA on admin accounts (when auth added)

## Breach notification

Per DPDP: notify Data Protection Board and affected users if breach likely to cause harm. See [runbook-incidents.md](../operations/runbook-incidents.md).

## Children's data

Service for 18+ only. Reject intakes with age <18 until guardian consent flow built.

## Changes

Privacy policy updates → notify users via email + CHANGELOG. Material changes require re-consent for health data processing.

## Related

- [disclaimers.md](disclaimers.md)
- [refund-policy.md](refund-policy.md)
- [../architecture/data-model.md](../architecture/data-model.md)
