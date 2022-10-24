export function createImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  return new Promise((resolve) =>
    image.addEventListener("load", () => resolve(image))
  );
}
