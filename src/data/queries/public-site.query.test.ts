import { describe, expect, it, vi } from "vitest";
import type { PublicSiteQueries } from "./public-site.query";
import { getPublicSiteData, getPublicSiteDataSafe } from "./public-site.query";

const ok = <T>(data: T) => Promise.resolve({ ok: true as const, data });
const failed = () => Promise.resolve({ ok: false as const, error: { code: "DATA_ACCESS_ERROR" as const, entity: "services" as const, operation: "read" as const, retryable: true } });
const queries = (serviceResult: ReturnType<PublicSiteQueries["services"]> = ok([])): PublicSiteQueries => ({ business: vi.fn(() => ok(null)), categories: vi.fn(() => ok([])), services: vi.fn(() => serviceResult), bookableServices: vi.fn(() => ok([])), gallery: vi.fn(() => ok([])), faqs: vi.fn(() => ok([])) });

describe("safe public site aggregation", () => {
  it("aggregates successful remote resources", async () => {
    const result = await getPublicSiteDataSafe(queries());
    expect(result.source).toBe("remote");
    expect(result.warnings).toEqual([]);
    expect(result.data.gallery).toEqual([]);
  });

  it("omits a failed commercial resource and identifies mixed origin", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await getPublicSiteDataSafe(queries(failed()));
    expect(result.source).toBe("mixed");
    expect(result.sources.services).toBe("unavailable");
    expect(result.sources.gallery).toBe("remote");
    expect(result.data.services).toEqual([]);
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
    const result = await getPublicSiteDataSafe({ ...queries(), bookableServices: vi.fn(() => failed()) });
    expect(result.data.bookableServices.map((service) => service.name)).not.toContain("Outro");
    spy.mockRestore();
  });

  it("returns neutral empty resources when every remote query fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const failingQueries: PublicSiteQueries = {
      business: vi.fn(() => failed()),
      categories: vi.fn(() => failed()),
      services: vi.fn(() => failed()),
      bookableServices: vi.fn(() => failed()),
      gallery: vi.fn(() => failed()),
      faqs: vi.fn(() => failed()),
    };
    const fallback = await getPublicSiteDataSafe(failingQueries);
    const remoteEmpty = await getPublicSiteDataSafe(queries());

    expect(fallback.source).toBe("unavailable");
    expect(fallback.data.categories).toEqual([]);
    expect(remoteEmpty.data.services).toEqual([]);
    expect(remoteEmpty.data.faqs).toEqual([]);
    spy.mockRestore();
  });

  it("keeps an empty gallery for presentation to resolve after a technical failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await getPublicSiteDataSafe({
      ...queries(),
      gallery: vi.fn(() => failed()),
    });
    expect(result.sources.gallery).toBe("unavailable");
    expect(result.data.gallery).toEqual([]);
    spy.mockRestore();
  });
});
