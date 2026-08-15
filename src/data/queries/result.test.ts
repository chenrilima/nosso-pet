import { describe, expect, it } from "vitest";
import { RepositoryError } from "@/data/repositories/shared";
import { runPublicQuery } from "./result";

describe("public query result", () => {
  it("keeps an empty response as a successful result", async () => expect(await runPublicQuery("gallery", async () => [])).toEqual({ ok: true, data: [] }));
  it("converts repository errors without leaking their message", async () => {
    const result = await runPublicQuery("products", async () => { throw new RepositoryError("products", "read", "08006"); });
    expect(result).toEqual({ ok: false, error: { code: "DATA_ACCESS_ERROR", entity: "products", operation: "read", retryable: true } });
    expect(JSON.stringify(result)).not.toContain("08006");
  });
});
