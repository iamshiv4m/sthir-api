import { neon } from "@neondatabase/serverless";
import type { Database } from "../domain/types";
import { EMPTY_DB } from "./json-file";

const SNAPSHOT_ID = "main";

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS sthir_snapshot (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  schemaReady = true;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function readDb(): Promise<Database> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT payload FROM sthir_snapshot WHERE id = ${SNAPSHOT_ID}
  `;
  if (!rows.length) return structuredClone(EMPTY_DB);
  return { ...EMPTY_DB, ...(rows[0].payload as Database) };
}

export async function writeDb(db: Database): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const payload = JSON.stringify(db);
  await sql`
    INSERT INTO sthir_snapshot (id, payload, updated_at)
    VALUES (${SNAPSHOT_ID}, ${payload}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE
    SET payload = EXCLUDED.payload, updated_at = NOW()
  `;
}
