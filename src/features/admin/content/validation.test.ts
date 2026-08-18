import { describe, expect, it } from "vitest";
import { validateHomeContent } from "./validation";

const validForm = () => {
  const data = new FormData();
  for (const key of ["heroTitle", "heroHighlight", "heroDescription", "heroPrimaryCta", "heroSecondaryCta", "aboutTitle", "aboutDescription", "aboutFeatureOneTitle", "aboutFeatureTwoTitle", "footerDescription", "footerContactTitle", "footerLocationTitle", "taxipetTitle", "taxipetCta"]) data.set(key, `Conteúdo ${key}`);
  return data;
};

describe("home content validation", () => {
  it("maps explicit fields and normalizes optional TaxiPet content", () => {
    const data = validForm();
    data.set("taxipetRegion", "Taboão da Serra e região");
    const result = validateHomeContent(data);
    expect(result.values).toMatchObject({ hero_title: "Conteúdo heroTitle", taxipet_region: "Taboão da Serra e região", taxipet_note: null });
  });

  it("rejects missing required content and oversized text", () => {
    const data = validForm();
    data.set("heroTitle", "");
    data.set("taxipetRegion", "x".repeat(161));
    expect(validateHomeContent(data).fieldErrors).toMatchObject({ heroTitle: expect.any(String), taxipetRegion: expect.any(String) });
  });
});
