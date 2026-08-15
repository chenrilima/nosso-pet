import { describe, expect, it } from "vitest";
import type { DatabaseClient } from "@/data/repositories/shared";
import { getAdminDashboardSummary } from "./repository";

describe("admin dashboard repository", () => {
  it("uses exact head-only counts and returns the summary", async () => {
    const counts: Record<string, number> = { products: 5, categories: 4, services: 8, faqs: 7, gallery_images: 0 };
    const calls: unknown[][] = [];
    const client = { from: (table: string) => ({ select: (...args: unknown[]) => { calls.push([table, ...args]); return Promise.resolve({ count: counts[table], error: null }); } }) } as unknown as DatabaseClient;
    await expect(getAdminDashboardSummary(client)).resolves.toEqual({ products: 5, categories: 4, services: 8, faqs: 7, galleryImages: 0 });
    expect(calls).toHaveLength(5);
    expect(calls.every(([, columns, options]) => columns === "id" && JSON.stringify(options) === JSON.stringify({ count: "exact", head: true }))).toBe(true);
  });
});
