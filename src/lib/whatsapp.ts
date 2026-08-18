import type { PurchaseIntent } from "@/types/domain";
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
export const whatsappUrl = (message: string, number: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
export function bookingMessage(b: Booking, businessName: string) {
  return `Olá! 👋 Gostaria de solicitar um atendimento na ${businessName}.\n\n🐾 PET\nNome: ${b.name}\nTipo: ${b.type}\nRaça: ${b.breed || "Não informada"}\nPorte: ${b.size}\nIdade: ${b.age || "Não informada"}\nSexo: ${b.sex || "Não informado"}\n\n🛁 SERVIÇOS\n${b.services.join(", ")}\n\n📅 PREFERÊNCIA\nData: ${b.date.split("-").reverse().join("/")}\nPeríodo: ${b.period}\n\n📝 OBSERVAÇÕES\n${b.notes || "Nenhuma observação."}\n\nPodem me informar os horários disponíveis?`;
}
export const generalInquiryMessage = (businessName: string) =>
  `Olá! Vim pelo site da ${businessName} e gostaria de mais informações.`;
export const bookingInquiryMessage = (businessName: string) =>
  `Olá! Vim pelo site da ${businessName} e gostaria de agendar um atendimento.`;
export const taxiMessage = (d: Record<string, string>, info?: { region: string | null; price: string | null }) =>
  `Olá! Gostaria de consultar o TaxiPet.\n\n👤 Nome: ${d.name}\n📍 Bairro: ${d.district}\n🏠 Endereço/CEP: ${d.address}\n🐾 Pet: ${d.pet}\n🛁 Serviço: ${d.service}\n📅 Data desejada: ${d.date.split("-").reverse().join("/")}${info?.region ? `\n🗺️ Região informada: ${info.region}` : ""}${info?.price ? `\n💰 Informação de preço: ${info.price}` : ""}\n\nPodem confirmar a disponibilidade?`;
export const cartMessage = (items: PurchaseIntent[]) =>
  `Olá! Gostaria de consultar estes produtos:\n\n🛒 PEDIDO\n\n${items.map((item) => `${item.quantity}x ${item.categoryName}${item.selections.map((selection) => `\n• ${selection.groupName}: ${selection.optionName}`).join("")}`).join("\n\n")}\n\nForma desejada: Retirada / consultar entrega\n\nPode confirmar disponibilidade e valores?`;
