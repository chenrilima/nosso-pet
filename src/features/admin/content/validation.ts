import type { HomeContentUpdate } from "@/data/repositories/business.repository";

const fields = {
  heroTitle: ["hero_title", 120, true], heroHighlight: ["hero_highlight", 60, true], heroDescription: ["hero_description", 400, true],
  heroPrimaryCta: ["hero_primary_cta", 60, true], heroSecondaryCta: ["hero_secondary_cta", 60, true], aboutTitle: ["about_title", 160, true],
  aboutDescription: ["about_description", 1000, true], aboutFeatureOneTitle: ["about_feature_one_title", 100, true], aboutFeatureTwoTitle: ["about_feature_two_title", 100, true],
  footerDescription: ["footer_description", 400, true], footerContactTitle: ["footer_contact_title", 80, true], footerLocationTitle: ["footer_location_title", 80, true],
  taxipetTitle: ["taxipet_title", 160, true], taxipetRegion: ["taxipet_region", 160, false],
  taxipetNote: ["taxipet_note", 400, false], taxipetCta: ["taxipet_cta", 60, true],
} as const;

export function validateHomeContent(data: FormData): { values?: HomeContentUpdate; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const values: Record<string, string | null> = {};
  for (const [formKey, [column, max, required]] of Object.entries(fields)) {
    const value = String(data.get(formKey) ?? "").trim();
    if (required && !value) fieldErrors[formKey] = "Campo obrigatório.";
    else if (value.length > max) fieldErrors[formKey] = `Use no máximo ${max} caracteres.`;
    values[column] = value || null;
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return { fieldErrors, values: values as HomeContentUpdate };
}
