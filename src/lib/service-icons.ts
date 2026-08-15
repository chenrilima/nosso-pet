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

export function resolveServiceIcon(iconKey: ServiceIconKey): LucideIcon {
  return serviceIconMap[iconKey] ?? CircleHelp;
}
