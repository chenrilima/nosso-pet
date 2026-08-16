export type ImagePosition = Readonly<{ x: number; y: number }>;

export const DEFAULT_IMAGE_POSITION: ImagePosition = { x: 50, y: 50 };

export function safeImagePosition(x: unknown, y: unknown): ImagePosition {
  return {
    x: Number.isInteger(x) && Number(x) >= 0 && Number(x) <= 100 ? Number(x) : 50,
    y: Number.isInteger(y) && Number(y) >= 0 && Number(y) <= 100 ? Number(y) : 50,
  };
}

export const imageObjectPosition = ({ x, y }: ImagePosition) => `${x}% ${y}%`;

export function parseImagePosition(x: unknown, y: unknown): ImagePosition | null {
  const parsedX = typeof x === "number" ? x : Number(String(x));
  const parsedY = typeof y === "number" ? y : Number(String(y));
  if (!Number.isInteger(parsedX) || !Number.isInteger(parsedY) || parsedX < 0 || parsedX > 100 || parsedY < 0 || parsedY > 100) return null;
  return { x: parsedX, y: parsedY };
}
