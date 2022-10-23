import invariant from "tiny-invariant";

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

export function toBlob(dataurl: string) {
  const type = getDataURLMime(dataurl);
  invariant(type, "not valid data url");

  const byteStr = removeDataURLPrefix(dataurl);

  const arraybuffer = new ArrayBuffer(byteStr.length);
  const array = new Uint8Array(arraybuffer);

  for (let i = 0; i < byteStr.length; i++) {
    array[i] = byteStr.charCodeAt(i);
  }

  return new Blob([arraybuffer], { type });
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

function getDataURLMime(dataurl: string): string | undefined {
  return /data:(.*);base64,/.exec(dataurl)?.at(1);
}

/**
 * convert file/blob into base64 string
 * @param blob a file-like object of immutable, raw data
 * @returns promise of base64 string
 */
export async function toBase64(blob: Blob): Promise<string> {
  return toDataURL(blob).then(removeDataURLPrefix);
}
