import { describe, expect, it } from "vitest";
import { DEFAULT_IMAGE_POSITION, imageObjectPosition, parseImagePosition, safeImagePosition } from "./image-position";

describe("image positioning", () => {
  it("defaults invalid or missing coordinates to center", () => { expect(safeImagePosition(null, 101)).toEqual(DEFAULT_IMAGE_POSITION); });
  it.each([[0, 0], [100, 100], [25, 75]])("accepts valid integer coordinates %i/%i", (x, y) => { expect(parseImagePosition(x, y)).toEqual({ x, y }); });
  it.each([[-1, 50], [101, 50], [50.5, 50], [50, "invalid"]])("rejects invalid coordinates", (x, y) => { expect(parseImagePosition(x, y)).toBeNull(); });
  it("formats CSS object-position", () => { expect(imageObjectPosition({ x: 25, y: 75 })).toBe("25% 75%"); });
});
