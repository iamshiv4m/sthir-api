# Runbook: Deploy — sthir-api

Backend deployment (NestJS). **Frontend deploys separately** on Vercel — see [../../sthir/README.md](../../sthir/README.md).

## Environments

| Env | Target | URL pattern |
|-----|--------|-------------|
| Production | Railway / Render | `api.sthir.in` |
| Staging | Railway preview | `api-staging.sthir.in` |

## Prerequisites

- Railway project linked to GitLab repo (or Render/Fly equivalent)
- Neon PostgreSQL **or** Vercel Blob for persistence
- Razorpay live keys on production only

## Required env vars (production)

```bash
PORT=4000
NODE_ENV=production
API_PUBLIC_URL=https://api.sthir.in
CORS_ORIGIN=https://sthir.in,https://www.sthir.in
ADMIN_API_KEY=<strong-random-key>
DATABASE_URL=postgresql://...   # recommended
# OR BLOB_READ_WRITE_TOKEN=...
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx
```

## Deploy flow (Railway)

1. Push to `main` → Railway auto-deploy (see `railway.toml`)
2. Health check: `GET /api/v1/health`
3. Run [release checklist](../qa/release-checklist.md) (API sections)
4. Verify Razorpay webhook → `https://api.sthir.in/api/v1/webhooks/razorpay`
5. Update frontend Vercel env: `NEXT_PUBLIC_API_URL=https://api.sthir.in`

## Rollback

Railway → previous deployment → redeploy.

## Post-deploy verification

- [ ] `/api/v1/health` returns `{ ok: true }`
- [ ] CORS allows frontend origin
- [ ] Intake POST works from production frontend
- [ ] Admin queue with `x-admin-key`
- [ ] Webhook signature verification

## Frontend (Vercel)

Not deployed from this repo. After API deploy:

- Set `NEXT_PUBLIC_API_URL` on Vercel
- Redeploy frontend if CORS origin changed

## Related

- [runbook-incidents.md](runbook-incidents.md)
- [runbook-local-dev.md](runbook-local-dev.md)
- [../architecture/adr/0004-split-nestjs-api.md](../architecture/adr/0004-split-nestjs-api.md)
