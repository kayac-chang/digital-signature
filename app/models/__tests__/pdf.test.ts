import "fake-indexeddb/auto";
import client from "~/clients/indexeddb";
import { insertOne } from "~/models/pdf";
import { toArrayBuffer } from "~/utils/blob";

describe("pdf", () => {
  test("insertOne", async () => {
    const pdf = new File(["hello"], "foo.pdf", { type: "application/pdf" });

    await insertOne(pdf);

    const found = await client
      .table("pdf")
      .where("name")
      .equals("foo.pdf")
      .first();

    expect(found).toBeTruthy();
    expect(found).toHaveProperty("file", await toArrayBuffer(pdf));
  });
});
