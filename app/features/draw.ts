import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

type DrawProps = {
  container: HTMLDivElement;
  setHasDraw: (flag: boolean) => void;
};
function draw({ container, setHasDraw }: DrawProps) {
  const { width, height } = container.getBoundingClientRect();

  const stage = new Konva.Stage({
    container,
    width,
    height,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  let isPaint = false;
  let line: Konva.Line;

  function pointerdown() {
    isPaint = true;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    line = new Konva.Line({
      stroke: "#df4b26",
      strokeWidth: 5,
      globalCompositeOperation: "source-over",
      lineCap: "round",
      lineJoin: "round",
      points: [pos.x, pos.y, pos.x, pos.y],
    });
    layer.add(line);

    setHasDraw(true);
  }
  function pointerup() {
    isPaint = false;
  }
  function pointermove(e: KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!isPaint) return;
    e.evt.preventDefault();

    const pos = stage.getPointerPosition();
    if (!pos) return;
    const newPoints = line.points().concat([pos.x, pos.y]);
    line.points(newPoints);
  }

  stage.on("mousedown touchstart", pointerdown);
  stage.on("mouseup touchend", pointerup);
  stage.on("mousemove touchmove", pointermove);

  function cleanup() {
    stage.off("mousedown touchstart", pointerdown);
    stage.off("mouseup touchend", pointerup);
    stage.off("mousemove touchmove", pointermove);
  }

  return { cleanup, stage };
}

export default draw;
