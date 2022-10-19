import * as PDF from "~/models/pdf";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { toDataURL } from "~/utils/blob";
import { wrapForSuspense } from "~/utils/react";
import { prop, range } from "ramda";
import invariant from "tiny-invariant";
import { useEffect, useRef } from "react";
import { debounce } from "ts-debounce";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import type { RefObject } from "react";
import clsx from "clsx";

GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

function toDocument(url: string) {
  return getDocument(url).promise;
}
function getAllPagesFromDocument(document: PDFDocumentProxy) {
  return Promise.all(
    range(1, document.numPages).map(document.getPage.bind(document))
  );
}

const loadPages = wrapForSuspense((id: string) =>
  PDF.getByID(id)
    .then(prop("file"))
    .then(toDataURL)
    .then(toDocument)
    .then(getAllPagesFromDocument)
);

function render(page: PDFPageProxy, ref: RefObject<HTMLDivElement>) {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");

  let isRendering = false;
  const mount = debounce(() => {
    if (!ref.current || isRendering) return;
    const container = ref.current;

    invariant(canvasContext);
    const viewport = page.getViewport({
      scale:
        container.getBoundingClientRect().width /
        page.getViewport({ scale: 1.0 }).width,
    });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    isRendering = true;
    page
      .render({ viewport, canvasContext })
      .promise.then(() => container.append(canvas))
      .then(() => (isRendering = false));
  }) as () => void;

  return () => {
    mount();
    window.addEventListener("resize", mount);
    return () => void window.removeEventListener("resize", mount);
  };
}

type CanvasProps = {
  page: PDFPageProxy;
};
function Canvas({ page }: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(render(page, ref), []);
  return <div ref={ref} />;
}

type PreviewProps = {
  file: string;
  className?: string;
};
function Preview({ file, className }: PreviewProps) {
  const pages: PDFPageProxy[] = loadPages(file);
  return (
    <ul
      className={clsx("mx-auto flex max-w-screen-md flex-col gap-8", className)}
    >
      {pages.map((page) => (
        <li key={file + page.pageNumber} className="m-1 border">
          <Canvas page={page} />
        </li>
      ))}
    </ul>
  );
}

export default Preview;
