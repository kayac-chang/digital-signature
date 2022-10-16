import { toArrayBuffer, toBase64 } from "~/utils/blob";
import { sha256 } from "~/utils/hash";
import client from "~/clients/indexeddb";
import type { Table } from "dexie";
import type { Model } from "~/types";

type Signature = Model.File;
type DB = typeof client & {
  signatures: Table<Signature, string>;
};

const db = client as DB;

db.version(1).stores({
  signatures: `id, name, file, created_at`,
});

export async function generateID(file: File): Promise<Signature["id"]> {
  return sha256(
    JSON.stringify({
      name: file.name,
      file: await toBase64(file),
      date: file.lastModified,
    })
  );
}

/**
 * insert one signature into database
 * @param file signature
 * @returns uuid
 */
export async function insertOne(file: File): Promise<Signature["id"]> {
  return db.signatures.add({
    id: await generateID(file),
    name: file.name,
    file: await toArrayBuffer(file),
    created_at: new Date(file.lastModified),
  });
}
