import db from "~/models/indexeddb";
import type { Signature } from "~/models/types";

/**
 * insert one signature into database
 * @param url signature
 * @returns uuid
 */
export async function insertOne(url: string): Promise<Signature["id"]> {
  return db.signature.add({
    id: url,
    file: url,
    created_at: new Date(),
  });
}

export async function getAll(): Promise<Signature[]> {
  return db.signature.toArray();
}

export async function getByID(id: string): Promise<Signature> {
  const found = await db.signature.get(id);

  if (!found) throw new Error(`${id} doesn't exist in signature repository`);

  return found;
}
