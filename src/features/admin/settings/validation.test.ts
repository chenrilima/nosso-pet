import { describe, expect, it } from "vitest";
import { BUSINESS_DAYS, normalizeBrazilianPhone, validateBusinessSettings } from "./validation";

function validForm() {
  const data = new FormData();
  Object.entries({ name: "Nosso Pet", shortName: "Nosso Pet", phone: "(11) 4558-3210", whatsapp: "(11) 96644-2719", instagramHandle: "@nossopet_taboao", instagramUrl: "https://instagram.com/nossopet_taboao", addressLine: "Rua 1", district: "Centro", city: "Taboão", state: "SP", postalCode: "06765-000", mapsUrl: "https://maps.google.com/a", mapsEmbedUrl: "https://maps.google.com/b" }).forEach(([key, value]) => data.set(key, value));
  for (const [day] of BUSINESS_DAYS) { data.set(`hours_${day}_open`, "on"); data.set(`hours_${day}_start`, "08:00"); data.set(`hours_${day}_end`, "18:00"); }
  return data;
}

describe("business settings validation", () => {
  it("normalizes Brazilian phone and WhatsApp without duplicating DDI", () => {
    expect(normalizeBrazilianPhone("(11) 4558-3210", false)).toBe("1145583210");
    expect(normalizeBrazilianPhone("+55 (11) 96644-2719", true)).toBe("5511966442719");
    expect(normalizeBrazilianPhone("123", true)).toBeNull();
  });
  it("maps valid friendly hours to JSON-compatible intervals", () => {
    const result = validateBusinessSettings(validForm());
    expect(result.fieldErrors).toEqual({});
    expect(result.values?.hours).toMatchObject({ monday: "08:00-18:00", sunday: "08:00-18:00" });
    expect(result.values?.whatsapp_raw).toBe("5511966442719");
  });
  it("maps closed days without exposing JSON input", () => {
    const data = validForm(); data.delete("hours_sunday_open");
    expect(validateBusinessSettings(data).values?.hours).toMatchObject({ sunday: "closed" });
  });
  it("rejects malformed URLs and hours", () => {
    const data = validForm(); data.set("instagramUrl", "javascript:alert(1)"); data.set("hours_monday_end", "07:00");
    const result = validateBusinessSettings(data);
    expect(result.fieldErrors.instagramUrl).toContain("URL");
    expect(result.fieldErrors.hours_monday).toContain("fim");
  });
  it("rejects required and malformed contact fields", () => {
    const data = validForm(); data.set("name", ""); data.set("phone", "123"); data.set("whatsapp", "abc");
    const result = validateBusinessSettings(data);
    expect(result.fieldErrors).toMatchObject({ name: "Campo obrigatório.", phone: expect.any(String), whatsapp: expect.any(String) });
  });
});
