import * as signature from "~/models/signature";
import * as pdf from "~/models/pdf";
import { toDataURL } from "~/utils/blob";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

const repositories = {
  signature: signature.getByID,
  pdf: pdf.getByID,
};
type FileType = keyof typeof repositories;

function createImage(url: string) {
  const image = new Image();
  image.src = url;
  return Promise.resolve(image);
}

GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");
function createPDF(url: string) {
  return getDocument(url).promise;
}

function renderPDF(pdf: PDFDocumentProxy) {
  return async function init(ref: HTMLCanvasElement | null) {
    const ctx = ref?.getContext("2d");
    if (!ref || !ctx) return;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: window.devicePixelRatio });
    ref.width = viewport.width;
    ref.height = viewport.height;

    page.render({
      canvasContext: ctx,
      viewport,
    });
  };
}

function renderImage(img: HTMLImageElement) {
  return async function init(ref: HTMLCanvasElement | null) {
    const ctx = ref?.getContext("2d");
    if (!ref || !ctx) return;

    ctx.drawImage(img, 0, 0);
  };
}

const deserialize = {
  signature: (url: string) => createImage(url).then(renderImage),
  pdf: (url: string) => createPDF(url).then(renderPDF),
};

function preview(type: FileType) {
  return async function getImage(fileid: string) {
    // get repository depends on file type
    const repository = repositories[type];

    // get file from repository by fileid
    const found = await repository(fileid);

    // convert file to DataURL
    const url = await toDataURL(found.file);

    // handle file depends on file type
    return deserialize[type](url);
  };
}

export default preview;
