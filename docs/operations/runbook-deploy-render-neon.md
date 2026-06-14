# Runbook: Deploy — Render + Neon

**Stack:** `sthir-api` on Render · PostgreSQL on Neon · `sthir` frontend on Vercel

---

## Phase 1 — Neon database (15 min)

1. Sign up at [neon.tech](https://neon.tech) → **New Project** → name `sthir-prod`
2. Region: **AWS ap-southeast-1 (Singapore)** — closest to India users
3. Copy connection string:
   ```
   postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Schema auto-creates on first API request (`sthir_snapshot` table) — no manual migration needed for Phase 1.

### Optional: seed gym partners

```bash
cd sthir-api
DATABASE_URL="postgresql://..." pnpm seed
```

---

## Phase 2 — Render backend (20 min)

### Option A — Blueprint (recommended)

1. Push `sthir-api` to GitLab/GitHub
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect repo → Render reads `render.yaml`
4. Set env vars marked `sync: false` (see table below)
5. Deploy → note URL: `https://sthir-api.onrender.com`

### Option B — Manual Web Service

| Setting | Value |
|---------|-------|
| Runtime | Node |
| Region | Singapore |
| Build | `npm install -g pnpm@9 && pnpm install --frozen-lockfile && pnpm build` |
| Start | `node dist/main.js` |
| Health check | `/api/v1/health` |

---

## Environment variables (Render)

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | Neon connection string | ✅ |
| `API_PUBLIC_URL` | `https://sthir-api.onrender.com` | ✅ |
| `CORS_ORIGIN` | `https://sthir.vercel.app` (later `https://sthir.in`) | ✅ |
| `ADMIN_API_KEY` | `openssl rand -hex 32` | ✅ |
| `NODE_ENV` | `production` | ✅ |
| `RAZORPAY_KEY_ID` | live key when ready | later |
| `RAZORPAY_KEY_SECRET` | live secret | later |
| `RAZORPAY_WEBHOOK_SECRET` | from Razorpay dashboard | later |

Generate admin key locally:
```bash
openssl rand -hex 32
```

---

## Phase 3 — Vercel frontend (10 min)

1. Push `sthir` repo → connect Vercel
2. Env vars:

```bash
NEXT_PUBLIC_API_URL=https://sthir-api.onrender.com
NEXT_PUBLIC_APP_URL=https://sthir.vercel.app
```

3. Redeploy frontend

4. Update Render `CORS_ORIGIN` to match exact Vercel URL (include `https://`)

---

## Phase 4 — Smoke test

```bash
# Health
curl https://sthir-api.onrender.com/api/v1/health
# → {"ok":true,"service":"sthir-api","db":"postgres"}

# Waitlist
curl https://sthir-api.onrender.com/api/v1/waitlist

# Full flow in browser
# 1. Open Vercel URL → landing loads waitlist count
# 2. Submit intake → admin /admin with ADMIN_API_KEY
```

---

## Phase 5 — Razorpay (before real payments)

1. Razorpay Dashboard → Webhooks → Add:
   ```
   https://sthir-api.onrender.com/api/v1/webhooks/razorpay
   ```
2. Event: `payment.captured`
3. Copy webhook secret → Render env `RAZORPAY_WEBHOOK_SECRET`
4. Add live/test keys to Render

---

## Phase 6 — Custom domain (when ready)

| Service | Domain | DNS |
|---------|--------|-----|
| API | `api.sthir.in` | CNAME → Render |
| Web | `sthir.in` | Vercel |

Update env after DNS:
- Render: `API_PUBLIC_URL=https://api.sthir.in`, `CORS_ORIGIN=https://sthir.in`
- Vercel: `NEXT_PUBLIC_API_URL=https://api.sthir.in`, `NEXT_PUBLIC_APP_URL=https://sthir.in`

---

## Render free tier notes

- Service **spins down** after 15 min idle → first request ~30s cold start
- Upgrade to **Starter ($7/mo)** before launch / concierge beta
- PDF/CSV exports use ephemeral disk — files served immediately on deliver; don't rely on persistence

---

## Rollback

Render → service → **Deploys** → previous deploy → **Rollback**

---

## Related

- [runbook-local-dev.md](runbook-local-dev.md)
- [../architecture/adr/0002-json-store-bootstrap.md](../architecture/adr/0002-json-store-bootstrap.md)
- [../../render.yaml](../../render.yaml)
