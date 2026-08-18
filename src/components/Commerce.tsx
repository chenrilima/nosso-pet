"use client";
import { useEffect, useState } from "react";
import { Car, Minus, Plus, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { cartMessage, taxiMessage, whatsappUrl } from "@/lib/whatsapp";
import { addPurchaseIntent, createPurchaseIntent, setPurchaseIntentQuantity, type SelectionValues } from "@/lib/purchase-intents";
import { TAXIPET_SLUG } from "@/lib/taxipet";
import type { CatalogCategory, HomeContent, PurchaseIntent, Service } from "@/types/domain";

export function TaxiPet({ service, content, price, whatsappRaw }: { service?: Service; content: HomeContent["taxipet"]; price: string | null; whatsappRaw: string }) {
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
  if (!service || service.slug !== TAXIPET_SLUG) return null;
  return (
    <section className="section bg-orange-50">
      <div className="container grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white">
            <Car size={32} />
          </span>
          <p className="eyebrow">TaxiPet</p>
          <h2 className="title mt-2">{content.title}</h2>
          <p className="mt-5 max-w-xl text-lg text-gray-600">
            {service.description}
          </p>
          {(content.region || price) && <p className="mt-4 font-black text-olive">{[content.region, price].filter(Boolean).join(" · ")}</p>}
          <button
            className="btn btn-primary mt-7"
            onClick={() => setOpen(!open)}
          >
            {open ? "Fechar formulário" : content.cta}
          </button>
        </div>
        {open ? (
          <form
            className="card grid gap-4 p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(whatsappUrl(taxiMessage(d, { region: content.region, price }), whatsappRaw), "_blank");
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
            {content.note && <p className="relative mt-6 text-sm font-bold text-brand">{content.note}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
function CatalogDialog({ category, onClose, onAdd }: { category: CatalogCategory; onClose: () => void; onAdd: (intent: PurchaseIntent) => void }) {
  const [values, setValues] = useState<SelectionValues>({});
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  const intent = createPurchaseIntent(category, values);
  return (
    <div className="fixed inset-0 z-50 grid items-end bg-black/50 p-0 sm:place-items-center sm:p-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="catalog-dialog-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="eyebrow">Monte sua consulta</p><h3 id="catalog-dialog-title" className="mt-1 text-2xl font-black text-olive">{category.name}</h3><p className="mt-2 text-sm text-gray-600">Escolha as opções obrigatórias e, se quiser, as demais.</p></div>
          <button type="button" aria-label="Fechar opções" onClick={onClose} className="rounded-full border border-stone-200 p-2 text-olive"><X size={20} /></button>
        </div>
        <div className="mt-6 space-y-6">
          {category.optionGroups.map((group, index) => (
            <fieldset key={group.id}>
              <legend className="font-black text-olive"><span className="mr-2 text-brand">{index + 1}.</span>{group.name} {!group.isRequired && <span className="text-xs text-stone-500">(opcional)</span>}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.options.filter((option) => option.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map((option) => {
                  const selected = values[group.id] === option.id;
                  return <label key={option.id} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition ${selected ? "border-brand bg-brand text-white" : "border-stone-200 bg-white text-olive hover:border-brand"}`}><input className="sr-only" type="radio" name={group.id} value={option.id} checked={selected} onChange={() => setValues((current) => ({ ...current, [group.id]: option.id }))} />{option.name}</label>;
                })}
              </div>{group.options.length === 0 && <p className="mt-2 text-sm font-semibold text-stone-500">Nenhuma opção disponível neste grupo.</p>}
            </fieldset>
          ))}
        </div>
        <button type="button" disabled={!intent} onClick={() => { if (intent) { onAdd(intent); onClose(); } }} className="btn btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-40"><Plus size={18} />Adicionar à consulta</button>
      </div>
    </div>
  );
}

export function Products({
  catalog,
  whatsappRaw,
}: {
  catalog: CatalogCategory[];
  whatsappRaw: string;
}) {
  const [cart, setCart] = useState<PurchaseIntent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
  const add = (intent: PurchaseIntent) => setCart((current) => addPurchaseIntent(current, intent));
  const qty = (id: string, n: number) =>
    setCart((current) => setPurchaseIntentQuantity(current, id, n));
  return (
    <section id="produtos" className="section">
      <div className="container">
        <p className="eyebrow">Loja física</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="title mt-2">Produtos para o seu pet</h2>
            <p className="mt-4 text-gray-600">
              Conte o que procura e consulte disponibilidade e valores pelo WhatsApp.
            </p>
          </div>
          <span className="rounded-full bg-orange-50 px-4 py-2 font-black text-brand">
            <ShoppingBag className="mr-2 inline" size={18} />
            {cart.reduce((a, x) => a + x.quantity, 0)} itens
          </span>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {catalog.map((category, i) => (
            <article className="card flex flex-col overflow-hidden" key={category.id}>
              <div className={`grid h-32 place-items-center ${["bg-orange-100", "bg-amber-50", "bg-lime-50", "bg-sky-50", "bg-purple-50"][i % 5]}`}><ShoppingBag className="text-olive/50" size={46} /></div>
              <div className="flex flex-1 flex-col p-5">
                <small className="font-black uppercase text-brand">Categoria</small>
                <h3 className="mt-2 font-black">{category.name}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-500">{category.description}</p>
                <button disabled={category.optionGroups.length === 0} onClick={() => setSelectedCategory(category)} className="btn btn-secondary mt-5 text-sm disabled:cursor-not-allowed disabled:opacity-50">{category.optionGroups.length ? "Ver opções" : "Opções em breve"}</button>
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
                  <div><p className="font-bold">{x.categoryName}</p><p className="mt-1 text-sm text-gray-500">{x.selections.map((selection) => selection.optionName).join(" • ")}</p></div>
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
              Consultar disponibilidade pelo WhatsApp
            </a>
          </div>
        )}
      </div>
      {selectedCategory && <CatalogDialog category={selectedCategory} onClose={() => setSelectedCategory(null)} onAdd={add} />}
    </section>
  );
}
