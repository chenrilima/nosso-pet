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
import { services } from "@/data/services";
import { faq } from "@/data/faq";
import { business } from "@/config/business";
import { whatsappUrl } from "@/lib/whatsapp";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="overflow-hidden bg-cream">
          <div className="container grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="eyebrow">Banho e tosa em Taboão da Serra</p>
              <h1 className="mt-3 text-[clamp(2.8rem,6vw,5.7rem)] font-black leading-[.93] tracking-[-.055em] text-olive">
                Seu pet cuidado como parte da{" "}
                <span className="text-brand">família.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Banho, tosa, cuidados, produtos e muito carinho para o seu
                melhor amigo em Taboão da Serra.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#agendamento" className="btn btn-primary">
                  Agendar atendimento
                  <ArrowRight size={18} />
                </a>
                <a href="#servicos" className="btn btn-secondary">
                  Conhecer serviços
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-4 text-sm font-bold text-olive/70">
                <span>
                  <MapPin className="mr-1 inline text-brand" size={17} />
                  Taboão da Serra
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
                src="/images/hero-pets.png"
                width={1456}
                height={1086}
                alt="Cães bem cuidados em ambiente de banho e tosa"
                className="relative aspect-[4/3] rounded-[2.5rem] object-cover shadow-soft"
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
              {services.map(({ name, description, icon: Icon }) => (
                <article
                  key={name}
                  className="card group p-6 hover:-translate-y-1 hover:border-brand/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-brand group-hover:bg-brand group-hover:text-white">
                    <Icon />
                  </span>
                  <h3 className="mt-5 text-xl font-black">{name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <Booking />
        <TaxiPet />
        <Products />
        <section id="galeria" className="section bg-cream">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Nosso trabalho</p>
                <h2 className="title mt-2">Clientes de quatro patas</h2>
              </div>
              <a
                href={business.instagramUrl}
                target="_blank"
                className="btn btn-secondary"
              >
                <Instagram size={18} />
                Ver Instagram
              </a>
            </div>
            <div className="mt-10 grid h-[620px] grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
              {[
                "object-[70%_50%]",
                "object-[92%_55%]",
                "object-[55%_50%]",
                "object-[80%_50%]",
              ].map((pos, i) => (
                <div
                  key={i}
                  className={`${i === 0 ? "row-span-2" : ""} overflow-hidden rounded-3xl bg-white`}
                >
                  <Image
                    src="/images/hero-pets.png"
                    alt="Pet bem cuidado pela Nosso Pet"
                    width={900}
                    height={700}
                    className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${pos}`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Imagens ilustrativas nesta primeira versão; substitua pelas fotos
              reais do estabelecimento em public/images.
            </p>
          </div>
        </section>
        <section id="sobre" className="section">
          <div className="container grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Sobre a Nosso Pet</p>
              <h2 className="title mt-2">
                Cuidado, carinho e confiança em cada atendimento.
              </h2>
            </div>
            <div className="text-lg leading-8 text-gray-600">
              <p>
                A Nosso Pet está perto das famílias de Taboão da Serra,
                oferecendo uma rotina de cuidados mais tranquila para tutores e
                animais.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <Heart className="text-brand" />
                  <b className="mt-3 block text-olive">Atendimento acolhedor</b>
                </div>
                <div className="card p-5">
                  <ShieldCheck className="text-brand" />
                  <b className="mt-3 block text-olive">
                    Informação com clareza
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
              {faq.map(([q, a]) => (
                <details className="card group p-5" key={q}>
                  <summary className="cursor-pointer list-none pr-8 font-black">
                    {q}
                    <span className="float-right text-brand group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-7 text-gray-600">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="localizacao" className="section">
          <div className="container grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Localização</p>
              <h2 className="title mt-2">Estamos em Taboão da Serra</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                {business.address.street}
                <br />
                {business.address.district}
                <br />
                {business.address.city} - {business.address.state}
                <br />
                CEP {business.address.zip}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  target="_blank"
                  href={business.mapsUrl}
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
                <p className="mt-1 text-sm text-gray-600">
                  Consulte o funcionamento e a disponibilidade pelo WhatsApp.
                </p>
              </div>
            </div>
            <iframe
              title="Mapa da Nosso Pet em Taboão da Serra"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={business.mapsEmbed}
              className="h-[420px] w-full rounded-[2rem] border-0"
            />
          </div>
        </section>
      </main>
      <a
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105"
        aria-label="Falar com a Nosso Pet pelo WhatsApp"
        target="_blank"
        href={whatsappUrl(
          "Olá! Vim pelo site da Nosso Pet e gostaria de mais informações.",
        )}
      >
        <MessageCircle />
      </a>
      <Footer />
    </>
  );
}
