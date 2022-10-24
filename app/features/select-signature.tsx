import clsx from "clsx";
import Konva from "konva";
import { FormEvent, useState } from "react";
import invariant from "tiny-invariant";
import * as signature from "~/models/signature";
import { wrapForSuspense } from "~/utils/react";
import { createImage } from "~/utils/image";

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

type SelectSignatureProps = {
  onSubmit?: (selected: string) => void;
};
function SelectSignature(props: SelectSignatureProps) {
  const [signature1, signature2] = getAllSignatures();
  const [selected, setSelected] = useState<string>();

  function onChange(event: FormEvent) {
    invariant(event.target instanceof HTMLInputElement);
    setSelected(event.target.value);
  }

  function onSubmit() {
    selected && props.onSubmit?.(selected);
  }

  return (
    <form
      onChangeCapture={onChange}
      onSubmit={onSubmit}
      className={clsx("h-[16rem] w-[28rem]", "rounded bg-white p-4 shadow")}
    >
      <div className="flex flex-1 flex-col">
        {[signature1, signature2].map((signature, index) =>
          signature ? (
            <label className="relative border" key={signature.id}>
              <input
                type="checkbox"
                name="select-signature"
                className="peer hidden"
                value={signature.id}
              />
              <div ref={render(signature.file)} />
              <div className="absolute inset-0 hidden bg-blue-500/20 peer-checked:block" />
            </label>
          ) : (
            <button key={index} className="border">
              create signature
            </button>
          )
        )}
      </div>

      <div>{selected && <button>submit</button>}</div>
    </form>
  );
}

export default SelectSignature;
