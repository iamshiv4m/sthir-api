# ADR-0002: JSON File Store Bootstrap

## Status

Accepted (2026-06-14)

## Context

Phase 1 needs persistence immediately for concierge beta and MVP development. Setting up PostgreSQL (Neon), Prisma migrations, and connection pooling adds 2–3 days before first paid program can flow through the system. Expected volume: <80 programs in first 3 months, single reviewer, low concurrency.

## Decision

Use a **JSON file store** at `data/db.json` for Phase 1 bootstrap:

- Implemented in `src/lib/db/index.ts` with `readDb`, `writeDb`, `updateDb`
- Types in `src/lib/types.ts` define the schema
- File gitignored; seed via `pnpm seed`
- Document PostgreSQL migration path in `data-model.md`

**Migration trigger:** 80+ paid programs OR concurrent write race conditions OR need for SQL reporting/backup PITR.

## Consequences

**Positive:**
- Zero database provisioning for local dev and early deploy
- Full schema visibility in TypeScript types
- Easy manual inspection/debugging of intakes
- Matches concierge manual phase (founder can edit JSON if needed)

**Negative:**
- No concurrent write safety (last-write-wins)
- No transactions across entities
- No indexed queries — full file read each request
- Not suitable for production at scale
- Backup = manual file copy

## Migration plan (when triggered)

1. Add Prisma schema matching `Database` type
2. Set `DATABASE_URL` (Neon)
3. One-time migration script: JSON → PostgreSQL
4. Swap `src/lib/db` implementation behind same interface
5. Add ADR-0004 documenting migration completion

## Alternates considered

| Option | Verdict |
|--------|---------|
| PostgreSQL from day 1 | Deferred — correct long-term, slow for bootstrap |
| SQLite file | Considered — adds native dep on Vercel; JSON simpler |
| Supabase | Deferred — vendor lock-in before product validation |

## Related

- [../data-model.md](../data-model.md)
- `.env.example` — `DATABASE_URL` placeholder
