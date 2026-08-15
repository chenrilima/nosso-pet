import { describe, expect, it } from "vitest";
import { toBusinessSettings } from "./business.adapter";
import { toCategory } from "./category.adapter";
import { toFaq } from "./faq.adapter";
import { toGalleryImage } from "./gallery.adapter";
import { toProduct } from "./product.adapter";
import { toService } from "./service.adapter";
import type { BusinessSettingsRow } from "@/data/repositories/business.repository";
import type { CategoryRow } from "@/data/repositories/categories.repository";
import type { FaqRow } from "@/data/repositories/faqs.repository";
import type { GalleryImageRow } from "@/data/repositories/gallery.repository";
import type { ProductRow } from "@/data/repositories/products.repository";
import type { ServiceRow } from "@/data/repositories/services.repository";

const timestamps = { created_at: "2026-01-01", updated_at: "2026-01-01" };
const categoryRow: CategoryRow = { ...timestamps, id: "category", name: "Rações", slug: "racoes", sort_order: 2, is_active: true };

describe("database to domain adapters", () => {
  it("maps business fields and null hours", () => {
    const row: BusinessSettingsRow = { ...timestamps, id: "business", singleton_key: true, name: "Nosso Pet", short_name: "NP", phone: "phone", phone_raw: "raw", whatsapp: "whatsapp", whatsapp_raw: "wa-raw", instagram_handle: "@pet", instagram_url: "https://instagram.test", address_line: "Rua 1", district: "Centro", city: "Taboão", state: "SP", postal_code: "00000", maps_url: "https://maps.test", maps_embed_url: "https://embed.test", hours: null };
    expect(toBusinessSettings(row)).toMatchObject({ shortName: "NP", address: { line: "Rua 1" }, hours: null });
  });

  it("maps explicitly typed business hours", () => {
    const row = { ...({} as BusinessSettingsRow), hours: { segunda: "09:00-18:00" } };
    expect(toBusinessSettings({ ...row, ...{ id: "b", name: "n", short_name: "n", phone: "p", phone_raw: "p", whatsapp: "w", whatsapp_raw: "w", instagram_handle: "i", instagram_url: "u", address_line: "a", district: "d", city: "c", state: "s", postal_code: "z", maps_url: "m", maps_embed_url: "e" } }).hours).toEqual({ segunda: "09:00-18:00" });
  });

  it("maps categories", () => expect(toCategory(categoryRow)).toEqual({ id: "category", name: "Rações", slug: "racoes", sortOrder: 2 }));

  it("maps product category, nullable price and nullable image", () => {
    const row: ProductRow = { ...timestamps, id: "product", category_id: "category", name: "Ração", slug: "racao", description: "Boa", price: null, image_path: null, is_active: true, is_featured: false, sort_order: 1 };
    expect(toProduct(row, toCategory(categoryRow), () => "unused")).toMatchObject({ category: { slug: "racoes" }, price: null, imageUrl: null, sortOrder: 1 });
  });

  it("maps service pricing, icon and public image URL", () => {
    const row: ServiceRow = { ...timestamps, id: "service", name: "Banho", slug: "banho", description: "Cuidado", icon_key: "bath", image_path: "services/bath.webp", pricing_type: "starting_at", price: null, price_from: 50, duration_minutes: 60, is_active: true, is_bookable: true, is_featured: true, sort_order: 0 };
    expect(toService(row, (path) => `https://assets.test/${path}`)).toMatchObject({ iconKey: "bath", pricingType: "starting_at", price: null, priceFrom: 50, imageUrl: "https://assets.test/services/bath.webp" });
  });

  it("maps gallery Storage paths and FAQ rows", () => {
    const gallery: GalleryImageRow = { ...timestamps, id: "image", storage_path: "gallery/pet.webp", alt_text: "Pet", caption: null, is_published: true, sort_order: 0 };
    const faq: FaqRow = { ...timestamps, id: "faq", question: "Q?", answer: "A.", is_published: true, sort_order: 3 };
    expect(toGalleryImage(gallery, (path) => `https://assets.test/${path}`).imageUrl).toBe("https://assets.test/gallery/pet.webp");
    expect(toFaq(faq)).toEqual({ id: "faq", question: "Q?", answer: "A.", sortOrder: 3 });
  });
});
