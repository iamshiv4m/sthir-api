# ADR-0004: Split NestJS API from Next.js Frontend

## Status

Accepted — June 2026

## Context

Founder requested separate backend repo with NestJS. Frontend deploys to Vercel; API needs persistent storage, webhooks, and PDF generation without serverless filesystem limits.

## Decision

- **sthir** — Next.js frontend only (Vercel)
- **sthir-api** — NestJS REST API at `/api/v1/*` (Railway / Render / Fly)
- Same API contract; frontend uses `NEXT_PUBLIC_API_URL`

## Consequences

- CORS required on API (`CORS_ORIGIN`)
- Two deploy pipelines, two repos
- Clearer team boundaries (designer/frontend vs backend)
- Razorpay webhook URL points to API domain

## Alternatives

| Option | Rejected because |
|--------|------------------|
| Next.js monolith on Vercel | Ephemeral storage; user wanted split |
| tRPC shared package | Overkill for Phase 1 |
