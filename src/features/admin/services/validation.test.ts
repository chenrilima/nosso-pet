import { describe, expect, it } from "vitest";
import { validateService } from "./validation";
function form(overrides: Record<string, string> = {}) { const data = new FormData(); Object.entries({ name: "Banho", iconKey: "bath", pricingType: "quote", price: "", priceFrom: "", sortOrder: "0", ...overrides }).forEach(([key, value]) => data.set(key, value)); return data; }
describe("service validation", () => {
  it("creates a quote and clears incompatible prices", () => expect(validateService(form({ price: "10", priceFrom: "20" })).values).toMatchObject({ slug: "banho", pricing_type: "quote", price: null, price_from: null }));
  it("accepts fixed and normalizes its price", () => expect(validateService(form({ pricingType: "fixed", price: "49,9", priceFrom: "20" })).values).toMatchObject({ price: "49.90", price_from: null }));
  it("requires the fixed price", () => expect(validateService(form({ pricingType: "fixed" })).fieldErrors.price).toBe("Informe o preço fixo."));
  it("accepts starting-at and clears fixed price", () => expect(validateService(form({ pricingType: "starting_at", price: "30", priceFrom: "20" })).values).toMatchObject({ price: null, price_from: "20.00" }));
  it("requires the starting-at price", () => expect(validateService(form({ pricingType: "starting_at" })).fieldErrors.priceFrom).toBeTruthy());
  it("rejects arbitrary icons but preserves an existing unknown key", () => { expect(validateService(form({ iconKey: "evil" })).fieldErrors.iconKey).toBeTruthy(); expect(validateService(form({ iconKey: "legacy_icon" }), "legacy_icon").values?.icon_key).toBe("legacy_icon"); });
  it("turns bookable off when inactive", () => { const data = form(); data.set("isBookable", "on"); expect(validateService(data).values?.is_bookable).toBe(false); });
  it("supports status, bookable and ordering without writing unused fields", () => { const data = form({ sortOrder: "4" }); for (const key of ["isActive", "isBookable"]) data.set(key, "on"); const values = validateService(data).values; expect(values).toMatchObject({ is_active: true, is_bookable: true, sort_order: 4 }); expect(values).not.toHaveProperty("duration_minutes"); expect(values).not.toHaveProperty("is_featured"); });
});
