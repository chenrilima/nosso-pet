import { faq } from "@/data/faq";
import { products } from "@/data/products";
import { services, serviceOptions } from "@/data/services";
import type { Category, Faq, Product, Service } from "@/types/domain";

export const fallbackCategories: Category[] = Array.from(new Set(products.map((product) => product.category))).map((name, sortOrder) => ({ id: `local-category-${sortOrder}`, name, slug: name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-"), sortOrder }));

export const fallbackProducts: Product[] = products.map((product, sortOrder) => ({ id: product.id, slug: product.id, name: product.name, description: product.description, category: fallbackCategories.find((category) => category.name === product.category)!, price: product.price ?? null, imageUrl: null, imagePosition: { x: 50, y: 50 }, isFeatured: false, sortOrder }));

const serviceIconKeys = ["bath", "scissors", "sparkles", "shield_check", "droplets", "paw_print", "car", "stethoscope"] as const;
export const fallbackServices: Service[] = services.map((service, sortOrder) => ({ id: `local-service-${sortOrder}`, name: service.name, slug: service.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: service.description, iconKey: serviceIconKeys[sortOrder], imageUrl: null, pricingType: "quote", price: null, priceFrom: null, durationMinutes: null, isBookable: service.name !== "TaxiPet", isFeatured: false, sortOrder }));
export const fallbackBookableServices = fallbackServices.filter((service) => service.isBookable && (serviceOptions.includes(service.name) || service.name === "Consultório veterinário"));
export const fallbackFaqs: Faq[] = faq.map(([question, answer], sortOrder) => ({ id: `local-faq-${sortOrder}`, question, answer, sortOrder }));
