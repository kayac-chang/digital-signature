import { Suspense, useState } from "react";
import upload from "~/features/upload";
import preview from "~/features/preview";
import { wrapForSuspense } from "~/utils/react";
import type { ChangeEvent } from "react";

const uploadPDF = upload("pdf");
const previewPDF = wrapForSuspense(preview("pdf"));

type PreviewProps = {
  fileID: string;
};
function Preview({ fileID }: PreviewProps) {
  return <canvas ref={previewPDF(fileID)} />;
}

function Spinner() {
  return <>loading</>;
}

export default function Index() {
  const [fileid, setFileID] = useState<string>();

  const onUploadSuccess = setFileID;
  const onUploadFailed = console.error;
  const onChange = (event: ChangeEvent) =>
    uploadPDF(event).then(onUploadSuccess).catch(onUploadFailed);

  return (
    <main>
      <input type="file" onChange={onChange} />

      {fileid && (
        <Suspense fallback={<Spinner />}>
          <Preview fileID={fileid} />
        </Suspense>
      )}
    </main>
  );
}
