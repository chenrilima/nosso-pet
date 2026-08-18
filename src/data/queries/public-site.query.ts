import { fallbackBookableServices, fallbackCategories, fallbackFaqs, fallbackServices } from "@/data/fallbacks/public-site.fallback";
import type { PublicSiteData } from "@/types/domain";
import { getPublicBusinessSettings } from "./business.query";
import { getActiveCategories } from "./categories.query";
import { createPublicQueryContext } from "./context";
import { getPublishedFaqs } from "./faqs.query";
import { getPublishedGallery } from "./gallery.query";
import type { DataAccessError, PublicDataResult } from "./result";
import { getBookableServices, getPublicServices } from "./services.query";

export type PublicDataResource = keyof PublicSiteData;
export type PublicDataSource = "remote" | "fallback";
export type PublicSiteDataWithFallback = { data: PublicSiteData; source: PublicDataSource | "mixed"; sources: Record<PublicDataResource, PublicDataSource>; warnings: DataAccessError[] };

export type PublicSiteQueries = {
  business: typeof getPublicBusinessSettings;
  categories: typeof getActiveCategories;
  services: typeof getPublicServices;
  bookableServices: typeof getBookableServices;
  gallery: typeof getPublishedGallery;
  faqs: typeof getPublishedFaqs;
};

const defaultQueries: PublicSiteQueries = { business: getPublicBusinessSettings, categories: getActiveCategories, services: getPublicServices, bookableServices: getBookableServices, gallery: getPublishedGallery, faqs: getPublishedFaqs };

async function executePublicQueries(queries: PublicSiteQueries) {
  const context = queries === defaultQueries ? await createPublicQueryContext() : undefined;
  return Promise.all([queries.business(context), queries.categories(context), queries.services(context), queries.bookableServices(context), queries.gallery(context), queries.faqs(context)]);
}

export async function getPublicSiteData(queries: PublicSiteQueries = defaultQueries): Promise<PublicDataResult<PublicSiteData>> {
  const [business, categories, servicesResult, bookableServices, gallery, faqs] = await executePublicQueries(queries);
  const results = [business, categories, servicesResult, bookableServices, gallery, faqs];
  const failure = results.find((result) => !result.ok);
  if (failure && !failure.ok) return failure;
  if (!business.ok || !categories.ok || !servicesResult.ok || !bookableServices.ok || !gallery.ok || !faqs.ok) throw new Error("Resultado inconsistente.");
  return { ok: true, data: { business: business.data, categories: categories.data, services: servicesResult.data, bookableServices: bookableServices.data, gallery: gallery.data, faqs: faqs.data } };
}

export async function getPublicSiteDataWithFallback(queries: PublicSiteQueries = defaultQueries): Promise<PublicSiteDataWithFallback> {
  const [business, categories, servicesResult, bookableServices, gallery, faqs] = await executePublicQueries(queries);
  const pairs = { business, categories, services: servicesResult, bookableServices, gallery, faqs };
  const warnings = Object.values(pairs).filter((result): result is { ok: false; error: DataAccessError } => !result.ok).map((result) => result.error);
  if (warnings.length) console.error(JSON.stringify({ event: "public_data_fallback", failures: warnings.map(({ entity, operation, retryable }) => ({ entity, operation, retryable })) }));
  const sources = Object.fromEntries(Object.entries(pairs).map(([key, result]) => [key, result.ok ? "remote" : "fallback"])) as Record<PublicDataResource, PublicDataSource>;
  const sourceValues = Object.values(sources);
  const source = sourceValues.every((value) => value === "remote") ? "remote" : sourceValues.every((value) => value === "fallback") ? "fallback" : "mixed";
  return { data: { business: business.ok ? business.data : null, categories: categories.ok ? categories.data : fallbackCategories, services: servicesResult.ok ? servicesResult.data : fallbackServices, bookableServices: bookableServices.ok ? bookableServices.data : fallbackBookableServices, gallery: gallery.ok ? gallery.data : [], faqs: faqs.ok ? faqs.data : fallbackFaqs }, source, sources, warnings };
}
