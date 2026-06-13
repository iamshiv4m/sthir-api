# Runbook: Local Development — sthir-api

## Prerequisites

- Node.js 20+
- pnpm 9+

## API setup

```bash
cd sthir-api
cp .env.example .env
pnpm install
pnpm seed          # optional gym partners
pnpm start:dev     # http://localhost:4000/api/v1
```

Health: `curl http://localhost:4000/api/v1/health`

## Frontend (separate repo)

```bash
cd ../sthir
cp .env.example .env.local
pnpm install && pnpm dev    # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:4000` in frontend `.env.local`.

## Environment (API `.env`)

```bash
PORT=4000
API_PUBLIC_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000
ADMIN_API_KEY=dev-admin-key
# Razorpay empty = mock payment mode
```

## Data

| Backend | Storage |
|---------|---------|
| Default local | `data/db.json` (auto-created) |
| `DATABASE_URL` | Neon PostgreSQL |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob |

Reset local JSON: delete `data/db.json` and restart.

## Common flows

### Intake (mock payment)

1. POST `/api/v1/intake` via frontend or curl
2. Intake → `pending_review`, program draft created
3. Admin: `GET /api/v1/admin/queue` with `x-admin-key`

### Razorpay webhooks (local)

Use ngrok → `https://xxx.ngrok.io/api/v1/webhooks/razorpay`

## Tests

```bash
pnpm test:engine    # program-engine unit tests
pnpm build
```

## Related

- [runbook-deploy.md](runbook-deploy.md)
- [../architecture/api.md](../architecture/api.md)
- [../../sthir/docs/README.md](../../sthir/docs/README.md) — frontend docs
