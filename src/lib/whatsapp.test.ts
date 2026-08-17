import { describe, expect, it } from "vitest";
import { bookingMessage, cartMessage, taxiMessage, whatsappUrl } from "@/lib/whatsapp";

describe("WhatsApp message templates", () => {
  it("builds a complete booking with multiple services", () => {
    expect(bookingMessage({ services: ["Banho", "Tosa higiênica"], name: "Luna", type: "Cachorro", breed: "Shih-tzu", size: "Pequeno", age: "4 anos", sex: "Fêmea", notes: "Alérgica a perfume", date: "2026-08-20", period: "Manhã" })).toBe(
      "Olá! 👋 Gostaria de solicitar um atendimento na Nosso Pet.\n\n🐾 PET\nNome: Luna\nTipo: Cachorro\nRaça: Shih-tzu\nPorte: Pequeno\nIdade: 4 anos\nSexo: Fêmea\n\n🛁 SERVIÇOS\nBanho, Tosa higiênica\n\n📅 PREFERÊNCIA\nData: 20/08/2026\nPeríodo: Manhã\n\n📝 OBSERVAÇÕES\nAlérgica a perfume\n\nPodem me informar os horários disponíveis?",
    );
  });

  it("preserves booking fallbacks for optional fields", () => {
    const message = bookingMessage({ services: ["Banho"], name: "Bob", type: "Gato", breed: "", size: "Médio", age: "", sex: "", notes: "", date: "2026-12-01", period: "Tarde" });
    expect(message).toContain("Raça: Não informada");
    expect(message).toContain("Idade: Não informada");
    expect(message).toContain("Sexo: Não informado");
    expect(message).toContain("Nenhuma observação.");
  });

  it("builds a TaxiPet message", () => {
    expect(taxiMessage({ name: "Ana", district: "Centro", address: "06765-000", pet: "Nina", service: "Banho", date: "2026-09-03" })).toBe("Olá! Gostaria de consultar o TaxiPet.\n\n👤 Nome: Ana\n📍 Bairro: Centro\n🏠 Endereço/CEP: 06765-000\n🐾 Pet: Nina\n🛁 Serviço: Banho\n📅 Data desejada: 03/09/2026\n\nPodem confirmar a disponibilidade?");
  });

  it("lists multiple cart items and their quantities", () => {
    const message = cartMessage([{ id: "one", categoryId: "racoes", categoryName: "Rações", quantity: 2, selections: [{ groupId: "animal", groupName: "Pet", optionId: "caes", optionName: "Cães" }, { groupId: "marca", groupName: "Marca", optionId: "premier", optionName: "Premier" }] }]);
    expect(message).toContain("2x Rações\n• Pet: Cães\n• Marca: Premier");
    expect(message).toContain("Forma desejada: Retirada / consultar entrega");
  });

  it("uses the configured number and URL-encodes special characters", () => {
    expect(whatsappUrl("Olá & tudo bem? 🐾")).toBe("https://wa.me/5511966442719?text=Ol%C3%A1%20%26%20tudo%20bem%3F%20%F0%9F%90%BE");
  });

  it("accepts a remote business number without changing the default", () => {
    expect(whatsappUrl("Olá", "5511999999999")).toBe(
      "https://wa.me/5511999999999?text=Ol%C3%A1",
    );
    expect(whatsappUrl("Olá")).toContain("5511966442719");
  });
});
