import type { Metadata } from "next";
import { business } from "@/config/business";
import { BUSINESS_DAYS } from "@/lib/business-hours";
import type { BusinessSettings } from "@/types/domain";

const schemaDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export function businessMetadata(settings: BusinessSettings | null, siteUrl: string): Metadata {
  const title = settings
    ? `${settings.shortName} | Banho e Tosa em ${settings.address.city}`
    : "Banho e Tosa";
  const description = settings
    ? `Banho, tosa, produtos, TaxiPet e cuidados para seu pet em ${settings.address.city}. Conheça a ${settings.shortName} e solicite seu atendimento pelo WhatsApp.`
    : "Banho, tosa, produtos, TaxiPet e cuidados para seu pet.";
  const socialImage = {
    url: business.socialImage.path,
    width: business.socialImage.width,
    height: business.socialImage.height,
    alt: business.socialImage.alt,
  };
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      url: siteUrl,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function businessJsonLd(settings: BusinessSettings, siteUrl: string) {
  const openingHoursSpecification = settings.hours
    ? BUSINESS_DAYS.flatMap(([day], index) => {
        const match = /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(settings.hours?.[day] ?? "");
        return match ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${schemaDays[index]}`, opens: match[1], closes: match[2] }] : [];
      })
    : [];
  return {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: settings.name,
    url: siteUrl,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.line,
      addressLocality: settings.address.city,
      addressRegion: settings.address.state,
      postalCode: settings.address.postalCode,
      addressCountry: "BR",
    },
    ...(settings.instagram.url ? { sameAs: [settings.instagram.url] } : {}),
    ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
  };
}
