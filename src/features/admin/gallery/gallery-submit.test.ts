import { afterEach, describe, expect, it, vi } from "vitest";
import type { OptimizedImage } from "@/lib/images/optimize-image";
import { prepareGallerySubmission } from "./gallery-submit";

afterEach(() => vi.unstubAllGlobals());

describe("gallery submission", () => {
  it("captures FormData synchronously from the submitted HTML form", () => {
    const form = { tagName: "FORM" } as HTMLFormElement;
    const image = { file: new File([], "pet.webp"), mimeType: "image/webp", originalBytes: 1, optimizedBytes: 1, width: 1, height: 1 } as OptimizedImage;
    const FormDataMock = vi.fn(function (this: { form: HTMLFormElement }, target: HTMLFormElement) { this.form = target; });
    vi.stubGlobal("FormData", FormDataMock);

    const submission = prepareGallerySubmission(form, image);

    expect(FormDataMock).toHaveBeenCalledWith(form);
    expect(submission).toMatchObject({ image, formData: { form } });
  });
});
