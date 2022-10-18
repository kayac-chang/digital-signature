import type { Model } from "~/models/types";
import { sha256 } from "~/utils/hash";
import { toBase64 } from "~/utils/blob";

export async function generateID(file: File): Promise<Model.File["id"]> {
  return sha256(
    JSON.stringify({
      type: file.type,
      name: file.name,
      file: await toBase64(file),
      date: file.lastModified,
    })
  );
}

export function clone(file: File): File {
  return new File([file], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
}

interface CreateFileProps {
  name: string;
  type: string;
  created_at: Date;
  file: File | ArrayBuffer;
}
export function create(file: CreateFileProps): File {
  return new File([file.file], file.name, {
    type: file.type,
    lastModified: file.created_at.valueOf(),
  });
}
