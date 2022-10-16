import "fake-indexeddb/auto";
import client from "~/models/indexeddb";
import { insertOne } from "~/models/signature";
import { toArrayBuffer } from "~/utils/blob";

describe("signature", () => {
  describe("insertOne", () => {
    test("should be create one record in db", async () => {
      const file = new File(["hello"], "foo.png", {
        type: "image/png",
        lastModified: 1,
      });
      const hash =
        "67e4a3d2854a20696491c8cfa0736201cbbd53519985305580c1c83f8d9b02d6";

      await insertOne(file);

      const found = await client
        .table("signature")
        .where("name")
        .equals("foo.png")
        .first();

      expect(found).toBeTruthy();
      expect(found).toHaveProperty("id", hash);
      expect(found).toHaveProperty("file", await toArrayBuffer(file));
    });
  });
});
