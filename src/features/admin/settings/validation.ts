import type { BusinessSettingsUpdate } from "@/data/repositories/business.repository";
import { BUSINESS_DAYS } from "@/lib/business-hours";
export { BUSINESS_DAYS } from "@/lib/business-hours";

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const required = (errors: Record<string, string>, key: string, value: string, max: number) => {
  if (!value) errors[key] = "Campo obrigatório.";
  else if (value.length > max) errors[key] = `Use no máximo ${max} caracteres.`;
};
const parseHttpsUrl = (value: string) => { try { const url = new URL(value); return url.protocol === "https:" ? url : null; } catch { return null; } };
const isInstagramUrl = (value: string) => { const url = parseHttpsUrl(value); return Boolean(url && (url.hostname === "instagram.com" || url.hostname === "www.instagram.com")); };
const GOOGLE_MAPS_HOSTS = new Set(["www.google.com", "maps.google.com"]);
const isGoogleMapsUrl = (value: string) => { const url = parseHttpsUrl(value); return Boolean(url && (GOOGLE_MAPS_HOSTS.has(url.hostname) || url.hostname === "maps.app.goo.gl")); };
const isGoogleMapsEmbedUrl = (value: string) => {
  const url = parseHttpsUrl(value);
  return Boolean(url && GOOGLE_MAPS_HOSTS.has(url.hostname) && url.pathname.startsWith("/maps") && (url.pathname.startsWith("/maps/embed") || url.searchParams.get("output") === "embed"));
};

export function normalizeBrazilianPhone(value: string, includeCountryCode: boolean): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);
  if (digits.length !== 10 && digits.length !== 11) return null;
  return includeCountryCode ? `55${digits}` : digits;
}

export function validateBusinessSettings(data: FormData): { values?: BusinessSettingsUpdate; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const fields = {
    name: text(data, "name"), shortName: text(data, "shortName"), phone: text(data, "phone"), whatsapp: text(data, "whatsapp"),
    instagramHandle: text(data, "instagramHandle"), instagramUrl: text(data, "instagramUrl"), addressLine: text(data, "addressLine"),
    district: text(data, "district"), city: text(data, "city"), state: text(data, "state").toUpperCase(), postalCode: text(data, "postalCode"),
    mapsUrl: text(data, "mapsUrl"), mapsEmbedUrl: text(data, "mapsEmbedUrl"),
  };
  for (const [key, value] of Object.entries(fields)) required(fieldErrors, key, value, key.includes("Url") ? 2000 : 120);
  const phoneRaw = normalizeBrazilianPhone(fields.phone, false);
  const whatsappRaw = normalizeBrazilianPhone(fields.whatsapp, true);
  if (!phoneRaw) fieldErrors.phone = "Informe um telefone brasileiro com DDD.";
  if (!whatsappRaw) fieldErrors.whatsapp = "Informe um WhatsApp brasileiro com DDD.";
  if (!/^@?[a-zA-Z0-9._]{1,30}$/.test(fields.instagramHandle)) fieldErrors.instagramHandle = "Informe um usuário válido do Instagram.";
  if (fields.instagramUrl && !isInstagramUrl(fields.instagramUrl)) fieldErrors.instagramUrl = "Informe uma URL HTTPS válida do Instagram.";
  if (fields.mapsUrl && !isGoogleMapsUrl(fields.mapsUrl)) fieldErrors.mapsUrl = "Informe uma URL HTTPS válida do Google Maps.";
  if (fields.mapsEmbedUrl && !isGoogleMapsEmbedUrl(fields.mapsEmbedUrl)) fieldErrors.mapsEmbedUrl = "Informe uma URL HTTPS válida de incorporação do Google Maps.";
  if (!/^[A-Z]{2}$/.test(fields.state)) fieldErrors.state = "Use a sigla do estado com 2 letras.";

  const hours: Record<string, string> = {};
  for (const [day] of BUSINESS_DAYS) {
    if (data.get(`hours_${day}_open`) !== "on") { hours[day] = "closed"; continue; }
    const start = text(data, `hours_${day}_start`); const end = text(data, `hours_${day}_end`);
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end) || start >= end) fieldErrors[`hours_${day}`] = "Informe início e fim válidos, com o fim após o início.";
    else hours[day] = `${start}-${end}`;
  }
  if (Object.keys(fieldErrors).length || !phoneRaw || !whatsappRaw) return { fieldErrors };
  return { fieldErrors, values: { name: fields.name, short_name: fields.shortName, phone: fields.phone, phone_raw: phoneRaw, whatsapp: fields.whatsapp, whatsapp_raw: whatsappRaw, instagram_handle: fields.instagramHandle.startsWith("@") ? fields.instagramHandle : `@${fields.instagramHandle}`, instagram_url: fields.instagramUrl, address_line: fields.addressLine, district: fields.district, city: fields.city, state: fields.state, postal_code: fields.postalCode, maps_url: fields.mapsUrl, maps_embed_url: fields.mapsEmbedUrl, hours } };
}
