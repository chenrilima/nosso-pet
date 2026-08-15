import type { BusinessHours } from "@/types/domain";

export const BUSINESS_DAYS = [
  ["monday", "Segunda-feira"], ["tuesday", "Terça-feira"], ["wednesday", "Quarta-feira"],
  ["thursday", "Quinta-feira"], ["friday", "Sexta-feira"], ["saturday", "Sábado"], ["sunday", "Domingo"],
] as const;

export type PresentedBusinessHour = { day: (typeof BUSINESS_DAYS)[number][0]; label: string; value: string };

export function presentBusinessHours(hours: BusinessHours | null): PresentedBusinessHour[] | null {
  if (hours === null) return null;
  return BUSINESS_DAYS.map(([day, label]) => {
    const interval = hours[day];
    const match = typeof interval === "string" ? /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(interval) : null;
    return { day, label, value: match ? `${match[1]} – ${match[2]}` : "Fechado" };
  });
}
