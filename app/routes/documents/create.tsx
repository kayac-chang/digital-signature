import type { FormEvent } from "react";
import { withZod } from "@remix-validated-form/with-zod";
import { object } from "zod";
import type { z } from "zod";
import { text, file } from "zod-form-data";

import * as PDF from "~/models/pdf";
import * as FILE from "~/models/file";
import invariant from "tiny-invariant";
import { useNavigate } from "@remix-run/react";

const schema = object({
  name: text(),
  file: file(),
});
const validator = withZod(schema);
type Data = z.infer<typeof schema>;

async function validate(form: HTMLFormElement) {
  const result = await validator.validate(new FormData(form));
  if (result.error) {
    throw result.error;
  }
  return result.data;
}

async function upload(data: Data) {
  return PDF.insertOne(
    FILE.create({
      ...data,
      type: "application/pdf",
      created_at: new Date(),
    })
  );
}

function Route() {
  const navigate = useNavigate();
  const onSubmit = (e: FormEvent<HTMLFormElement>) =>
    Promise.resolve(e)
      .then((event) => {
        event.preventDefault();
        invariant(event.target instanceof HTMLFormElement);
        return event.target;
      })
      .then(validate)
      .then(upload)
      .then((id) => navigate(`/documents/${id}`))
      .catch(console.error);

  return (
    <main>
      {/* title */}
      <h1>Upload Document</h1>

      <form method="post" encType="multipart/form-data" onSubmit={onSubmit}>
        {/* name */}
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="off" />
        </div>

        {/* file */}
        <div>
          <label htmlFor="file">File</label>
          <input id="file" name="file" type="file" accept="application/pdf" />
        </div>

        {/* submit */}
        <button type="submit">Next</button>
      </form>
    </main>
  );
}

export default Route;
