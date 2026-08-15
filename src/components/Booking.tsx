"use client";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { bookingMessage, Booking as B, whatsappUrl } from "@/lib/whatsapp";
import type { Service } from "@/types/domain";
const initial: B = {
  services: [],
  name: "",
  type: "Cachorro",
  breed: "",
  size: "Pequeno",
  age: "",
  sex: "",
  notes: "",
  date: "",
  period: "Manhã",
};
export const bookingOptions = (services: Service[]) => [
  ...services.map((service) => service.name),
  "Outro",
];

export function Booking({
  services,
  whatsappRaw,
}: {
  services: Service[];
  whatsappRaw: string;
}) {
  const [step, setStep] = useState(1);
  const [b, setB] = useState(initial);
  const set = (k: keyof B, v: string | string[]) =>
    setB((x) => ({ ...x, [k]: v }));
  const valid =
    step === 1
      ? b.services.length > 0
      : step === 2
        ? !!b.name && !!b.type && !!b.size
        : step === 4
          ? !!b.date && !!b.period
          : true;
  return (
    <section id="agendamento" className="section bg-olive text-white paw-bg">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow !text-orange-300">Monte o atendimento</p>
          <h2 className="title mt-2">Vamos cuidar do seu pet?</h2>
          <p className="mt-4 text-white/75">
            Conte um pouco sobre ele e envie sua solicitação pronta para nossa
            equipe.
          </p>
          <div className="my-8 flex gap-2" aria-label={`Etapa ${step} de 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`h-2 flex-1 rounded-full ${n <= step ? "bg-brand" : "bg-white/20"}`}
              />
            ))}
          </div>
          <div className="card min-h-[420px] p-5 text-olive md:p-8">
            <p className="mb-5 text-sm font-black text-brand">
              ETAPA {step} DE 5
            </p>
            {step === 1 && (
              <>
                <h3 className="text-2xl font-black">O que você precisa?</h3>
                <p className="mb-5 text-sm text-gray-500">
                  Você pode escolher mais de uma opção.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {bookingOptions(services).map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        set(
                          "services",
                          b.services.includes(s)
                            ? b.services.filter((x) => x !== s)
                            : [...b.services, s],
                        )
                      }
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left font-bold ${b.services.includes(s) ? "border-brand bg-orange-50" : "border-gray-200"}`}
                    >
                      {s}
                      {b.services.includes(s) && (
                        <Check className="text-brand" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h3 className="mb-5 text-2xl font-black">Conte sobre o pet</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    Nome do pet *
                    <input
                      className="field mt-1"
                      value={b.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </label>
                  <label>
                    Tipo *
                    <select
                      className="field mt-1"
                      value={b.type}
                      onChange={(e) => set("type", e.target.value)}
                    >
                      <option>Cachorro</option>
                      <option>Gato</option>
                      <option>Outro</option>
                    </select>
                  </label>
                  <label>
                    Raça
                    <input
                      className="field mt-1"
                      value={b.breed}
                      onChange={(e) => set("breed", e.target.value)}
                    />
                  </label>
                  <label>
                    Porte *
                    <select
                      className="field mt-1"
                      value={b.size}
                      onChange={(e) => set("size", e.target.value)}
                    >
                      <option>Pequeno</option>
                      <option>Médio</option>
                      <option>Grande</option>
                    </select>
                  </label>
                  <label>
                    Idade
                    <input
                      className="field mt-1"
                      placeholder="Ex.: 4 anos"
                      value={b.age}
                      onChange={(e) => set("age", e.target.value)}
                    />
                  </label>
                  <label>
                    Sexo
                    <select
                      className="field mt-1"
                      value={b.sex}
                      onChange={(e) => set("sex", e.target.value)}
                    >
                      <option value="">Não informar</option>
                      <option>Macho</option>
                      <option>Fêmea</option>
                    </select>
                  </label>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h3 className="text-2xl font-black">
                  Existe algo que precisamos saber?
                </h3>
                <p className="mb-5 text-gray-500">
                  Conte sobre condição especial, ansiedade, alergia ou
                  restrição. Isso não substitui avaliação veterinária.
                </p>
                <label className="sr-only" htmlFor="notes">
                  Observações
                </label>
                <textarea
                  id="notes"
                  className="field min-h-40"
                  placeholder="Escreva suas observações (opcional)"
                  value={b.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </>
            )}
            {step === 4 && (
              <>
                <h3 className="mb-5 text-2xl font-black">
                  Qual sua preferência?
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    Data desejada *
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="field mt-1"
                      value={b.date}
                      onChange={(e) => set("date", e.target.value)}
                    />
                  </label>
                  <label>
                    Período *
                    <select
                      className="field mt-1"
                      value={b.period}
                      onChange={(e) => set("period", e.target.value)}
                    >
                      <option>Manhã</option>
                      <option>Tarde</option>
                      <option>Qualquer horário</option>
                    </select>
                  </label>
                </div>
                <p className="mt-5 rounded-xl bg-orange-50 p-4 text-sm">
                  O horário será confirmado pela equipe da Nosso Pet pelo
                  WhatsApp.
                </p>
              </>
            )}
            {step === 5 && (
              <>
                <h3 className="mb-5 text-2xl font-black">
                  Tudo certo, {b.name}?
                </h3>
                <dl className="grid gap-3 rounded-2xl bg-cream p-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-bold text-gray-500">PET</dt>
                    <dd className="font-black">
                      {b.name} · {b.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-gray-500">
                      RAÇA / PORTE
                    </dt>
                    <dd className="font-black">
                      {b.breed || "Não informada"} · {b.size}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-gray-500">
                      SERVIÇOS
                    </dt>
                    <dd className="font-black">{b.services.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-gray-500">
                      PREFERÊNCIA
                    </dt>
                    <dd className="font-black">
                      {b.date.split("-").reverse().join("/")} · {b.period}
                    </dd>
                  </div>
                </dl>
                <a
                  className="btn btn-primary mt-6 w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={whatsappUrl(bookingMessage(b), whatsappRaw)}
                >
                  <Send size={18} />
                  Enviar solicitação pelo WhatsApp
                </a>
              </>
            )}
            <div className="mt-7 flex justify-between">
              {step > 1 ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep(step - 1)}
                >
                  <ChevronLeft />
                  Voltar
                </button>
              ) : (
                <span />
              )}
              {step < 5 && (
                <button
                  disabled={!valid}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => setStep(step + 1)}
                >
                  Continuar
                  <ChevronRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
