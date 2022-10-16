import { generateFileID } from "~/models/file";

describe("generateFileID", () => {
  test("should be match hash", async () => {
    const generateID = generateFileID("pdf");

    const file = new File(["hello"], "foo.pdf", {
      type: "application/pdf",
      lastModified: 1,
    });

    const hash =
      "b29f29e5a6f42880b83c95e38a2b51c0d8dc4c438df13d39898f97491fac2d89";

    expect(await generateID(file)).toBe(hash);
  });
});
