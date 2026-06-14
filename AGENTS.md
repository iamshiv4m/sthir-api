# AGENTS.md — sthir-api (NestJS Backend)

Backend API for **Sthir**. Frontend: `../sthir` (Next.js + shadcn).

## Product loop

Intake → Razorpay → program engine → coach review (admin API) → CSV/PDF export.

## Git

All commits: **Shivam Jha** `<shivamjha190@gmail.com>`. Set locally:

```bash
git config user.name "Shivam Jha"
git config user.email "shivamjha190@gmail.com"
```

## Stack

- **NestJS 11** — modules under `src/`
- **Zod** — `src/domain/validations.ts`
- **Program engine** — `src/domain/program-engine.ts` + `templates/programs/`
- **DB** — `src/database/` (JSON / Neon / Blob)
- **Tests** — `pnpm test:engine`

## Key paths

```
src/
  intake/          POST /api/v1/intake
  waitlist/        POST /api/v1/waitlist
  programs/        GET programs, admin review
  webhooks/        Razorpay
  sessions/        Tracker API
  domain/          Business logic
  database/        Persistence layer
docs/              Living documentation — update with every MR
templates/programs/  JSON program templates
```

## Conventions

- Global prefix: `/api/v1`
- Admin: `AdminGuard` + header `x-admin-key`
- Conventional commits; update `docs/architecture/api.md` on route changes

## Docs

Full index: [docs/README.md](docs/README.md)

**Cursor skills:** [../.cursor/skills/sthir-platform/SKILL.md](../.cursor/skills/sthir-platform/SKILL.md) — platform context, founding rules, feature workflow

## Scripts

```bash
pnpm start:dev
pnpm build && pnpm start:prod
pnpm seed
pnpm test:engine
```
