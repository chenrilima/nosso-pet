import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Booking } from "@/components/Booking";
import { Products, TaxiPet } from "@/components/Commerce";
import { Footer } from "@/components/Footer";
import { getPublicSiteDataSafe } from "@/data/queries/public-site.query";
import { galleryForPresentation } from "@/lib/gallery-presentation";
import { presentBusinessHours } from "@/lib/business-hours";
import { presentServicePrice } from "@/lib/pricing";
import { resolveServiceIcon } from "@/lib/service-icons";
import { generalInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { getPublicCatalog } from "@/data/queries/catalog.query";
import { imageObjectPosition } from "@/lib/image-position";
import { resolveTaxiPetService } from "@/lib/taxipet";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const [{ data }, catalogResult] = await Promise.all([getPublicSiteDataSafe(), getPublicCatalog()]);
  const catalog = catalogResult.ok ? catalogResult.data : [];
  const taxiPetService = resolveTaxiPetService(data.services);
  if (!data.business) throw new Error("Configurações comerciais indisponíveis.");
  const business = data.business;
  const content = business.content;
  const gallery = galleryForPresentation(data.gallery);
  const businessHours = presentBusinessHours(business.hours);

  return (
    <>
      <Header businessName={business.shortName} whatsappRaw={business.whatsappRaw} />
      <main id="top">
        <section className="overflow-hidden bg-cream">
          <div className="container grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="eyebrow">Banho e tosa em {business.address.city}</p>
              <h1 className="mt-3 text-[clamp(2.8rem,6vw,5.7rem)] font-black leading-[.93] tracking-[-.055em] text-olive">
                {content.hero.title}{" "}
                <span className="text-brand">{content.hero.highlight}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                {content.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#agendamento" className="btn btn-primary">
                  {content.hero.primaryCta}
                  <ArrowRight size={18} />
                </a>
                <a href="#servicos" className="btn btn-secondary">
                  {content.hero.secondaryCta}
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-4 text-sm font-bold text-olive/70">
                <span>
                  <MapPin className="mr-1 inline text-brand" size={17} />
                  {business.address.city}
                </span>
                <span>
                  <Sparkles className="mr-1 inline text-brand" size={17} />
                  Banho e tosa
                </span>
                <span>
                  <Package className="mr-1 inline text-brand" size={17} />
                  Produtos
                </span>
                <span>
                  <Stethoscope className="mr-1 inline text-brand" size={17} />
                  Veterinário
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-5 rotate-3 rounded-[3rem] bg-brand/10" />
              <Image
                priority
                src={business.heroImageUrl ?? "/images/hero-pets.png"}
                width={1456}
                height={1086}
                alt="Cães bem cuidados em ambiente de banho e tosa"
                className="relative aspect-[4/3] rounded-[2.5rem] object-cover shadow-soft"
                style={{ objectPosition: imageObjectPosition(business.heroImagePosition) }}
              />
            </div>
          </div>
        </section>
        <section id="servicos" className="section">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Serviços</p>
              <h2 className="title mt-2">Como podemos cuidar do seu pet?</h2>
              <p className="mt-4 text-gray-600">
                Escolha o cuidado ideal e monte uma solicitação completa em
                poucos passos.
              </p>
            </div>
            <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.services.map((service) => {
                const Icon = resolveServiceIcon(service.iconKey);
                const price = presentServicePrice(service);
                return (
                <article
                  key={service.id}
                  className="card group p-6 hover:-translate-y-1 hover:border-brand/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-brand group-hover:bg-brand group-hover:text-white">
                    <Icon />
                  </span>
                  <h3 className="mt-5 text-xl font-black">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>
                  {price && (
                    <p className="mt-4 font-black text-olive">{price}</p>
                  )}
                </article>
                );
              })}
            </div>
          </div>
        </section>
        <Booking
          services={data.bookableServices}
          whatsappRaw={business.whatsappRaw}
          businessName={business.shortName}
        />
        <TaxiPet service={taxiPetService} content={content.taxipet} price={taxiPetService ? presentServicePrice(taxiPetService) : null} whatsappRaw={business.whatsappRaw} />
        <Products catalog={catalog} whatsappRaw={business.whatsappRaw} />
        <section id="galeria" className="section bg-cream">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Nosso trabalho</p>
                <h2 className="title mt-2">Clientes de quatro patas</h2>
              </div>
              <a
                href={business.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Instagram size={18} />
                Ver Instagram
              </a>
            </div>
            <div className="mt-10 grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {gallery.map((image, i) => (
                <figure
                  key={image.id}
                  className={`${i === 0 && gallery.length > 1 ? "sm:row-span-2" : ""} relative overflow-hidden rounded-3xl bg-white`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.altText}
                    width={900}
                    height={700}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    style={image.imagePosition ? { objectPosition: imageObjectPosition(image.imagePosition) } : undefined}
                  />
                  {image.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-olive/85 px-4 py-3 text-sm font-bold text-white">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
            {gallery.length === 0 && <p className="mt-8 text-center text-sm font-semibold text-gray-500">Nenhuma foto publicada no momento.</p>}
          </div>
        </section>
        <section id="sobre" className="section">
          <div className="container grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Sobre a {business.shortName}</p>
              <h2 className="title mt-2">
                {content.about.title}
              </h2>
            </div>
            <div className="text-lg leading-8 text-gray-600">
              <p>
                {content.about.description}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <Heart className="text-brand" />
                  <b className="mt-3 block text-olive">{content.about.featureOneTitle}</b>
                </div>
                <div className="card p-5">
                  <ShieldCheck className="text-brand" />
                  <b className="mt-3 block text-olive">
                    {content.about.featureTwoTitle}
                  </b>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-orange-50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Dúvidas frequentes</p>
              <h2 className="title mt-2">Antes de falar com a gente</h2>
            </div>
            <div className="mx-auto mt-9 max-w-3xl space-y-3">
              {data.faqs.map((faq) => (
                <details className="card group p-5" key={faq.id}>
                  <summary className="cursor-pointer list-none pr-8 font-black">
                    {faq.question}
                    <span className="float-right text-brand group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-7 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="localizacao" className="section">
          <div className="container grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Localização</p>
              <h2 className="title mt-2">Estamos em {business.address.city}</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                {business.address.line}
                <br />
                {business.address.district}
                <br />
                {business.address.city} - {business.address.state}
                <br />
                CEP {business.address.postalCode}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={business.maps.url}
                  className="btn btn-primary"
                >
                  <MapPin size={18} />
                  Como chegar
                </a>
                <a
                  href={`tel:+55${business.phoneRaw}`}
                  className="btn btn-secondary"
                >
                  <Phone size={18} />
                  {business.phone}
                </a>
              </div>
              <div className="mt-7 rounded-2xl bg-cream p-5">
                <b>Horários de funcionamento</b>
                {businessHours ? (
                  <dl className="mt-3 space-y-1 text-sm text-gray-600">
                    {businessHours.map(({ day, label, value }) => (
                      <div key={day} className="flex justify-between gap-4">
                        <dt>{label}</dt>
                        <dd className="font-semibold text-gray-700">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-1 text-sm text-gray-600">
                    Consulte o funcionamento e a disponibilidade pelo WhatsApp.
                  </p>
                )}
              </div>
            </div>
            <iframe
              title={`Mapa da ${business.shortName} em ${business.address.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={business.maps.embedUrl}
              className="h-[420px] w-full rounded-[2rem] border-0"
            />
          </div>
        </section>
      </main>
      <a
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105"
        aria-label={`Falar com a ${business.shortName} pelo WhatsApp`}
        target="_blank"
        rel="noopener noreferrer"
        href={whatsappUrl(
          generalInquiryMessage(business.shortName),
          business.whatsappRaw,
        )}
      >
        <MessageCircle />
      </a>
      <Footer business={business} content={content.footer} />
    </>
  );
}
