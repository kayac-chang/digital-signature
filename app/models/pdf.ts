import { toArrayBuffer, toBase64 } from "~/utils/blob";
import client from "~/clients/indexeddb";
import { sha256 } from "~/utils/hash";
import type { Table } from "dexie";
import type { Model } from "~/types";

type PDF = Model.File;
type DB = typeof client & {
  pdf: Table<PDF, string>;
};

const db = client as DB;
db.version(1).stores({
  pdf: `id, name, file, created_at`,
});

export async function generateID(file: File): Promise<PDF["id"]> {
  return sha256(
    JSON.stringify({
      name: file.name,
      file: await toBase64(file),
      date: file.lastModified,
    })
  );
}

/**
 * insert one PDF into database
 * @param file PDF
 * @returns uuid
 */
export async function insertOne(file: File): Promise<PDF["id"]> {
  return db.pdf.add({
    id: await generateID(file),
    name: file.name,
    file: await toArrayBuffer(file),
    created_at: new Date(file.lastModified),
  });
}
