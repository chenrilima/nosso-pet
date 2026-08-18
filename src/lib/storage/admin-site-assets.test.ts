import { describe, expect, it, vi } from "vitest";
import type { DatabaseClient } from "@/data/repositories/shared";
import { OPTIMIZED_IMAGE_LIMIT } from "@/lib/images/optimize-image";
import { UploadedImageValidationError, verifyGalleryUpload, verifyHeroUpload } from "./admin-site-assets";

function clientWithInfo(data: Record<string, unknown> | null, error: { status?: number } | null = null) {
  const info = vi.fn().mockResolvedValue({ data, error });
  const client = { storage: { from: vi.fn(() => ({ info })) } } as unknown as DatabaseClient;
  return { client, info };
}

describe("admin site asset validation", () => {
  it.each([
    [verifyGalleryUpload, "gallery/20000000-0000-4000-8000-000000000001.webp"],
    [verifyHeroUpload, "hero/20000000-0000-4000-8000-000000000001.webp"],
  ])("reads exact object metadata for every supported prefix", async (verify, path) => {
    const { client, info } = clientWithInfo({ contentType: "image/webp", size: 42_000 });
    await expect(verify(client, path)).resolves.toBeUndefined();
    expect(info).toHaveBeenCalledWith(path);
  });

  it("accepts transparent PNG output using metadata fallback", async () => {
    const path = "gallery/20000000-0000-4000-8000-000000000001.png";
    const { client } = clientWithInfo({ metadata: { mimetype: "image/png", size: 12_000 } });
    await expect(verifyGalleryUpload(client, path)).resolves.toBeUndefined();
  });

  it.each([
    [{ contentType: "application/octet-stream", size: 100 }, "invalid_mime"],
    [{ contentType: "image/webp", size: OPTIMIZED_IMAGE_LIMIT + 1 }, "invalid_size"],
    [{ contentType: "image/png", size: 100 }, "extension_mismatch"],
  ])("reports the precise metadata failure", async (data, reasonCode) => {
    const { client } = clientWithInfo(data);
    await expect(verifyGalleryUpload(client, "gallery/20000000-0000-4000-8000-000000000001.webp")).rejects.toMatchObject({
      name: UploadedImageValidationError.name,
      validationStep: "storage_metadata",
      reasonCode,
    });
  });

  it("distinguishes a missing object from an inaccessible one", async () => {
    const missing = clientWithInfo(null, { status: 404 });
    await expect(verifyHeroUpload(missing.client, "hero/20000000-0000-4000-8000-000000000001.webp")).rejects.toMatchObject({ reasonCode: "object_missing" });
    const denied = clientWithInfo(null, { status: 403 });
    await expect(verifyHeroUpload(denied.client, "hero/20000000-0000-4000-8000-000000000001.webp")).rejects.toMatchObject({ reasonCode: "object_unavailable" });
  });
});
