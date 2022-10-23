import type { Dexie, Table } from "dexie";

export namespace Model {
  export interface File {
    id?: string;
    type: string;
    name: string;
    file: ArrayBuffer;
    created_at: Date;
  }
}
export type PDF = Omit<Model.File, "file"> & {
  file: File;
};
export type Signature = {
  id: string;
  file: string;
  created_at: Date;
};
export type DB = Dexie & {
  pdf: Table<Model.File, string>;
  signature: Table<Signature, string>;
};
