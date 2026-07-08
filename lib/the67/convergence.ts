export interface Point {
  x: number;
  y: number;
}

export function sampleTextPoints(
  text: string,
  width: number,
  height: number,
  fontSize: number,
  step = 5,
): Point[] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);
  ctx.font = `300 ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: Point[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4;
      if (data[index] > 128) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

export function assignTargets(
  particleCount: number,
  points: Point[],
): Point[] {
  if (points.length === 0) {
    return Array.from({ length: particleCount }, () => ({ x: 0, y: 0 }));
  }

  return Array.from({ length: particleCount }, (_, i) => {
    return points[i % points.length];
  });
}
