import { describe, expect, it } from "vitest";
import { validateFaq } from "./validation";
function form(values: Record<string, string>) { const data = new FormData(); Object.entries(values).forEach(([key, value]) => data.set(key, value)); return data; }
describe("FAQ validation", () => {
  it("trims and accepts valid fields", () => expect(validateFaq(form({ question: "  Posso agendar? ", answer: " Sim. ", sortOrder: "2", isPublished: "on" })).values).toEqual({ question: "Posso agendar?", answer: "Sim.", sort_order: 2, is_published: true }));
  it("rejects empty, oversized and negative values", () => { expect(validateFaq(form({ question: " ", answer: " ", sortOrder: "-1" })).fieldErrors).toMatchObject({ question: expect.any(String), answer: expect.any(String), sortOrder: expect.any(String) }); expect(validateFaq(form({ question: "x".repeat(301), answer: "ok", sortOrder: "0" })).fieldErrors.question).toBeTruthy(); });
});
