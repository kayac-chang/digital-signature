import upload from "~/features/upload";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

describe("upload", () => {
  test("store foo.pdf, should be return uuid", async () => {
    const file = new File(["foo"], "foo.pdf", { type: "application/pdf" });
    vi.mock("~/models/pdf", () => ({
      insertOne: vi.fn(() => "foo.pdf"),
    }));

    const handle = vi.fn(upload("pdf"));
    render(<input type="file" data-testid="file" onChange={handle} />);

    const input = screen.getByTestId("file") as HTMLInputElement;

    user.setup();
    user.upload(input, file);

    expect(handle).toHaveBeenCalledOnce();
    expect(handle).toHaveReturnedWith(file.name);
  });
});
