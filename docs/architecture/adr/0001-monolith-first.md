# ADR-0001: Monolith-first with Next.js

## Status

Accepted (2026-06-14)

## Context

Sthir Phase 1 is a solo-founder MVP with ~6 weeks build time. Expected traffic <1k users. Team has strong Next.js capability. Premature service extraction adds deploy complexity without revenue justification.

## Decision

Build Phase 1 as a **single Next.js monolith**:

- App Router pages for web + admin UI
- Route Handlers for REST API (`/api/v1/*`)
- Business logic in `src/lib/*`
- Deploy to Vercel as one unit

Extract services (notification, program generation) only at Phase 3 (~20k users) or when team ≥2 engineers.

## Consequences

**Positive:**
- Fast iteration, single deploy, shared types between FE/BE
- Lower infra cost (~₹2–8k/mo)
- Founder can ship end-to-end

**Negative:**
- Admin + athlete traffic share compute
- Harder to scale individual components independently
- Background jobs (SLA cron) need external scheduler (Inngest) even in monolith

## Alternates considered

| Option | Verdict |
|--------|---------|
| NestJS separate API | Rejected — two deploys, slower MVP |
| Serverless microservices | Rejected — overkill for Phase 1 |
| Supabase-only backend | Rejected — less control over program engine |

## Review trigger

Revisit when: >10k MAU, >2 engineers, or review queue latency affects SLA.
