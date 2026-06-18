#!/usr/bin/env tsx
/**
 * Clear test intakes, waitlist, and programs for a fresh founding cohort launch.
 * Keeps gym partners and concierge slots from seed.
 *
 * Local:  pnpm reset-launch
 * Prod:   DATABASE_URL="postgresql://..." pnpm reset-launch
 */
import { readDb, writeDb } from '../src/database';

async function main() {
  const db = await readDb();
  const before = {
    intakes: db.intakes.length,
    waitlist: db.waitlist.length,
    programs: db.programs.length,
  };

  db.waitlist = [];
  db.intakes = [];
  db.programs = [];
  db.sessions = [];
  db.prs = [];
  db.auditLogs = [];

  await writeDb(db);

  console.log('Launch reset complete:');
  console.log(`  intakes:  ${before.intakes} → 0`);
  console.log(`  waitlist: ${before.waitlist} → 0`);
  console.log(`  programs: ${before.programs} → 0`);
  console.log(`  gym partners kept: ${db.gymPartners.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
