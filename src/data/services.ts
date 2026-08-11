import {
  Bath,
  Scissors,
  Sparkles,
  Droplets,
  PawPrint,
  Car,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
export const services = [
  {
    name: "Banho",
    description: "Higiene completa com cuidado e carinho.",
    icon: Bath,
  },
  {
    name: "Tosa",
    description: "Acabamento confortável e adequado ao seu pet.",
    icon: Scissors,
  },
  {
    name: "Banho + Tosa",
    description: "O cuidado completo em um só atendimento.",
    icon: Sparkles,
  },
  {
    name: "Tosa higiênica",
    description: "Mais conforto e higiene para o dia a dia.",
    icon: ShieldCheck,
  },
  {
    name: "Hidratação",
    description: "Cuidado especial para pele e pelagem.",
    icon: Droplets,
  },
  {
    name: "Corte de unhas",
    description: "Feito com atenção e segurança.",
    icon: PawPrint,
  },
  {
    name: "TaxiPet",
    description: "Buscamos e levamos seu pet com mais comodidade.",
    icon: Car,
  },
  {
    name: "Consultório veterinário",
    description:
      "Atendimento veterinário mediante consulta de disponibilidade.",
    icon: Stethoscope,
  },
];
export const serviceOptions = [
  "Banho",
  "Tosa",
  "Banho + Tosa",
  "Tosa higiênica",
  "Hidratação",
  "Corte de unhas",
  "Atendimento veterinário",
  "Outro",
];
