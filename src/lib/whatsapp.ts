import { business } from "@/config/business";
export type Booking = {
  services: string[];
  name: string;
  type: string;
  breed: string;
  size: string;
  age: string;
  sex: string;
  notes: string;
  date: string;
  period: string;
};
export const whatsappUrl = (message: string, number = business.whatsappRaw) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
export function bookingMessage(b: Booking) {
  return `Olá! 👋 Gostaria de solicitar um atendimento na Nosso Pet.\n\n🐾 PET\nNome: ${b.name}\nTipo: ${b.type}\nRaça: ${b.breed || "Não informada"}\nPorte: ${b.size}\nIdade: ${b.age || "Não informada"}\nSexo: ${b.sex || "Não informado"}\n\n🛁 SERVIÇOS\n${b.services.join(", ")}\n\n📅 PREFERÊNCIA\nData: ${b.date.split("-").reverse().join("/")}\nPeríodo: ${b.period}\n\n📝 OBSERVAÇÕES\n${b.notes || "Nenhuma observação."}\n\nPodem me informar os horários disponíveis?`;
}
export const taxiMessage = (d: Record<string, string>) =>
  `Olá! Gostaria de consultar o TaxiPet.\n\n👤 Nome: ${d.name}\n📍 Bairro: ${d.district}\n🏠 Endereço/CEP: ${d.address}\n🐾 Pet: ${d.pet}\n🛁 Serviço: ${d.service}\n📅 Data desejada: ${d.date.split("-").reverse().join("/")}\n\nPodem confirmar a disponibilidade?`;
export const cartMessage = (items: { name: string; quantity: number }[]) =>
  `Olá! Gostaria de consultar estes produtos:\n\n🛒 PEDIDO\n\n${items.map((i) => `${i.quantity}x ${i.name}`).join("\n")}\n\nForma desejada: Retirada / consultar entrega\n\nPode confirmar disponibilidade e valores?`;
