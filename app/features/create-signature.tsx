import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import * as signature from "~/models/signature";
import draw from "~/features/draw";
import Konva from "konva";
import type { FormEvent } from "react";

type SignatureProps = {
  onSubmit?: () => void;
};
function CreateSignature(props: SignatureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Konva.Stage>();
  const [hasDraw, setDraw] = useState(false);

  useEffect(() => {
    if (stage) return draw(stage);
  }, [stage]);

  useEffect(() => {
    const onPointerStart = () => setDraw(true);
    stage?.on("mousedown touchstart", onPointerStart);
    return () => {
      stage?.off("mousedown touchstart", onPointerStart);
    };
  }, [stage, setDraw]);

  useEffect(() => {
    onReset();
  }, []);

  function onReset() {
    if (!ref.current) return;

    const container = ref.current;
    const { width, height } = container.getBoundingClientRect();
    stage?.clear();
    setStage(
      new Konva.Stage({
        container,
        width,
        height,
      })
    );
    setDraw(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const url = stage?.toDataURL();
    if (!url) return;

    await signature.insertOne(url);
    props.onSubmit?.();
  }

  return (
    <form
      onReset={onReset}
      onSubmit={onSubmit}
      className={clsx("h-[18rem] w-[36rem]", "rounded bg-white p-4 shadow")}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 border" ref={ref} />

        <div className="mt-4">
          <button type="reset" className="border py-2 px-4">
            Reset
          </button>

          <button
            type="submit"
            className="border py-2 px-4"
            disabled={!hasDraw}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreateSignature;
