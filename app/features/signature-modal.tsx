import { FormEvent, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { wrapForSuspense } from "~/utils/react";
import * as signature from "~/models/signature";
import type Konva from "konva";
const importDraw = wrapForSuspense(() =>
  import("~/features/draw").then(({ default: draw }) => draw)
);

type CreateSignatureProps = {
  onSubmit?: () => void;
};
function CreateSignature(props: CreateSignatureProps) {
  const [count, setCount] = useState(0);
  const [hasDraw, setHasDraw] = useState(false);
  const [stage, setStage] = useState<Konva.Stage>();
  const ref = useRef<HTMLDivElement>(null);
  const draw = importDraw();

  useEffect(() => {
    if (!ref.current) return;
    const { cleanup, stage } = draw({
      container: ref.current,
      setHasDraw,
    });
    setStage(stage);
    return () => cleanup();
  }, [draw, setStage, count]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const blob = await stage?.toBlob();
    if (!(blob instanceof Blob)) return;

    await signature.insertOne(
      new File([blob], "signature.png", { type: "image/png" })
    );

    props.onSubmit?.();
  }

  return (
    <form
      onSubmit={onSubmit}
      className={clsx("h-[18rem] w-[36rem]", "rounded bg-white p-4 shadow")}
    >
      <div className="flex h-full flex-col">
        <div key={count} className="flex-1 border" ref={ref} />

        <div className="mt-4">
          <button
            type="reset"
            className="border py-2 px-4"
            onClick={() => setCount(count + 1)}
          >
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

const trigger = "flex w-full border py-2 px-4";
const overlay = "fixed inset-0 bg-slate-500/50";
const content = "fixed inset-0 grid place-content-center";
function Model() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={trigger}>Signature</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />;
        <Dialog.Content className={content}>
          <CreateSignature onSubmit={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Model;
