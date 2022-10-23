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

const getAllSignatures = wrapForSuspense(signature.getAll);

function SelectSignature() {
  const signatures = getAllSignatures();
  return (
    <form
      className={clsx("h-[18rem] w-[36rem]", "rounded bg-white p-4 shadow")}
    >
      <div className="flex h-full flex-col">
        {signatures.map((signature) => (
          <div
            className="flex-1 border"
            key={signature.id}
            ref={async (ref) => {
              if (!ref) return;

              const { width, height } = ref.getBoundingClientRect();

              const stage = new Konva.Stage({
                container: ref,
                width,
                height,
              });

              const layer = new Konva.Layer();

              const image = await createImage(signature.file);

              layer.add(
                new Konva.Image({
                  image,
                  width: image.width,
                  height: image.height,
                })
              );

              stage.add(layer);
            }}
          />
        ))}
      </div>
    </form>
  );
}

export default SelectSignature;
