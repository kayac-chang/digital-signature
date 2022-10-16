type Execute = (reader: FileReader) => void;
function readBlob<T extends FileReader["result"]>(exec: Execute): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => resolve(reader.result as T));
    reader.addEventListener("error", reject);
    exec(reader);
  });
}

/**
 * convert file/blob into array buffer
 * @param blob a file-like object of immutable, raw data
 * @returns promise of array buffer
 */
export async function toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return readBlob<ArrayBuffer>((reader) => reader.readAsArrayBuffer(blob));
}

/**
 * convert file/blob into base64 data url
 * @param blob a file-like object of immutable, raw data
 * @returns promise of base64 data url
 */
export async function toDataURL(blob: Blob): Promise<string> {
  return readBlob<string>((reader) => reader.readAsDataURL(blob));
}

function removeDataURLPrefix(dataurl: string): string {
  return dataurl.replace(/data:.*;base64,/, "");
}

/**
 * convert file/blob into base64 string
 * @param blob a file-like object of immutable, raw data
 * @returns promise of base64 string
 */
export async function toBase64(blob: Blob): Promise<string> {
  return toDataURL(blob).then(removeDataURLPrefix);
}
