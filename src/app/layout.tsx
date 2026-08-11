import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { business } from "@/config/business";
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
export const metadata: Metadata = {
  metadataBase: new URL("https://nossopettaboao.com.br"),
  title: "Nosso Pet | Banho e Tosa em Taboão da Serra",
  description:
    "Banho, tosa, produtos, TaxiPet e cuidados para seu pet em Taboão da Serra. Conheça a Nosso Pet e solicite seu atendimento pelo WhatsApp.",
  openGraph: {
    title: "Nosso Pet | Banho e Tosa em Taboão da Serra",
    description: "Cuidado, carinho e praticidade para o seu pet.",
    type: "website",
    locale: "pt_BR",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: business.name,
    telephone: business.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: "BR",
    },
    sameAs: [business.instagramUrl],
  };
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={nunito.variable}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
