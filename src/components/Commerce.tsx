"use client";
import Image from "next/image";
import { useState } from "react";
import { Car, Minus, Plus, Send, ShoppingBag, Trash2 } from "lucide-react";
import { cartMessage, taxiMessage, whatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/domain";

export function TaxiPet({ whatsappRaw }: { whatsappRaw: string }) {
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({
    name: "",
    district: "",
    address: "",
    pet: "",
    service: "",
    date: "",
  });
  const update = (k: string, v: string) => setD((x) => ({ ...x, [k]: v }));
  const valid = Object.values(d).every(Boolean);
  return (
    <section className="section bg-orange-50">
      <div className="container grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white">
            <Car size={32} />
          </span>
          <p className="eyebrow">TaxiPet</p>
          <h2 className="title mt-2">Seu pet vai e volta com conforto.</h2>
          <p className="mt-5 max-w-xl text-lg text-gray-600">
            Consulte a disponibilidade do nosso transporte e facilite a rotina
            de cuidados do seu melhor amigo.
          </p>
          <button
            className="btn btn-primary mt-7"
            onClick={() => setOpen(!open)}
          >
            {open ? "Fechar formulário" : "Consultar TaxiPet"}
          </button>
        </div>
        {open ? (
          <form
            className="card grid gap-4 p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(whatsappUrl(taxiMessage(d), whatsappRaw), "_blank");
            }}
          >
            {Object.entries({
              name: "Seu nome",
              district: "Bairro",
              address: "Endereço aproximado ou CEP",
              pet: "Pet",
              service: "Serviço desejado",
            }).map(([k, l]) => (
              <label key={k}>
                {l} *
                <input
                  required
                  className="field mt-1"
                  value={d[k as keyof typeof d]}
                  onChange={(e) => update(k, e.target.value)}
                />
              </label>
            ))}
            <label>
              Data desejada *
              <input
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="field mt-1"
                value={d.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </label>
            <button
              disabled={!valid}
              className="btn btn-primary sm:col-span-2 disabled:opacity-40"
            >
              <Send size={18} />
              Enviar consulta
            </button>
          </form>
        ) : (
          <div className="card relative overflow-hidden p-8">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand/10" />
            <p className="relative text-xl font-black">
              Praticidade do início ao fim
            </p>
            <ul className="relative mt-5 space-y-4 text-gray-600">
              <li>✓ Informe seu bairro e endereço aproximado</li>
              <li>✓ Escolha o serviço e a data desejada</li>
              <li>✓ A equipe confirma disponibilidade pelo WhatsApp</li>
            </ul>
            <p className="relative mt-6 text-sm font-bold text-brand">
              O valor e a região de atendimento são confirmados pela equipe.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
type CartItem = Product & { quantity: number };
export const addCartItem = (cart: CartItem[], product: Product): CartItem[] =>
  cart.some((item) => item.id === product.id)
    ? cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...cart, { ...product, quantity: 1 }];

export const setCartQuantity = (
  cart: CartItem[],
  id: string,
  quantity: number,
): CartItem[] =>
  cart
    .map((item) => (item.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

export function Products({
  products,
  whatsappRaw,
}: {
  products: Product[];
  whatsappRaw: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const add = (product: Product) =>
    setCart((cart) => addCartItem(cart, product));
  const qty = (id: string, n: number) =>
    setCart((cart) => setCartQuantity(cart, id, n));
  return (
    <section id="produtos" className="section">
      <div className="container">
        <p className="eyebrow">Loja física</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="title mt-2">Produtos para o seu pet</h2>
            <p className="mt-4 text-gray-600">
              Adicione itens e consulte disponibilidade e valores pelo WhatsApp.
            </p>
          </div>
          <span className="rounded-full bg-orange-50 px-4 py-2 font-black text-brand">
            <ShoppingBag className="mr-2 inline" size={18} />
            {cart.reduce((a, x) => a + x.quantity, 0)} itens
          </span>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((p, i) => (
            <article className="card flex flex-col overflow-hidden" key={p.id}>
              <div
                className={`grid h-32 place-items-center ${["bg-orange-100", "bg-amber-50", "bg-lime-50", "bg-sky-50", "bg-purple-50"][i]}`}
              >
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    width={320}
                    height={128}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="text-olive/50" size={46} />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <small className="font-black uppercase text-brand">
                  {p.category.name}
                </small>
                <h3 className="mt-2 font-black">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-500">
                  {p.description}
                </p>
                <button
                  onClick={() => add(p)}
                  className="btn btn-secondary mt-5 text-sm"
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              </div>
            </article>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="card mt-8 p-6">
            <h3 className="text-xl font-black">Sua sacola</h3>
            <div className="mt-4 divide-y">
              {cart.map((x) => (
                <div
                  className="flex items-center justify-between gap-3 py-3"
                  key={x.id}
                >
                  <span className="font-bold">{x.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Diminuir"
                      onClick={() => qty(x.id, x.quantity - 1)}
                      className="rounded-full border p-2"
                    >
                      {x.quantity === 1 ? (
                        <Trash2 size={15} />
                      ) : (
                        <Minus size={15} />
                      )}
                    </button>
                    <b>{x.quantity}</b>
                    <button
                      aria-label="Aumentar"
                      onClick={() => qty(x.id, x.quantity + 1)}
                      className="rounded-full border p-2"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={whatsappUrl(cartMessage(cart), whatsappRaw)}
              className="btn btn-primary mt-5 w-full"
            >
              <Send size={18} />
              Solicitar pedido pelo WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
