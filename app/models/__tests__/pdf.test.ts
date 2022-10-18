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
        "48d6e3b0b711b38894579b34a29f73e4b103a4cc5b199c8edffe5ed64bb7e338";

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
