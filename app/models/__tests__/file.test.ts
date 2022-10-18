import { generateID } from "~/models/file";

describe("generateFileID", () => {
  test("should be match hash", async () => {
    const file = new File(["hello"], "foo.pdf", {
      type: "application/pdf",
      lastModified: 1,
    });

    const hash =
      "48d6e3b0b711b38894579b34a29f73e4b103a4cc5b199c8edffe5ed64bb7e338";

    expect(await generateID(file)).toBe(hash);
  });
});
