import { toArrayBuffer } from "~/utils/blob";
import { generateID, create } from "~/models/file";
import db from "~/models/indexeddb";
import type { PDF } from "~/models/types";

db.version(1).stores({
  pdf: `id, name`,
});

/**
 * insert one PDF into database
 * @param file PDF
 * @returns uuid
 */
export async function insertOne(file: File): Promise<PDF["id"]> {
  return db.pdf.add({
    id: await generateID(file),
    type: file.type,
    name: file.name,
    file: await toArrayBuffer(file),
    created_at: new Date(file.lastModified),
  });
}

export async function getByID(id: string): Promise<PDF> {
  const found = await db.pdf.get(id);

  if (!found) throw new Error(`${id} doesn't exist in pdf repository`);

  const file = create(found);

  return { ...found, file };
}
