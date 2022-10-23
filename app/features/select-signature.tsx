import clsx from "clsx";
import Konva from "konva";
import * as signature from "~/models/signature";
import { wrapForSuspense } from "~/utils/react";

function createImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  return new Promise((resolve) =>
    image.addEventListener("load", () => resolve(image))
  );
}

function render(file: string) {
  return async (container: HTMLDivElement | null) => {
    if (!container) return;

    const image = await createImage(file);

    const width = image.width / 2;
    const height = image.height / 2;

    const stage = new Konva.Stage({
      container,
      width,
      height,
    });

    const layer = new Konva.Layer();

    layer.add(
      new Konva.Image({
        image,
        width,
        height,
      })
    );

    stage.add(layer);
  };
}

const getAllSignatures = wrapForSuspense(signature.getAll);

function SelectSignature() {
  const [signature1, signature2] = getAllSignatures();
  return (
    <form className={clsx("rounded bg-white p-4 shadow")}>
      <div className="flex h-full flex-col">
        <div
          className="border"
          key={signature1.id}
          ref={render(signature1.file)}
        />
        <div
          className="border"
          key={signature1.id + "1"}
          ref={render(signature1.file)}
        />
      </div>
    </form>
  );
}

export default SelectSignature;
