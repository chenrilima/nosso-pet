import { describe, expect, it } from "vitest";
import { fittedDimensions, ORIGINAL_IMAGE_LIMIT, optimizedFilename, validateImageInput } from "./optimize-image";
describe("image optimization rules", () => {
  it("fits the largest side without upscaling", () => { expect(fittedDimensions(4000, 3000)).toEqual({ width: 1920, height: 1440 }); expect(fittedDimensions(800, 600)).toEqual({ width: 800, height: 600 }); });
  it("uses a coherent safe gallery filename", () => { expect(optimizedFilename("image/webp", "20000000-0000-4000-8000-000000000001")).toBe("gallery/20000000-0000-4000-8000-000000000001.webp"); expect(optimizedFilename("image/png", "20000000-0000-4000-8000-000000000001")).toMatch(/\.png$/); });
  it("supports the explicit product image directory", () => { expect(optimizedFilename("image/webp", "20000000-0000-4000-8000-000000000001", "products")).toBe("products/20000000-0000-4000-8000-000000000001.webp"); });
  it("rejects invalid, empty and oversized inputs", () => { expect(validateImageInput(new File(["x"], "x.gif", { type: "image/gif" }))).toContain("JPEG"); expect(validateImageInput(new File([], "x.png", { type: "image/png" }))).toContain("vazia"); const oversized = { type: "image/jpeg", size: ORIGINAL_IMAGE_LIMIT + 1 } as File; expect(validateImageInput(oversized)).toContain("20 MiB"); });
});
