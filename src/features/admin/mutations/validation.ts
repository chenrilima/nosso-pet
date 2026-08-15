export function normalizeDecimal(raw: FormDataEntryValue | null): { value: string | null; error?: string } {
  const input = String(raw ?? "").trim();
  if (!input) return { value: null };
  const normalized = input.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return { value: null, error: "Informe um valor válido, com até duas casas decimais." };
  const [integer, fraction = ""] = normalized.split(".");
  const canonical = `${integer.replace(/^0+(?=\d)/, "") || "0"}.${fraction.padEnd(2, "0")}`;
  if (canonical.split(".")[0].length > 10) return { value: null, error: "O valor é maior que o permitido." };
  return { value: canonical };
}

export function validateNonNegativeInteger(raw: FormDataEntryValue | null, options: { nullable?: boolean; max?: number } = {}): { value: number | null; error?: string } {
  const input = String(raw ?? "").trim();
  if (!input && options.nullable) return { value: null };
  if (!/^\d+$/.test(input)) return { value: null, error: "Informe um número inteiro não negativo." };
  const value = Number(input);
  if (!Number.isSafeInteger(value) || (options.max !== undefined && value > options.max)) return { value: null, error: "Informe um valor dentro do limite permitido." };
  return { value };
}
