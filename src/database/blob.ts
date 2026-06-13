import { get, put } from "@vercel/blob";
import type { Database } from "../domain/types";
import { EMPTY_DB } from "./json-file";

const BLOB_PATH = "sthir/db.json";

function blobOptions() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return token
    ? ({ access: "private" as const, token })
    : ({ access: "private" as const });
}

async function parseStream(stream: ReadableStream<Uint8Array>): Promise<Database> {
  const text = await new Response(stream).text();
  const data = JSON.parse(text) as Partial<Database>;
  return { ...EMPTY_DB, ...data };
}

export async function readDb(): Promise<Database> {
  try {
    const result = await get(BLOB_PATH, blobOptions());
    if (!result || result.statusCode === 304 || !result.stream) {
      return structuredClone(EMPTY_DB);
    }
    return parseStream(result.stream);
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

export async function writeDb(db: Database): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(db, null, 2), {
    ...blobOptions(),
    addRandomSuffix: false,
  });
}
