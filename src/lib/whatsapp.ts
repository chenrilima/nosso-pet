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
  return `Olá! Gostaria de solicitar um atendimento na ${businessName}.\n\nPET\nNome: ${b.name}\nTipo: ${b.type}\nRaça: ${b.breed || "Não informada"}\nPorte: ${b.size}\nIdade: ${b.age || "Não informada"}\nSexo: ${b.sex || "Não informado"}\n\nSERVIÇOS\n${b.services.join(", ")}\n\nPREFERÊNCIA\nData: ${b.date.split("-").reverse().join("/")}\nPeríodo: ${b.period}\n\nOBSERVAÇÕES\n${b.notes || "Nenhuma observação."}\n\nPodem me informar os horários disponíveis?`;
}
export const generalInquiryMessage = (businessName: string) =>
  `Olá! Vim pelo site da ${businessName} e gostaria de mais informações.`;
export const bookingInquiryMessage = (businessName: string) =>
  `Olá! Vim pelo site da ${businessName} e gostaria de agendar um atendimento.`;
export const taxiMessage = (d: Record<string, string>, info?: { region: string | null; price: string | null }) =>
  `Olá! Gostaria de consultar o TaxiPet.\n\nNome: ${d.name}\nBairro: ${d.district}\nEndereço/CEP: ${d.address}\nPet: ${d.pet}\nServiço: ${d.service}\nData desejada: ${d.date.split("-").reverse().join("/")}${info?.region ? `\nRegião informada: ${info.region}` : ""}${info?.price ? `\nInformação de preço: ${info.price}` : ""}\n\nPodem confirmar a disponibilidade?`;
export const cartMessage = (items: PurchaseIntent[]) =>
  `Olá! Gostaria de consultar estes produtos:\n\nPEDIDO\n\n${items.map((item) => `${item.quantity}x ${item.categoryName}${item.selections.map((selection) => `\n• ${selection.groupName}: ${selection.optionName}`).join("")}`).join("\n\n")}\n\nForma desejada: Retirada / consultar entrega\n\nPode confirmar disponibilidade e valores?`;
