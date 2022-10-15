/**
 * SHA-256 are novel hash functions
 * @param message original message
 * @returns hash string with 64 characters
 */
export async function sha256(message: string) {
  const msg_uint8 = new TextEncoder().encode(message);

  const hash_buffer = await crypto.subtle.digest("SHA-256", msg_uint8);

  return Array.from(new Uint8Array(hash_buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
