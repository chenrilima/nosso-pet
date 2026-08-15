import {
  Bath,
  Car,
  CircleHelp,
  Droplets,
  PawPrint,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/types/domain";

export const SERVICE_ICON_OPTIONS = [
  { key: "bath", label: "Banho" },
  { key: "scissors", label: "Tesoura" },
  { key: "sparkles", label: "Brilho" },
  { key: "shield_check", label: "Proteção" },
  { key: "droplets", label: "Hidratação" },
  { key: "paw_print", label: "Pata" },
  { key: "car", label: "Táxi pet" },
  { key: "stethoscope", label: "Veterinário" },
] as const;

const serviceIconMap: Record<string, LucideIcon> = {
  bath: Bath,
  scissors: Scissors,
  sparkles: Sparkles,
  shield_check: ShieldCheck,
  droplets: Droplets,
  paw_print: PawPrint,
  car: Car,
  stethoscope: Stethoscope,
};

export function isSupportedServiceIcon(iconKey: string): boolean {
  return Object.hasOwn(serviceIconMap, iconKey);
}

export function resolveServiceIcon(iconKey: ServiceIconKey): LucideIcon {
  return serviceIconMap[iconKey] ?? CircleHelp;
}
