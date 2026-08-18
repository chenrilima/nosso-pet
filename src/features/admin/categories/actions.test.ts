import { beforeEach, describe, expect, it, vi } from "vitest";
import { RepositoryError } from "@/data/repositories/shared";

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), revalidatePath: vi.fn(), createCategory: vi.fn(), getAdminCategory: vi.fn(), updateCategory: vi.fn(), toggleCategory: vi.fn(), deleteCategory: vi.fn(), createClient: vi.fn(() => Promise.resolve({})) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/features/admin/auth/server", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("@/data/repositories/categories.repository", () => ({ createCategory: mocks.createCategory, getAdminCategory: mocks.getAdminCategory, updateCategory: mocks.updateCategory, toggleCategory: mocks.toggleCategory, deleteCategory: mocks.deleteCategory }));

import { createCategoryAction, deleteCategoryAction, toggleCategoryAction, updateCategoryAction } from "./actions";
const previous = { ok: true as const, message: "" };
const id = "20000000-0000-4000-8000-000000000001";
function form() { const data = new FormData(); data.set("name", "Rações"); data.set("sortOrder", "1"); data.set("isActive", "on"); return data; }

describe("category actions", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.requireAdmin.mockResolvedValue({ id: "admin" }); mocks.getAdminCategory.mockResolvedValue({ id }); mocks.deleteCategory.mockResolvedValue("deleted"); });
  it("authorizes, creates and revalidates the home", async () => { await expect(createCategoryAction(previous, form())).resolves.toMatchObject({ ok: true }); expect(mocks.requireAdmin).toHaveBeenCalledOnce(); expect(mocks.createCategory).toHaveBeenCalledWith({}, { name: "Rações", slug: "racoes", description: "", sort_order: 1, is_active: true }); expect(mocks.revalidatePath).toHaveBeenCalledWith("/"); });
  it("returns a friendly duplicate slug error", async () => { mocks.createCategory.mockRejectedValue(new RepositoryError("categories", "write", "23505")); await expect(createCategoryAction(previous, form())).resolves.toMatchObject({ ok: false, message: "Já existe uma categoria com esse slug." }); });
  it("updates and toggles through independently authorized actions", async () => { await updateCategoryAction(id, previous, form()); await toggleCategoryAction(id, false, previous); expect(mocks.requireAdmin).toHaveBeenCalledTimes(2); expect(mocks.updateCategory).toHaveBeenCalledOnce(); expect(mocks.toggleCategory).toHaveBeenCalledWith({}, id, false); expect(mocks.revalidatePath.mock.calls.filter(([path]) => path === "/")).toHaveLength(2); });
  it("blocks deletion in use and does not revalidate", async () => { mocks.deleteCategory.mockResolvedValue("in_use"); await expect(deleteCategoryAction(id, previous)).resolves.toMatchObject({ ok: false, message: expect.stringContaining("grupos") }); expect(mocks.revalidatePath).not.toHaveBeenCalled(); });
  it("does not report success for a missing category", async () => { mocks.getAdminCategory.mockResolvedValue(null); await expect(updateCategoryAction(id, previous, form())).resolves.toMatchObject({ ok: false, message: "Categoria não encontrada." }); expect(mocks.updateCategory).not.toHaveBeenCalled(); });
  it("does not reach the repository when authorization fails", async () => { mocks.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT")); await expect(createCategoryAction(previous, form())).rejects.toThrow("NEXT_REDIRECT"); expect(mocks.createCategory).not.toHaveBeenCalled(); });
});
