# Test Strategy

QA approach for Sthir Phase 1 (Section 35 summary).

## Test pyramid

| Layer | Share | Focus | Tool |
|-------|-------|-------|------|
| Unit | 60% | Template engine, load calc, validation | Vitest |
| Integration | 30% | API routes, webhooks, export | Vitest + mocks |
| E2E | 10% | Full intake → payment → deliver | Playwright (MVP launch) |

## Unit tests (priority)

**File:** `src/lib/program-engine.test.ts`

Cover:
- `selectTemplate()` — goal + federation routing
- `generateProgramBlocks()` — load calculation, phase multipliers, rounding
- `generateCoachNotes()` — injury flags, meet date
- `validateLiftRatios()` — warning thresholds

Run: `pnpm test`

### Adding unit tests

- Co-locate `*.test.ts` next to source
- No external deps — pure function tests
- Required for any program-engine change (MR gate)

## Integration tests (target)

| Route | Cases |
|-------|-------|
| `POST /api/v1/intake` | Valid payload, validation errors, mock payment path |
| `POST /api/v1/webhooks/razorpay` | Valid signature, invalid signature, idempotent replay |
| `POST /api/v1/admin/programs/:id` | Approve, deliver, reject, unauthorized |
| `GET /api/v1/programs/:id/csv` | File download after deliver |

Use temp `data/db.json` or mock `readDb`/`writeDb`.

## E2E tests (at MVP launch)

Playwright flow:
1. Landing → intake form fill
2. Mock payment complete
3. Admin approve + deliver
4. Download CSV

Run on main branch only (CI cost).

## Manual testing (concierge phase)

Before automation:
- 10 manual deliveries per [concierge-beta-log](../coach/concierge-beta-log.md)
- Coach verifies program quality — not QA automation

## Release gates

All must pass before production:

- [ ] `pnpm lint` clean
- [ ] `pnpm test` all pass
- [ ] `pnpm build` succeeds
- [ ] Manual smoke on staging (see [release-checklist](release-checklist.md))
- [ ] SLA workflow verified
- [ ] Razorpay test payment end-to-end

## Phase 2 additions

- Workout logging edge cases (null RPE, failed sets)
- PWA offline behavior
- Sheet import validation

## Bug severity → test requirement

| Severity | Test required |
|----------|---------------|
| P0 fix | Regression test mandatory |
| P1 fix | Test encouraged |
| P2/P3 | Optional |

## Related

- [release-checklist.md](release-checklist.md)
- [../operations/runbook-local-dev.md](../operations/runbook-local-dev.md)
