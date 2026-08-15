import { afterEach, describe, expect, it, vi } from "vitest";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function loadEnvironment() {
  vi.resetModules();
  return import("./env");
}

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalKey;
});

describe("getSupabaseEnvironment", () => {
  it("returns the configured public environment", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    const { getSupabaseEnvironment } = await loadEnvironment();

    expect(getSupabaseEnvironment()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "publishable-key",
    });
  });

  it.each([
    ["NEXT_PUBLIC_SUPABASE_URL", ""],
    ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "https://example.supabase.co"],
  ])("reports a missing %s explicitly", async (missingName, url) => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "";
    const { getSupabaseEnvironment } = await loadEnvironment();

    expect(() => getSupabaseEnvironment()).toThrow(
      `Missing environment variable: ${missingName}`,
    );
  });
});
