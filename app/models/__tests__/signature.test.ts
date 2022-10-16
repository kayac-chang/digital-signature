import "fake-indexeddb/auto";
import client from "~/clients/indexeddb";
import { insertOne, generateID } from "~/models/signature";
import { toArrayBuffer } from "~/utils/blob";

describe("signature", () => {
  describe("generateID", () => {
    test("should be match hash", async () => {
      const file = new File(["hello"], "foo.png", {
        type: "image/png",
        lastModified: 1,
      });
      const hash =
        "a9e14d428348f62305bf48ad313101e4f3e41ff837928f375ca3b2f5b099f4e4";
      expect(await generateID(file)).toBe(hash);
    });
  });

  describe("insertOne", () => {
    test("should be create one record in db", async () => {
      const file = new File(["hello"], "foo.png", {
        type: "image/png",
        lastModified: 1,
      });
      const hash =
        "a9e14d428348f62305bf48ad313101e4f3e41ff837928f375ca3b2f5b099f4e4";

      await insertOne(file);

      const found = await client
        .table("signatures")
        .where("name")
        .equals("foo.png")
        .first();

      expect(found).toBeTruthy();
      expect(found).toHaveProperty("id", hash);
      expect(found).toHaveProperty("file", await toArrayBuffer(file));
    });
  });
});
