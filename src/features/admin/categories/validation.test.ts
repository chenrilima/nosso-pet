import { describe, expect, it } from "vitest";
import { normalizeSlug, validateCategory } from "./validation";

describe("category validation", () => {
  it("generates a safe slug from the name", () => { expect(normalizeSlug(" Rações Premium ")).toBe("racoes-premium"); });
  it("accepts a valid create and status", () => { const data = new FormData(); data.set("name", "Rações"); data.set("sortOrder", "2"); data.set("isActive", "on"); expect(validateCategory(data).values).toEqual({ name: "Rações", slug: "racoes", description: "", sort_order: 2, is_active: true }); });
  it.each(["-1", "1.5", "abc"])("rejects invalid sort order %s", (value) => { const data = new FormData(); data.set("name", "Teste"); data.set("sortOrder", value); expect(validateCategory(data).fieldErrors.sortOrder).toBeTruthy(); });
  it("normalizes an editable slug server-side", () => { const data = new FormData(); data.set("name", "Teste"); data.set("slug", " Meu Slug! "); data.set("sortOrder", "0"); expect(validateCategory(data).values?.slug).toBe("meu-slug"); });
});
