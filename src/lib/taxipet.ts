import type { Service } from "@/types/domain";

export const TAXIPET_SLUG = "taxipet";

export function resolveTaxiPetService(services: Service[]): Service | undefined {
  return services.find((service) => service.slug === TAXIPET_SLUG);
}
