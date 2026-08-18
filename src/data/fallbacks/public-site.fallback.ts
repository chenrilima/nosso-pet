import { faq } from "@/data/faq";
import { services, serviceOptions } from "@/data/services";
import type { Category, Faq, Service } from "@/types/domain";

export const fallbackCategories: Category[] = [];

const serviceIconKeys = ["bath", "scissors", "sparkles", "shield_check", "droplets", "paw_print", "car", "stethoscope"] as const;
export const fallbackServices: Service[] = services.map((service, sortOrder) => ({ id: `local-service-${sortOrder}`, name: service.name, slug: service.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: service.description, iconKey: serviceIconKeys[sortOrder], imageUrl: null, pricingType: "quote" as const, price: null, priceFrom: null, durationMinutes: null, isBookable: service.name !== "TaxiPet", isFeatured: false, sortOrder })).filter((service) => service.slug !== "taxipet");
export const fallbackBookableServices = fallbackServices.filter((service) => service.isBookable && (serviceOptions.includes(service.name) || service.name === "Consultório veterinário"));
export const fallbackFaqs: Faq[] = faq.map(([question, answer], sortOrder) => ({ id: `local-faq-${sortOrder}`, question, answer, sortOrder }));
