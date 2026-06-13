# Release Checklist

Pre-release verification before production deploy or tagged release.

## Code quality

- [ ] All MRs for release merged to `main`
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes locally
- [ ] No `console.log` debug statements in production paths
- [ ] Dependencies audited (`pnpm audit` — no critical vulns)

## Documentation

- [ ] CHANGELOG `[Unreleased]` reviewed and complete
- [ ] Version number decided (semver)
- [ ] ADRs updated if architectural changes
- [ ] `.env.example` matches required production vars
- [ ] Runbooks updated if deploy/ops process changed

## Functional smoke (staging)

### Landing & waitlist

- [ ] Landing page loads, goals display
- [ ] Waitlist form submits
- [ ] Waitlist count API returns

### Intake flow

- [ ] Full questionnaire submits without errors
- [ ] Validation errors display for bad input
- [ ] Razorpay test payment completes (or mock path works)
- [ ] Intake status → `pending_review`
- [ ] Program draft generated in DB

### Admin & delivery

- [ ] Admin queue lists pending intakes
- [ ] Admin auth enforced (401 without key)
- [ ] Approve action works
- [ ] Deliver generates CSV + PDF
- [ ] Intake status → `delivered`

### Webhooks

- [ ] Razorpay test webhook processed
- [ ] Invalid signature rejected (400)
- [ ] Duplicate webhook idempotent

## Production readiness

- [ ] Environment variables set in Vercel production
- [ ] `ADMIN_API_KEY` is strong random value
- [ ] Razorpay **live** keys only on production
- [ ] Webhook URL configured in Razorpay dashboard
- [ ] `NEXT_PUBLIC_APP_URL` matches production domain
- [ ] Persistent storage for database (not ephemeral JSON on Vercel)

## Performance

- [ ] Landing LCP < 2.5s (Vercel preview check)
- [ ] CLS < 0.1
- [ ] API routes respond < 500ms (p95) on staging

## Compliance

- [ ] Disclaimer shown and required on intake
- [ ] Refund policy linked from FAQ
- [ ] No PII in logs or error reports
- [ ] Privacy contact email configured

## Rollback

- [ ] Previous deployment identified in Vercel
- [ ] Rollback steps documented in MR or release notes
- [ ] Database migration reversible (if applicable)

## Post-release

- [ ] Production smoke test (intake → deliver)
- [ ] CHANGELOG version section published
- [ ] Git tag pushed: `vX.Y.Z`
- [ ] Monitor for 1 hour — errors, webhook failures
- [ ] Close related GitLab issues

## Sign-off

| Role | Name | Date |
|------|------|------|
| Engineer | | |
| PM/Founder | | |

Solo founder: self-sign with checklist comment on release issue.

## Related

- [test-strategy.md](test-strategy.md)
- [../operations/runbook-deploy.md](../operations/runbook-deploy.md)
