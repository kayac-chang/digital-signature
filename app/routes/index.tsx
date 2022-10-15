import type { ChangeEvent } from "react";
import upload from "~/features/upload";

const uploadSignature = upload("pdf");

export default function Index() {
  const onUploadSuccess = console.log;
  const onUploadFailed = console.error;

  const onChange = (event: ChangeEvent) =>
    uploadSignature(event).then(onUploadSuccess).catch(onUploadFailed);

  return (
    <main>
      <input type="file" multiple onChange={onChange} />
    </main>
  );
}
