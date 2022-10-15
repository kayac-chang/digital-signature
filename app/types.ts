export namespace Model {
  export interface File {
    id: string;
    name: string;
    file: ArrayBuffer;
    created_at: Date;
  }
}
