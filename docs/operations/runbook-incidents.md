# Runbook: Incidents

Incident response for Sthir production issues.

## Severity levels

| Level | Definition | Response time | Examples |
|-------|------------|---------------|----------|
| **P0** | Revenue/SLA blocked, data loss, payment broken | 15 min | Razorpay webhook down, admin unreachable |
| **P1** | Major feature degraded | 1 hour | PDF export failing, intake 500 errors |
| **P2** | Minor degradation | 4 hours | Landing page typo, slow queue load |
| **P3** | Cosmetic / non-urgent | Next sprint | UI alignment issue |

## On-call (Phase 1)

Solo founder = on-call. Escalation: none. Document everything for future hire.

## Response checklist

### 1. Detect

Sources: user report, Razorpay dashboard, Vercel alerts, Sentry (when enabled)

### 2. Triage (5 min)

- Severity?
- Users affected count?
- Revenue/SLA impact?
- Recent deploy correlation?

### 3. Communicate

P0/P1: Update affected athletes via email/WhatsApp if SLA at risk.

Template:
> Hi [name], we're experiencing a brief delay in program delivery. Your program is safe — we'll deliver within [revised time]. — Sthir team

### 4. Mitigate

| Scenario | Action |
|----------|--------|
| Bad deploy | Vercel rollback to previous deployment |
| Webhook failure | Manual mark intake `pending_review` in DB; fix webhook URL/secret |
| Payment stuck | Verify Razorpay order status; manual status update |
| Admin down | Direct DB edit + manual CSV delivery via concierge process |
| Data corruption | Restore from backup; contact affected users |

### 5. Resolve

- Root cause identified
- Fix deployed via hotfix MR (P0) or normal MR (P1+)
- Verify fix in production

### 6. Post-mortem (P0 within 48h, P1 within 1 week)

Add entry below:

---

## Post-mortem log

### Template

```markdown
## YYYY-MM-DD — [Title]

**Severity:** P0/P1/P2  
**Duration:** X hours  
**Impact:** N users, ₹X revenue at risk  

### Timeline
- HH:MM — Detected
- HH:MM — Mitigated
- HH:MM — Resolved

### Root cause


### Fix


### Action items
- [ ] Issue #NNN — preventive fix
- [ ] Runbook update
- [ ] ADR if architectural
```

### Incidents

*(None yet — add entries as they occur)*

---

## Common issues

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Payment success but no program | Webhook not received | Check Razorpay webhook logs; manual status update |
| Admin 401 | Wrong/missing API key | Verify Vercel env `ADMIN_API_KEY` |
| SLA missed | Reviewer capacity | Concierge manual delivery; hire reviewer |
| Duplicate programs | Webhook replay | Idempotent check — delete duplicate, keep latest |

## Prevention

- Webhook signature verification (implemented)
- Pre-release checklist before prod deploy
- Backup before database migrations
- Dependabot for security patches

## Related

- [runbook-deploy.md](runbook-deploy.md)
- [runbook-program-delivery-sla.md](runbook-program-delivery-sla.md)
