import { describe, expect, it } from "vitest";
import { bookingOptions } from "./Booking";
import { addCartItem, setCartQuantity } from "./Commerce";
import { galleryForPresentation } from "@/lib/gallery-presentation";
import type { GalleryImage, Product, Service } from "@/types/domain";

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

const product: Product = {
  id: "2d1f44aa-4394-45cb-9549-94ab061bbe20",
  slug: "racao",
  name: "Ração",
  description: "Descrição",
  category: { id: "category", name: "Rações", slug: "racoes", sortOrder: 0 },
  price: null,
  imageUrl: null,
  imagePosition: { x: 50, y: 50 },
  isFeatured: false,
  sortOrder: 0,
};

describe("public component data contracts", () => {
  it("uses bookable services and keeps Other as a presentation option", () => {
    expect(bookingOptions([service("Banho")])).toEqual(["Banho", "Outro"]);
    expect(bookingOptions([])).toEqual(["Outro"]);
  });

  it("uses a product UUID through add, increment, decrement and remove", () => {
    const added = addCartItem([], product);
    const incremented = addCartItem(added, product);
    expect(incremented[0]).toMatchObject({
      id: product.id,
      slug: "racao",
      quantity: 2,
    });
    expect(setCartQuantity(incremented, product.id, 1)[0].quantity).toBe(1);
    expect(setCartQuantity(incremented, product.id, 0)).toEqual([]);
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
