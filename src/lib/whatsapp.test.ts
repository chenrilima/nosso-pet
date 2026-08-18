import { describe, expect, it } from "vitest";
import { bookingMessage, cartMessage, taxiMessage, whatsappUrl } from "@/lib/whatsapp";

const booking = { services: ["Banho", "Tosa higiênica"], name: "Luna", type: "Cachorro", breed: "Shih-tzu", size: "Pequeno", age: "4 anos", sex: "Fêmea", notes: "Alérgica a perfume", date: "2026-08-20", period: "Manhã" };

describe("WhatsApp message templates", () => {
  it("uses the dynamic business identity in a complete booking", () => {
    const message = bookingMessage(booking, "Nosso Pet Taboão");
    expect(message).toContain("atendimento na Nosso Pet Taboão");
    expect(message).toContain("Banho, Tosa higiênica");
    expect(message).toContain("Data: 20/08/2026");
  });

  it("preserves booking fallbacks for optional fields", () => {
    const message = bookingMessage({ ...booking, breed: "", age: "", sex: "", notes: "" }, "Pet");
    expect(message).toContain("Raça: Não informada");
    expect(message).toContain("Idade: Não informada");
    expect(message).toContain("Sexo: Não informado");
    expect(message).toContain("Nenhuma observação.");
  });

  it("builds TaxiPet and cart messages", () => {
    expect(taxiMessage({ name: "Ana", district: "Centro", address: "06765-000", pet: "Nina", service: "Banho", date: "2026-09-03" })).toContain("Data desejada: 03/09/2026");
    const message = cartMessage([{ id: "one", categoryId: "racoes", categoryName: "Rações", quantity: 2, selections: [{ groupId: "animal", groupName: "Pet", optionId: "caes", optionName: "Cães" }] }]);
    expect(message).toContain("2x Rações\n• Pet: Cães");
  });

  it("requires the configured number and URL-encodes the message", () => {
    expect(whatsappUrl("Olá & tudo bem? 🐾", "5511966442719")).toBe("https://wa.me/5511966442719?text=Ol%C3%A1%20%26%20tudo%20bem%3F%20%F0%9F%90%BE");
  });
});
