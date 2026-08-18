import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), createClient: vi.fn(() => Promise.resolve({})), revalidatePath: vi.fn(), getAdminOptionGroup: vi.fn(), getAdminOption: vi.fn(), updateOptionGroup: vi.fn(), deleteOptionGroup: vi.fn(), updateOption: vi.fn(), deleteOption: vi.fn(), createOption: vi.fn(), createOptionGroup: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/features/admin/auth/server", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("@/data/repositories/catalog.repository", () => mocks);

import { deleteOptionAction, saveGroupAction, saveOptionAction } from "./actions";

const groupId = "93200000-0000-4000-8000-000000000001";
const optionId = "93300000-0000-4000-8000-000000000001";
const previous = { ok: true as const, message: "" };
const form = () => { const data = new FormData(); data.set("name", "Item"); data.set("sortOrder", "0"); return data; };

describe("catalog actions", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.requireAdmin.mockResolvedValue({ id: "admin" }); });
  it("does not report success when an edited group is missing", async () => { mocks.getAdminOptionGroup.mockResolvedValue(null); await expect(saveGroupAction(groupId, groupId, previous, form())).resolves.toMatchObject({ ok: false, message: "Grupo não encontrado." }); expect(mocks.updateOptionGroup).not.toHaveBeenCalled(); });
  it("does not report success when an edited option is missing", async () => { mocks.getAdminOption.mockResolvedValue(null); await expect(saveOptionAction(optionId, groupId, previous, form())).resolves.toMatchObject({ ok: false, message: "Opção não encontrada." }); expect(mocks.updateOption).not.toHaveBeenCalled(); });
  it("does not report success when a deleted option is missing", async () => { mocks.getAdminOption.mockResolvedValue(null); await expect(deleteOptionAction(optionId, previous)).resolves.toMatchObject({ ok: false, message: "Opção não encontrada." }); expect(mocks.deleteOption).not.toHaveBeenCalled(); expect(mocks.revalidatePath).not.toHaveBeenCalled(); });
});
