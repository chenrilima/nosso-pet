import { describe, expect, it, vi } from "vitest";
import type { PublicSiteQueries } from "./public-site.query";
import { getPublicSiteData, getPublicSiteDataWithFallback } from "./public-site.query";

const ok = <T>(data: T) => Promise.resolve({ ok: true as const, data });
const failed = () => Promise.resolve({ ok: false as const, error: { code: "DATA_ACCESS_ERROR" as const, entity: "services" as const, operation: "read" as const, retryable: true } });
const queries = (serviceResult: ReturnType<PublicSiteQueries["services"]> = ok([])): PublicSiteQueries => ({ business: vi.fn(() => ok(null)), categories: vi.fn(() => ok([])), services: vi.fn(() => serviceResult), bookableServices: vi.fn(() => ok([])), gallery: vi.fn(() => ok([])), faqs: vi.fn(() => ok([])) });

describe("public site aggregation and fallback", () => {
  it("aggregates successful resources without fallback", async () => {
    const result = await getPublicSiteDataWithFallback(queries());
    expect(result.source).toBe("remote");
    expect(result.warnings).toEqual([]);
    expect(result.data.gallery).toEqual([]);
  });

  it("uses only the failed resource fallback and identifies mixed origin", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await getPublicSiteDataWithFallback(queries(failed()));
    expect(result.source).toBe("mixed");
    expect(result.sources.services).toBe("fallback");
    expect(result.sources.gallery).toBe("remote");
    expect(result.data.services).toHaveLength(7);
    expect(result.data.services.map((service) => service.slug)).not.toContain("taxipet");
    expect(result.warnings).toHaveLength(1);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("returns a typed failure from the strict aggregator", async () => {
    const result = await getPublicSiteData(queries(failed()));
    expect(result).toMatchObject({ ok: false, error: { entity: "services" } });
  });

  it("does not invent the UI-only Other service", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await getPublicSiteDataWithFallback({ ...queries(), bookableServices: vi.fn(() => failed()) });
    expect(result.data.bookableServices.map((service) => service.name)).not.toContain("Outro");
    spy.mockRestore();
  });

  it("supports a complete fallback without replacing valid empty lists", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const failingQueries: PublicSiteQueries = {
      business: vi.fn(() => failed()),
      categories: vi.fn(() => failed()),
      services: vi.fn(() => failed()),
      bookableServices: vi.fn(() => failed()),
      gallery: vi.fn(() => failed()),
      faqs: vi.fn(() => failed()),
    };
    const fallback = await getPublicSiteDataWithFallback(failingQueries);
    const remoteEmpty = await getPublicSiteDataWithFallback(queries());

    expect(fallback.source).toBe("fallback");
    expect(fallback.data.categories).toEqual([]);
    expect(remoteEmpty.data.services).toEqual([]);
    expect(remoteEmpty.data.faqs).toEqual([]);
    spy.mockRestore();
  });

  it("keeps an empty gallery for presentation to resolve after a technical failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await getPublicSiteDataWithFallback({
      ...queries(),
      gallery: vi.fn(() => failed()),
    });
    expect(result.sources.gallery).toBe("fallback");
    expect(result.data.gallery).toEqual([]);
    spy.mockRestore();
  });
});
