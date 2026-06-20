# API Reference — v1

Base path: `/api/v1`  
Content-Type: `application/json` unless noted.

OpenAPI spec deferred to Phase 2. This document reflects **implemented** routes.

## Authentication

| Context | Method |
|---------|--------|
| Public routes | No auth (intake, waitlist, webhooks) |
| Admin routes | Header `x-admin-key: <ADMIN_API_KEY>` |
| Dev mode | Admin auth bypassed if `ADMIN_API_KEY` unset and `NODE_ENV=development` |

## Intake

### `POST /api/v1/intake`

Create intake submission and Razorpay order.

**Body:** Intake questionnaire (validated by `intakeSchema`)

**Response 200:**
```json
{
  "id": "uuid",
  "orderId": "order_xxx",
  "amountPaise": 79900,
  "mock": false,
  "warnings": ["Bench seems low relative to squat"],
  "razorpayKey": "rzp_live_xxx"
}
```

**Notes:**
- `mock: true` when Razorpay keys unset — intake skips payment, program auto-generated, status → `pending_review`
- `warnings` from lift ratio validation — coach should review

### `GET /api/v1/intake`

Returns `{ count: number }` — intake count (dev/admin utility).

## Waitlist

### `POST /api/v1/waitlist`

Add waitlist entry.

**Body:** `{ email, name, goal, city?, referralCode? }`

### `GET /api/v1/waitlist`

Returns `{ count, target }` for landing page progress bar.

## Webhooks

### `POST /api/v1/webhooks/razorpay`

Razorpay payment webhook. Raw body verified via `x-razorpay-signature`.

**Behavior:**
- Finds intake by `order_id`
- Sets status `pending_review`
- Generates program draft if not exists
- Idempotent on replay

## Programs (athlete)

### `GET /api/v1/programs/:id`

Get program metadata (post-delivery).

### `GET /api/v1/programs/:id/csv`

Download program as CSV file.

## Admin

All admin routes require `x-admin-key` in production.

### `GET /api/v1/admin/queue`

Review queue — intakes in `pending_review` or `approved`, sorted by SLA deadline.

**Query:** optional filters (status)

### `POST /api/v1/admin/programs/:id`

Program review actions. **Note:** `:id` is the **intake ID**.

**Body:**
```json
{
  "action": "approve" | "deliver" | "reject",
  "coachNotes": "optional edited notes",
  "reviewerId": "founder"
}
```

**Actions:**

| Action | Effect |
|--------|--------|
| `approve` | Updates coach notes, sets program reviewed, intake → `approved` (requires `pending_review` or `paid`) |
| `deliver` | Generates CSV + PDF, intake → `delivered` (requires `approved`) |
| `reject` | intake → `rejected` (manual refund) |

**Response:** `{ status, csvPath?, pdfPath?, sheetUrl? }`

## Sessions (Phase 2 foundation)

### `POST /api/v1/sessions`

Log a workout session.

**Body:** `{ email, week, day, exercise, sets: [{ weight, reps, rpe?, rir? }] }`

### `GET /api/v1/sessions?email=`

List sessions for an email.

## Planned endpoints (not implemented)

```
PATCH  /api/v1/intake/:id          # Save questionnaire progress
POST   /api/v1/intake/:id/submit   # Separate submit step
GET    /api/v1/users/:id/prs         # PR history
POST   /api/v1/programs/import     # Sheet import
```

## Error format

```json
{ "error": "message" }
// or Zod flatten:
{ "error": { "fieldErrors": {}, "formErrors": [] } }
```

## Rate limiting

Not implemented Phase 1. Target: 100 req/min public, 1000 admin (Upstash Redis).

## Related

- [data-model.md](data-model.md)
- [../operations/runbook-local-dev.md](../operations/runbook-local-dev.md)
