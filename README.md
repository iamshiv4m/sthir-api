# Sthir API

NestJS backend for [Sthir](../sthir) — intake, payments, program engine, coach admin, exports.

## Stack

- **NestJS 11** + Express
- **Zod** validation
- **Razorpay** payments
- **PostgreSQL (Neon)** or **Vercel Blob** or local JSON file store

## Setup

```bash
cp .env.example .env
pnpm install
pnpm seed          # optional gym partners
pnpm start:dev     # http://localhost:4000/api/v1
```

Health check: `GET /api/v1/health`

## Frontend pairing

Set in the Next.js app (`sthir`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Production:

```bash
# sthir (Vercel)
NEXT_PUBLIC_API_URL=https://api.sthir.in

# sthir-api (Railway / Render / Fly)
API_PUBLIC_URL=https://api.sthir.in
CORS_ORIGIN=https://sthir.in,https://www.sthir.in
```

## Deploy targets

| Platform | Notes |
|----------|-------|
| **Railway** | Recommended — persistent disk + Neon Postgres |
| **Render** | Web service, attach Neon |
| **Fly.io** | Good for India region (`bom`) |
| Vercel | Possible but NestJS long-running fits PaaS better |

Frontend stays on **Vercel**. Backend on **Railway/Render**.

## API routes

Same contract as before — base path `/api/v1`:

- `POST/GET /waitlist`
- `POST/GET /intake`
- `POST /webhooks/razorpay`
- `GET /admin/queue`, `POST /admin/programs/:id` (header `x-admin-key`)
- `GET /programs/:id`, `GET /programs/:id/csv`
- `POST/GET /sessions`
- `GET /partners`

See [docs/README.md](docs/README.md) — full documentation index.

API reference: [docs/architecture/api.md](docs/architecture/api.md)

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm start:dev` | Dev server with watch |
| `pnpm build` | Compile |
| `pnpm start:prod` | Run compiled |
| `pnpm seed` | Seed partners |
| `pnpm test:engine` | Program engine unit tests |
