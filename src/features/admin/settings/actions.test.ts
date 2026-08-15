import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), revalidatePath: vi.fn(), updateBusinessSettings: vi.fn(), createClient: vi.fn(() => Promise.resolve({})) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/features/admin/auth/server", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("@/data/repositories/business.repository", () => ({ updateBusinessSettings: mocks.updateBusinessSettings }));
import { updateBusinessSettingsAction } from "./actions";
import { BUSINESS_DAYS } from "./validation";

function form() { const data = new FormData(); Object.entries({ name: "Nosso Pet", shortName: "Pet", phone: "(11) 4558-3210", whatsapp: "(11) 96644-2719", instagramHandle: "@pet", instagramUrl: "https://instagram.com/pet", addressLine: "Rua", district: "Centro", city: "Taboão", state: "SP", postalCode: "06765-000", mapsUrl: "https://maps.google.com/a", mapsEmbedUrl: "https://maps.google.com/b" }).forEach(([k, v]) => data.set(k, v)); for (const [day] of BUSINESS_DAYS) { data.set(`hours_${day}_open`, "on"); data.set(`hours_${day}_start`, "08:00"); data.set(`hours_${day}_end`, "18:00"); } return data; }

describe("business settings action", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.requireAdmin.mockResolvedValue({ id: "admin" }); });
  it("authorizes, updates and revalidates the home", async () => { await expect(updateBusinessSettingsAction("business", { ok: true, message: "" }, form())).resolves.toMatchObject({ ok: true }); expect(mocks.requireAdmin).toHaveBeenCalledOnce(); expect(mocks.updateBusinessSettings).toHaveBeenCalledOnce(); expect(mocks.revalidatePath).toHaveBeenCalledWith("/"); });
  it("returns validation errors without writing", async () => { const data = form(); data.set("phone", "invalid"); await expect(updateBusinessSettingsAction("business", { ok: true, message: "" }, data)).resolves.toMatchObject({ ok: false, fieldErrors: { phone: expect.any(String) } }); expect(mocks.updateBusinessSettings).not.toHaveBeenCalled(); });
  it("returns a safe unexpected error", async () => { const spy = vi.spyOn(console, "error").mockImplementation(() => undefined); mocks.updateBusinessSettings.mockRejectedValue(new Error("database secret")); await expect(updateBusinessSettingsAction("business", { ok: true, message: "" }, form())).resolves.toEqual({ ok: false, message: "Não foi possível salvar os dados. Tente novamente." }); spy.mockRestore(); });
});
