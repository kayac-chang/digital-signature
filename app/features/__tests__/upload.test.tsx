import "fake-indexeddb/auto";
import client from "~/clients/indexeddb";
import upload from "~/features/upload";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import type { ChangeEvent } from "react";

describe("upload", () => {
  test("store foo.pdf, should be return uuid", async () => {
    const file = new File(["hello"], "foo.pdf", {
      type: "application/pdf",
      lastModified: 1,
    });

    const fn = vi.fn();
    const handle = upload("pdf");
    const onChange = (event: ChangeEvent) => handle(event).then(fn);
    render(<input type="file" data-testid="file" onChange={onChange} />);

    const input = screen.getByTestId("file") as HTMLInputElement;

    user.setup();
    user.upload(input, file);
    await waitFor(async () =>
      expect(
        await client.table("pdf").where("name").equals("foo.pdf").first()
      ).toBeTruthy()
    );

    const found = await client
      .table("pdf")
      .where("name")
      .equals("foo.pdf")
      .first();
    expect(fn).toHaveBeenCalledWith(found.id);
  });
});
