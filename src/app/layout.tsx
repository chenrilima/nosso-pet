import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { business } from "@/config/business";
import { getPublicBusinessSettings } from "@/data/queries/business.query";
import { businessJsonLd, businessMetadata } from "@/lib/business-seo";
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
export async function generateMetadata(): Promise<Metadata> {
  const result = await getPublicBusinessSettings();
  return businessMetadata(result.ok ? result.data : null, business.siteUrl);
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getPublicBusinessSettings();
  const jsonLd = result.ok && result.data ? businessJsonLd(result.data, business.siteUrl) : null;
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={nunito.variable}>
        {children}
        {jsonLd && <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />}
      </body>
    </html>
  );
}
