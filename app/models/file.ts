import type { Model } from "~/models/types";
import { sha256 } from "~/utils/hash";
import { toBase64 } from "~/utils/blob";

export function generateFileID(type: string) {
  return async function generateID(file: File): Promise<Model.File["id"]> {
    return sha256(
      JSON.stringify({
        type,
        name: file.name,
        file: await toBase64(file),
        date: file.lastModified,
      })
    );
  };
}

export function clone(file: File): File {
  return new File([file], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
}

export function create(file: Model.File): File {
  return new File([file.file], file.name, {
    type: file.type,
    lastModified: file.created_at.valueOf(),
  });
}
