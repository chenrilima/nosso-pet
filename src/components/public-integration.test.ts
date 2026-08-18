import { describe, expect, it } from "vitest";
import { bookingOptions } from "./Booking";
import { resolveTaxiPetService } from "@/lib/taxipet";
import { addPurchaseIntent, setPurchaseIntentQuantity } from "@/lib/purchase-intents";
import { galleryForPresentation } from "@/lib/gallery-presentation";
import type { GalleryImage, PurchaseIntent, Service } from "@/types/domain";

const service = (name: string): Service => ({
  id: `service-${name}`,
  name,
  slug: name.toLowerCase(),
  description: "Descrição",
  iconKey: "bath",
  imageUrl: null,
  pricingType: "quote",
  price: null,
  priceFrom: null,
  durationMinutes: null,
  isBookable: true,
  isFeatured: false,
  sortOrder: 0,
});

const intent: PurchaseIntent = { id: "category|animal:caes", categoryId: "category", categoryName: "Rações", selections: [{ groupId: "animal", groupName: "Pet", optionId: "caes", optionName: "Cães" }], quantity: 1 };

describe("public component data contracts", () => {
  it("uses bookable services and keeps Other as a presentation option", () => {
    expect(bookingOptions([service("Banho")])).toEqual(["Banho", "Outro"]);
    expect(bookingOptions([])).toEqual(["Outro"]);
  });

  it("only exposes TaxiPet when the active service query contains its stable slug", () => {
    const taxi = { ...service("TaxiPet"), slug: "taxipet" };
    expect(resolveTaxiPetService([taxi])).toBe(taxi);
    expect(resolveTaxiPetService([service("Banho")])).toBeUndefined();
    expect(resolveTaxiPetService([])).toBeUndefined();
  });

  it("keeps an intent through add, increment, decrement and remove", () => {
    const added = addPurchaseIntent([], intent);
    const incremented = addPurchaseIntent(added, intent);
    expect(incremented[0]).toMatchObject({
      id: intent.id,
      quantity: 2,
    });
    expect(setPurchaseIntentQuantity(incremented, intent.id, 1)[0].quantity).toBe(1);
    expect(setPurchaseIntentQuantity(incremented, intent.id, 0)).toEqual([]);
  });

  it("uses remote gallery images and preserves the temporary local gallery when empty", () => {
    const remote: GalleryImage[] = [
      {
        id: "photo",
        imageUrl: "https://example.com/photo.webp",
        imagePosition: { x: 50, y: 50 },
        altText: "Pet",
        caption: null,
        sortOrder: 0,
      },
    ];
    expect(galleryForPresentation(remote)).toEqual([
      {
        id: "photo",
        imageUrl: "https://example.com/photo.webp",
        altText: "Pet",
        imagePosition: { x: 50, y: 50 },
      },
    ]);
    expect(
      galleryForPresentation([
        ...remote,
        { ...remote[0], id: "photo-2" },
        { ...remote[0], id: "photo-3" },
        { ...remote[0], id: "photo-4" },
        { ...remote[0], id: "photo-5" },
      ]),
    ).toHaveLength(5);
    expect(galleryForPresentation([])).toHaveLength(4);
    expect(galleryForPresentation([])[0].imageUrl).toBe(
      "/images/hero-pets.png",
    );
  });
});
