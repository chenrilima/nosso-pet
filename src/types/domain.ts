export type BusinessHours = Record<string, string> | null;
export type BusinessSettings = { id: string; name: string; shortName: string; phone: string; phoneRaw: string; whatsapp: string; whatsappRaw: string; instagramHandle: string; instagramUrl: string; addressLine: string; district: string; city: string; state: string; postalCode: string; mapsUrl: string; mapsEmbedUrl: string; hours: BusinessHours };
export type Category = { id: string; name: string; slug: string; sortOrder: number };
export type Product = { id: string; categoryId: string; name: string; slug: string; description: string; price: number | null; imagePath: string | null; isFeatured: boolean; sortOrder: number };
export type PricingType = "fixed" | "starting_at" | "quote";
export type Service = { id: string; name: string; slug: string; description: string; iconKey: string; imagePath: string | null; pricingType: PricingType; price: number | null; priceFrom: number | null; durationMinutes: number | null; isBookable: boolean; isFeatured: boolean; sortOrder: number };
export type GalleryImage = { id: string; storagePath: string; altText: string; caption: string | null; sortOrder: number };
export type Faq = { id: string; question: string; answer: string; sortOrder: number };
