import { toArrayBuffer } from "~/utils/blob";
import { create, generateID } from "~/models/file";
import db from "~/models/indexeddb";
import type { Signature } from "~/models/types";

/**
 * insert one signature into database
 * @param file signature
 * @returns uuid
 */
export async function insertOne(file: File): Promise<Signature["id"]> {
  return db.signature.add({
    id: await generateID(file),
    type: file.type,
    name: file.name,
    file: await toArrayBuffer(file),
    created_at: new Date(file.lastModified),
  });
}

export async function getByID(id: string): Promise<Signature> {
  const found = await db.signature.get(id);

  if (!found) throw new Error(`${id} doesn't exist in signature repository`);

  const file = create(found);

  return { ...found, file };
}
