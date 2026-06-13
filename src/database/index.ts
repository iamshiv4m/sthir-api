import { randomUUID } from "crypto";
import type { Database } from "../domain/types";
import * as blobStore from "./blob";
import * as fileStore from "./json-file";
import * as pgStore from "./postgres";

export type DbBackend = "postgres" | "blob" | "file";

export function getDbBackend(): DbBackend {
  if (process.env.DATABASE_URL) return "postgres";
  if (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_STORE_ID ||
    process.env.VERCEL
  ) {
    return "blob";
  }
  return "file";
}

function store() {
  switch (getDbBackend()) {
    case "postgres":
      return pgStore;
    case "blob":
      return blobStore;
    default:
      return fileStore;
  }
}

export async function readDb(): Promise<Database> {
  return store().readDb();
}

export async function writeDb(db: Database): Promise<void> {
  await store().writeDb(db);
}

export async function updateDb(
  updater: (db: Database) => Database | void
): Promise<Database> {
  const db = await readDb();
  const result = updater(db);
  const next = (result ?? db) as Database;
  await writeDb(next);
  return next;
}

export function newId(): string {
  return randomUUID();
}

export async function auditLog(
  entity: string,
  entityId: string,
  action: string,
  actorId: string,
  diff?: Record<string, unknown>
) {
  await updateDb((db) => {
    db.auditLogs.push({
      id: newId(),
      entity,
      entityId,
      action,
      actorId,
      timestamp: new Date().toISOString(),
      diff,
    });
  });
}
