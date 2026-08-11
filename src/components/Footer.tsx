import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";
export function Footer() {
  return (
    <footer className="bg-olive py-12 text-white">
      <div className="container grid gap-8 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/65">
            Cuidado, carinho e praticidade para pets em Taboão da Serra.
          </p>
        </div>
        <div>
          <h3 className="font-black">Fale com a gente</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <a href={`tel:+55${business.phoneRaw}`}>
              <Phone className="mr-2 inline" size={16} />
              {business.phone}
            </a>
            <a
              target="_blank"
              href={whatsappUrl(
                "Olá! Vim pelo site da Nosso Pet e gostaria de mais informações.",
              )}
            >
              <MessageCircle className="mr-2 inline" size={16} />
              {business.whatsapp}
            </a>
            <a target="_blank" href={business.instagramUrl}>
              <Instagram className="mr-2 inline" size={16} />
              {business.instagram}
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-black">Onde estamos</h3>
          <p className="mt-4 text-sm leading-6 text-white/75">
            <MapPin className="mr-2 inline" size={16} />
            {business.address.street}
            <br />
            {business.address.district}
            <br />
            {business.address.city} - {business.address.state}
          </p>
        </div>
      </div>
      <div className="container mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Nosso Pet Banho e Tosa. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
