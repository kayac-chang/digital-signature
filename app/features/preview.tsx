import * as PDF from "~/models/pdf";
import {
  getDocument,
  GlobalWorkerOptions,
  RenderingCancelledException,
  RenderTask,
} from "pdfjs-dist";
import { toDataURL } from "~/utils/blob";
import { wrapForSuspense } from "~/utils/react";
import { prop, range } from "ramda";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import clsx from "clsx";
import Konva from "konva";

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

type RenderPDFProps = {
  page: PDFPageProxy;
  stage: Konva.Stage;
  ctx: CanvasRenderingContext2D;
};
function renderPDF({ page, stage, ctx }: RenderPDFProps) {
  let task: RenderTask;
  return function resize() {
    task?.cancel();
    const container = stage.container();
    const viewport = page.getViewport({
      scale:
        container.getBoundingClientRect().width /
        page.getViewport({ scale: 1.0 }).width,
    });
    stage.size({
      width: viewport.width,
      height: viewport.height,
    });
    task = page.render({
      viewport,
      canvasContext: ctx,
    });
    task.promise.catch((error) => {
      if (error instanceof RenderingCancelledException) return;
      console.error(error);
    });
  };
}

type RenderImageFn = (image: HTMLImageElement) => void;
type CanvasProps = {
  page: PDFPageProxy;
  onPointerStart?: (render: RenderImageFn) => Promise<void> | void;
};
function Canvas({ page, onPointerStart }: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Konva.Stage>();

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    const viewport = page.getViewport({
      scale:
        container.getBoundingClientRect().width /
        page.getViewport({ scale: 1.0 }).width,
    });
    const layer = new Konva.Layer();

    const stage = new Konva.Stage({
      container,
      width: viewport.width,
      height: viewport.height,
    });
    setStage(stage);

    stage.add(layer);
    const ctx = layer.getContext()._context;
    const resize = renderPDF({ page, stage, ctx });

    resize();

    window.addEventListener("resize", resize);
    return () => {
      stage.clear();
      setStage(undefined);
      window.removeEventListener("resize", resize);
    };
  }, [setStage]);

  useEffect(() => {
    if (!stage || !onPointerStart) return;

    function onStart() {
      function render(image: HTMLImageElement) {
        const layer = new Konva.Layer();
        layer.add(
          new Konva.Image({
            image,
            width: image.width,
            height: image.height,
            draggable: true,
          })
        );
        stage?.add(layer);
      }
      onPointerStart?.(render);
    }

    stage.on("mousedown touchstart", onStart);
    return () => {
      stage.off("mousedown touchstart", onStart);
    };
  }, [stage, onPointerStart]);

  return <div ref={ref} />;
}

type PreviewProps = {
  file: string;
  className?: string;
  onPointerStart?: CanvasProps["onPointerStart"];
};
function Preview({ file, className, onPointerStart }: PreviewProps) {
  const pages: PDFPageProxy[] = loadPages(file);
  return (
    <ul
      className={clsx("mx-auto flex max-w-screen-md flex-col gap-8", className)}
    >
      {pages.map((page) => (
        <li key={file + page.pageNumber} className="m-1 border">
          <Canvas page={page} onPointerStart={onPointerStart} />
        </li>
      ))}
    </ul>
  );
}

export default Preview;
