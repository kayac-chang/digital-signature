import "fake-indexeddb/auto";
import client from "~/clients/indexeddb";
import { generateID, insertOne } from "~/models/pdf";
import { toArrayBuffer } from "~/utils/blob";

describe("pdf", () => {
  describe("generateID", () => {
    test("should be match hash", async () => {
      const file = new File(["hello"], "foo.pdf", {
        type: "application/pdf",
        lastModified: 1,
      });
      const hash =
        "1bc886d262df49e3770dd3b883293416d4bd0f642593289060151acd22f6ae90";
      expect(await generateID(file)).toBe(hash);
    });
  });

  describe("insertOne", () => {
    test("should be create one record in db", async () => {
      const file = new File(["hello"], "foo.pdf", {
        type: "application/pdf",
        lastModified: 1,
      });
      const hash =
        "1bc886d262df49e3770dd3b883293416d4bd0f642593289060151acd22f6ae90";

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
