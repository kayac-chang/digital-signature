import { Suspense, useState } from "react";
import upload from "~/features/upload";
import preview from "~/features/preview";
import { wrapForSuspense } from "~/utils/react";
import type { ChangeEvent , DragEvent} from "react";

const uploadPDF = upload("pdf");
const previewPDF = wrapForSuspense(preview("pdf"));

function prevent(event: DragEvent) {
  event.stopPropagation();
  event.preventDefault();
}

type DropboxProps = {
  onChange?: (event: ChangeEvent | DragEvent) => void;
};
function Dropbox(props: DropboxProps) {
  const onChange = props.onChange;

  function onDrop(event: DragEvent) {
    prevent(event);
    props.onChange?.(event);
  }
  return (
    <label
      className="grid h-96 w-full max-w-xl place-items-center border"
      onDragEnter={prevent}
      onDragOver={prevent}
      onDrop={onDrop}
    >
      <span>Choose a file or drag it here</span>
      <input
        accept="application/pdf"
        type="file"
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}

export default function Index() {
  const [fileid, setFileID] = useState<string>();
  const onUploadSuccess = setFileID;
  const onUploadFailed = console.error;
  const onChange = (event: ChangeEvent | DragEvent) =>
    uploadPDF(event).then(onUploadSuccess).catch(onUploadFailed);

  return (
    <main className="grid h-screen w-screen place-items-center">
      <Dropbox onChange={onChange} />

      {fileid && (
        <Suspense>
          <canvas ref={previewPDF(fileid)} />
        </Suspense>
      )}
    </main>
  );
}
