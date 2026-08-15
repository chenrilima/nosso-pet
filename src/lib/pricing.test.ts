import { describe, expect, it } from "vitest";
import { formatCurrencyBRL, presentServicePrice } from "./pricing";

describe("public price presentation", () => {
  it.each([
    [0, "R$ 0,00"],
    [129.9, "R$ 129,90"],
    [1234.56, "R$ 1.234,56"],
  ])("formats %s in BRL", (value, expected) => {
    expect(formatCurrencyBRL(value)).toBe(expected);
  });

  it("uses the service pricing discriminator", () => {
    expect(presentServicePrice({ pricingType: "fixed", price: 50, priceFrom: null })).toBe("R$ 50,00");
    expect(presentServicePrice({ pricingType: "starting_at", price: null, priceFrom: 120 })).toBe("A partir de R$ 120,00");
    expect(presentServicePrice({ pricingType: "quote", price: null, priceFrom: null })).toBe("Consulte");
  });

  it("does not improvise a value when the selected price field is absent", () => {
    expect(presentServicePrice({ pricingType: "fixed", price: null, priceFrom: 99 })).toBeNull();
    expect(presentServicePrice({ pricingType: "starting_at", price: 99, priceFrom: null })).toBeNull();
  });
});
