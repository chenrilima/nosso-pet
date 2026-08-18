import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), getBusinessSettingsForAdmin: vi.fn(), updateHomeContent: vi.fn(), createClient: vi.fn(() => Promise.resolve({})), revalidatePath: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/features/admin/auth/server", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("@/data/repositories/business.repository", () => ({ getBusinessSettingsForAdmin: mocks.getBusinessSettingsForAdmin, updateHomeContent: mocks.updateHomeContent }));
import { updateHomeContentAction } from "./actions";

const id = "10000000-0000-4000-8000-000000000001";
const form = () => { const data = new FormData(); for (const key of ["heroTitle", "heroHighlight", "heroDescription", "heroPrimaryCta", "heroSecondaryCta", "aboutTitle", "aboutDescription", "aboutFeatureOneTitle", "aboutFeatureTwoTitle", "footerDescription", "footerContactTitle", "footerLocationTitle", "taxipetTitle", "taxipetCta"]) data.set(key, key); return data; };

describe("home content action", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.getBusinessSettingsForAdmin.mockResolvedValue({ id }); });
  it("authorizes, persists whitelisted content and revalidates the public page", async () => {
    await expect(updateHomeContentAction(id, { ok: true, message: "" }, form())).resolves.toMatchObject({ ok: true });
    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    expect(mocks.updateHomeContent).toHaveBeenCalledWith({}, id, expect.objectContaining({ hero_title: "heroTitle" }));
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
  });
  it("does not report success when the singleton changed or disappeared", async () => { mocks.getBusinessSettingsForAdmin.mockResolvedValue(null); await expect(updateHomeContentAction(id, { ok: true, message: "" }, form())).resolves.toMatchObject({ ok: false, message: "Configuração não encontrada." }); expect(mocks.updateHomeContent).not.toHaveBeenCalled(); });
});
