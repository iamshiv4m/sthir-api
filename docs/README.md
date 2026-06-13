# Sthir API Documentation

Living documentation for **sthir-api** (NestJS backend). **Update relevant docs in the same MR as code changes.**

Platform-wide product docs live here. Frontend-only UI review: [../sthir/docs/product/designer-review-checklist.md](../../sthir/docs/product/designer-review-checklist.md).

**Executable truth for API, data, coach ops, and deploy** — developers and coaches should not need Cursor.

## Table of contents

### Root (this repo)

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | API setup, stack, deploy |
| [AGENTS.md](../AGENTS.md) | AI agent context |
| [.env.example](../.env.example) | Environment variables |

### Product

| Document | Purpose |
|----------|---------|
| [vision.md](product/vision.md) | Mission, phases, north-star metrics |
| [prd-phase1.md](product/prd-phase1.md) | Phase 1 living PRD |
| [personas.md](product/personas.md) | User personas |
| [team.md](product/team.md) | Founding team roles |

### Architecture

| Document | Purpose |
|----------|---------|
| [overview.md](architecture/overview.md) | System diagram, stack |
| [data-model.md](architecture/data-model.md) | Entities, persistence |
| [api.md](architecture/api.md) | REST v1 endpoints |
| [adr/](architecture/adr/) | Architecture Decision Records |

### Operations

| Document | Purpose |
|----------|---------|
| [runbook-local-dev.md](operations/runbook-local-dev.md) | Local API dev |
| [runbook-deploy-render-neon.md](operations/runbook-deploy-render-neon.md) | **Render + Neon deploy (recommended)** |
| [runbook-deploy.md](operations/runbook-deploy.md) | Deploy overview |
| [runbook-incidents.md](operations/runbook-incidents.md) | Incident response |
| [runbook-program-delivery-sla.md](operations/runbook-program-delivery-sla.md) | 12h coach SLA |

### Coach

| Document | Purpose |
|----------|---------|
| [review-sop.md](coach/review-sop.md) | Program review checklist |
| [template-guide.md](coach/template-guide.md) | Templates and load calculation |
| [federation-rules.md](coach/federation-rules.md) | IPF/PI vs WRPF |
| [concierge-beta-log.md](coach/concierge-beta-log.md) | Concierge beta log |

### Compliance

| Document | Purpose |
|----------|---------|
| [disclaimers.md](compliance/disclaimers.md) | Training disclaimer |
| [privacy-dpdp.md](compliance/privacy-dpdp.md) | DPDP data handling |
| [refund-policy.md](compliance/refund-policy.md) | Refund rules |

### Growth

| Document | Purpose |
|----------|---------|
| [gtm-playbook.md](growth/gtm-playbook.md) | Go-to-market Phase 1 |
| [validation-log.md](growth/validation-log.md) | Experiment results |
| [gym-partners.md](growth/gym-partners.md) | Gym partnerships |

### QA

| Document | Purpose |
|----------|---------|
| [test-strategy.md](qa/test-strategy.md) | Test pyramid |
| [release-checklist.md](qa/release-checklist.md) | Pre-release checklist |

### Related repos

| Repo | Docs |
|------|------|
| **sthir** (frontend) | [../sthir/docs/README.md](../../sthir/docs/README.md) — UI, shadcn, designer review |
| **sthir-api** (this) | This folder |

## When to update what

| Trigger | Update |
|---------|--------|
| New/changed API endpoint | `api.md`, CHANGELOG if user-visible |
| Architectural decision | New ADR in `architecture/adr/` |
| Coach / program logic | `coach/`, `template-guide.md` |
| Payment / PII | `compliance/`, ADR |
| Env var added | `.env.example`, README |
| Deploy process change | `operations/runbook-deploy.md` |

## MR documentation gate

- [ ] API docs updated if routes changed
- [ ] ADR for breaking/architectural changes
- [ ] `.env.example` for new env vars
- [ ] Coach SOP if delivery logic changed
