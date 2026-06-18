import { promises as fs } from "fs";
import path from "path";
import type { Database } from "../domain/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export const EMPTY_DB: Database = {
  waitlist: [],
  intakes: [],
  programs: [],
  sessions: [],
  prs: [],
  gymPartners: [],
  concierge: [],
  auditLogs: [],
  intakeDrafts: [],
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readDb(): Promise<Database> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    return { ...EMPTY_DB, ...JSON.parse(raw) } as Database;
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

export async function writeDb(db: Database): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}
