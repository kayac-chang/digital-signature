import type Konva from "konva";
import { Suspense, useRef, useState } from "react";
import * as signature from "~/models/signature";
import preview from "~/features/preview";
import { wrapForSuspense } from "~/utils/react";

const previewSignature = wrapForSuspense(preview("signature"));

async function render(container: HTMLDivElement) {
  const { default: Konva } = await import("konva");
  const { default: draw } = await import("~/features/draw");

  const { width, height } = container.getBoundingClientRect();
  const stage = new Konva.Stage({ container, width, height });

  const layer = new Konva.Layer();
  stage.add(layer);

  const service = draw({
    getPosition: () => stage.getPointerPosition(),
    createContext: () => {
      const position = stage.getPointerPosition();
      if (!position) return;

      const line = new Konva.Line({
        stroke: "#df4b26",
        strokeWidth: 5,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [position.x, position.y, position.x, position.y],
      });
      layer.add(line);
      return line;
    },
  });
  service.update(({ state, context: line }) => {
    if (state.status === "drawing" && line) {
      line.points(
        line.points().concat([state.position.x, state.position.y])
        //
      );
    }
  });
  stage.on("mousedown touchstart", service.onPointerStart);
  stage.on("mouseup touchend", service.onPointerEnd);
  stage.on("mousemove touchmove", service.onPointerMove);

  return stage;
}
export default function Index() {
  const width = 512;
  const height = 512 * (3 / 4);

  const stageRef = useRef<Konva.Stage>();
  const [fileid, setFileID] = useState<string>();

  async function ref(ref: HTMLDivElement | null) {
    if (stageRef.current) return;
    if (ref) stageRef.current = await render(ref);
  }

  async function onSave() {
    const stage = stageRef.current;
    if (!stage) return;

    const blob = (await stage.toBlob()) as Blob;
    const fileid = await signature.insertOne(
      new File([blob], "signature.png", { type: "image/png" })
    );

    setFileID(fileid);
  }

  return (
    <main className="grid w-screen place-items-center">
      <div className="rounded border" style={{ width, height }} ref={ref} />
      <button onClick={onSave}>save</button>

      {fileid && (
        <Suspense>
          <canvas
            width={width}
            height={height}
            ref={previewSignature(fileid)}
          />
        </Suspense>
      )}
    </main>
  );
}
