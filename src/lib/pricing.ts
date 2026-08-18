import type { Service } from "@/types/domain";

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrencyBRL(value: number): string {
  return brlFormatter.format(value).replace(/\u00a0/g, " ");
}

export function presentServicePrice(
  service: Pick<Service, "pricingType" | "price" | "priceFrom">,
): string | null {
  switch (service.pricingType) {
    case "fixed":
      return service.price === null ? null : formatCurrencyBRL(service.price);
    case "starting_at":
      return service.priceFrom === null
        ? null
        : `A partir de ${formatCurrencyBRL(service.priceFrom)}`;
    case "quote":
      return "Consulte";
  }
}
