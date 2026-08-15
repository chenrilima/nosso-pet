import { describe, expect, it } from "vitest";
import { GALLERY_PATH_PATTERN, validateGalleryMetadata } from "./validation";
function form(values: Record<string, string>) { const data = new FormData(); Object.entries(values).forEach(([key, value]) => data.set(key, value)); return data; }
describe("gallery validation", () => {
  it("accepts system paths and rejects traversal/arbitrary paths", () => { expect(GALLERY_PATH_PATTERN.test("gallery/20000000-0000-4000-8000-000000000001.webp")).toBe(true); expect(GALLERY_PATH_PATTERN.test("gallery/../../secret.webp")).toBe(false); expect(GALLERY_PATH_PATTERN.test("products/20000000-0000-4000-8000-000000000001.webp")).toBe(false); });
  it("validates metadata and requires alt text", () => { expect(validateGalleryMetadata(form({ altText: " Cachorro após banho ", caption: "", sortOrder: "1", isPublished: "on" })).values).toMatchObject({ alt_text: "Cachorro após banho", caption: null, sort_order: 1, is_published: true }); expect(validateGalleryMetadata(form({ altText: "", sortOrder: "-2" })).fieldErrors).toMatchObject({ altText: expect.any(String), sortOrder: expect.any(String) }); });
});
