import { describe, expect, it } from "vitest";
import { BUSINESS_DAYS, presentBusinessHours } from "./business-hours";

const all = (value: string) => Object.fromEntries(BUSINESS_DAYS.map(([day]) => [day, value]));

describe("business hours presentation", () => {
  it("formats all open days in PT-BR", () => {
    const result = presentBusinessHours(all("08:00-18:00"));
    expect(result?.[0]).toEqual({ day: "monday", label: "Segunda-feira", value: "08:00 – 18:00" });
    expect(result?.[6].label).toBe("Domingo");
  });

  it("presents mixed and all-closed schedules", () => {
    expect(presentBusinessHours({ ...all("08:00-18:00"), wednesday: "closed" })?.[2].value).toBe("Fechado");
    expect(presentBusinessHours(all("closed"))?.every(({ value }) => value === "Fechado")).toBe(true);
  });

  it("keeps the safe existing fallback when hours are absent", () => {
    expect(presentBusinessHours(null)).toBeNull();
  });
});
