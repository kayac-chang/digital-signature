import { toArrayBuffer, toBase64 } from "~/utils/blob";

describe("blob", () => {
  describe("toArrayBuffer", () => {
    test("return type should be array buffer", async () => {
      expect(await toArrayBuffer(new Blob())).toBeInstanceOf(ArrayBuffer);
    });

    test("return array buffer should be same as original", async () => {
      const message = "hello world";
      const buf = await toArrayBuffer(new Blob([message]));
      const testcase = new TextDecoder().decode(buf);
      expect(testcase).toBe(message);
    });
  });

  describe("toBase64", () => {
    test("return type should be string", async () => {
      expect(await toBase64(new Blob())).toBeTypeOf("string");
    });

    test("return string should be same as original", async () => {
      const message = "hello world";
      const testcase = await toBase64(new Blob([message]));
      expect(atob(testcase)).toBe(message);
    });
  });
});
