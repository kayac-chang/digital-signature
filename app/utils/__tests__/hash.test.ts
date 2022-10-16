import { sha256 } from "~/utils/hash";

describe("sha256", () => {
  test("should be match hash", async () => {
    const hello_world =
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
    expect(await sha256("hello world")).toBe(hello_world);
  });
});
