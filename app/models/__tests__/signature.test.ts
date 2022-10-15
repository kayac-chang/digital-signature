import "fake-indexeddb/auto";
import client from "~/clients/indexeddb";
import { insertOne } from "~/models/signature";
import { toArrayBuffer } from "~/utils/blob";

describe("signature", () => {
  test("insertOne", async () => {
    const img = new File(["hello"], "foo.png", { type: "image/png" });

    await insertOne(img);

    const found = await client
      .table("signatures")
      .where("name")
      .equals("foo.png")
      .first();

    expect(found).toBeTruthy();
    expect(found).toHaveProperty("file", await toArrayBuffer(img));
  });
});
