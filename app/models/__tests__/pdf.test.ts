import "fake-indexeddb/auto";
import client from "~/models/indexeddb";
import { insertOne } from "~/models/pdf";
import { toArrayBuffer } from "~/utils/blob";

describe("pdf", () => {
  describe("insertOne", () => {
    test("should be create one record in db", async () => {
      const file = new File(["hello"], "foo.pdf", {
        type: "application/pdf",
        lastModified: 1,
      });
      const hash =
        "b29f29e5a6f42880b83c95e38a2b51c0d8dc4c438df13d39898f97491fac2d89";

      await insertOne(file);

      const found = await client
        .table("pdf")
        .where("name")
        .equals("foo.pdf")
        .first();

      expect(found).toBeTruthy();
      expect(found).toHaveProperty("id", hash);
      expect(found).toHaveProperty("file", await toArrayBuffer(file));
    });
  });
});
