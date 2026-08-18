import { describe, expect, it } from "vitest";
import type { BusinessSettings } from "@/types/domain";
import { businessJsonLd, businessMetadata } from "./business-seo";

const settings: BusinessSettings = {
  id: "business", name: "Nosso Pet Taboão", shortName: "Pet Taboão",
  phone: "(11) 99999-9999", phoneRaw: "11999999999", whatsapp: "(11) 98888-8888", whatsappRaw: "5511988888888",
  instagram: { handle: "@pet", url: "https://instagram.com/pet" },
  address: { line: "Rua Nova, 10", district: "Centro", city: "Osasco", state: "SP", postalCode: "06000-000" },
  maps: { url: "https://maps.test", embedUrl: "https://maps.test/embed" },
  hours: { monday: "08:00-18:00", sunday: "closed" }, heroImagePath: null, heroImageUrl: null, heroImagePosition: { x: 50, y: 50 },
  content: { hero: { title: "", highlight: "", description: "", primaryCta: "", secondaryCta: "" }, about: { title: "", description: "", featureOneTitle: "", featureTwoTitle: "" }, footer: { description: "", contactTitle: "", locationTitle: "" }, taxipet: { title: "", region: null, note: null, cta: "" } },
};

describe("business SEO", () => {
  it("builds metadata from the configured identity and location", () => {
    const metadata = businessMetadata(settings, "https://example.test");
    expect(metadata.title).toBe("Pet Taboão | Banho e Tosa em Osasco");
    expect(metadata.description).toContain("Conheça a Pet Taboão");
    expect(metadata.openGraph).toMatchObject({ title: "Pet Taboão | Banho e Tosa em Osasco" });
  });

  it("builds JSON-LD from business settings without inventing closed hours", () => {
    expect(businessJsonLd(settings, "https://example.test")).toMatchObject({
      name: "Nosso Pet Taboão", telephone: "(11) 99999-9999", sameAs: ["https://instagram.com/pet"],
      address: { streetAddress: "Rua Nova, 10", addressLocality: "Osasco", postalCode: "06000-000" },
      openingHoursSpecification: [{ dayOfWeek: "https://schema.org/Monday", opens: "08:00", closes: "18:00" }],
    });
  });
});
