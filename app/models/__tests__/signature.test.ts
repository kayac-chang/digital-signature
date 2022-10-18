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
        "c3d81689bdd47f2248fe1f3c42ae07771a839dfcb6b0c4cb876e9133850bd1fe";

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
