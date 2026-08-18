import { describe, expect, it } from "vitest";
import type { DatabaseClient } from "./shared";
import { RepositoryError } from "./shared";
import { listActiveCategoryRows } from "./categories.repository";
import { listPublishedFaqRows } from "./faqs.repository";
import { listPublishedGalleryImageRows } from "./gallery.repository";
import { listActiveServiceRows, listBookableServiceRows } from "./services.repository";

function fakeClient(error: { code: string; message: string } | null = null) {
  const calls: Array<[string, ...unknown[]]> = [];
  const builder = {
    select: (...args: unknown[]) => { calls.push(["select", ...args]); return builder; },
    eq: (...args: unknown[]) => { calls.push(["eq", ...args]); return builder; },
    order: (...args: unknown[]) => { calls.push(["order", ...args]); return builder; },
    then: <T>(resolve: (value: { data: never[]; error: typeof error }) => T) => Promise.resolve(resolve({ data: [], error })),
  };
  const client = { from: (table: string) => { calls.push(["from", table]); return builder; } } as unknown as DatabaseClient;
  return { client, calls };
}

describe("public repositories", () => {
  it.each([
    ["categories", listActiveCategoryRows, ["eq", "is_active", true]],
    ["faqs", listPublishedFaqRows, ["eq", "is_published", true]],
    ["gallery_images", listPublishedGalleryImageRows, ["eq", "is_published", true]],
  ] as const)("filters and orders %s", async (table, repository, filter) => {
    const { client, calls } = fakeClient();
    await repository(client);
    expect(calls).toContainEqual(["from", table]);
    expect(calls).toContainEqual(filter);
    expect(calls).toContainEqual(["order", "sort_order"]);
    expect(calls.find(([operation]) => operation === "select")?.[1]).not.toBe("*");
  });

  it("derives public and bookable services from the same table", async () => {
    const publicFake = fakeClient();
    const bookableFake = fakeClient();
    await listActiveServiceRows(publicFake.client);
    await listBookableServiceRows(bookableFake.client);
    expect(publicFake.calls).toContainEqual(["from", "services"]);
    expect(bookableFake.calls).toContainEqual(["from", "services"]);
    expect(bookableFake.calls).toContainEqual(["eq", "is_bookable", true]);
    expect(publicFake.calls).not.toContainEqual(["eq", "is_bookable", true]);
    expect(publicFake.calls.find(([operation]) => operation === "select")?.[1]).not.toBe("*");
  });

  it("wraps infrastructure failures in RepositoryError", async () => {
    const { client } = fakeClient({ code: "08006", message: "sensitive connection detail" });
    await expect(listActiveCategoryRows(client)).rejects.toBeInstanceOf(RepositoryError);
  });
});
