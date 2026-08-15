import { describe, expect, it, vi } from "vitest";
import type { DatabaseClient } from "@/data/repositories/shared";
import { getCurrentAdmin, signInAdmin, signOutAdmin } from "./service";
import { validateLoginForm } from "./validation";

function authClient(options: { user?: { id: string; email?: string } | null; profile?: { id: string; display_name: string; role: "admin" } | null; authError?: boolean } = {}) {
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const builder = {
    select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn(),
  };
  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue({ data: options.profile ?? null, error: null });
  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: options.user ?? null }, error: options.authError ? new Error("invalid") : null }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: options.authError ? new Error("invalid") : null }),
      signOut,
    },
    from: vi.fn().mockReturnValue(builder),
  } as unknown as DatabaseClient;
  return { client, signOut, builder };
}

describe("admin auth", () => {
  it("rejects invalid credentials without querying a profile", async () => {
    const { client } = authClient({ authError: true });
    await expect(signInAdmin(client, { email: "a@b.com", password: "wrong" })).resolves.toEqual({ ok: false, reason: "invalid_credentials" });
    expect(client.from).not.toHaveBeenCalled();
  });

  it("rejects and signs out an Auth user without an admin profile", async () => {
    const { client, signOut } = authClient({ user: { id: "user-1", email: "user@example.com" } });
    await expect(signInAdmin(client, { email: "user@example.com", password: "secret" })).resolves.toEqual({ ok: false, reason: "not_admin" });
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("returns only the safe AdminUser model for an admin", async () => {
    const { client } = authClient({ user: { id: "admin-1", email: "admin@example.com" }, profile: { id: "admin-1", display_name: "Carlos", role: "admin" } });
    await expect(getCurrentAdmin(client)).resolves.toEqual({ id: "admin-1", email: "admin@example.com", displayName: "Carlos", role: "admin" });
  });

  it("accepts a valid admin login", async () => {
    const { client, signOut } = authClient({ user: { id: "admin-1", email: "admin@example.com" }, profile: { id: "admin-1", display_name: "Carlos", role: "admin" } });
    const result = await signInAdmin(client, { email: "admin@example.com", password: "secret" });
    expect(result).toMatchObject({ ok: true, admin: { id: "admin-1", role: "admin" } });
    expect(signOut).not.toHaveBeenCalled();
  });

  it("rejects a profile with an unexpected role", async () => {
    const fixture = authClient({ user: { id: "user-1", email: "user@example.com" } });
    fixture.builder.maybeSingle.mockResolvedValue({ data: { id: "user-1", display_name: "User", role: "editor" }, error: null });
    await expect(getCurrentAdmin(fixture.client)).resolves.toBeNull();
  });

  it("returns null for an invalid session", async () => {
    const { client } = authClient({ authError: true });
    await expect(getCurrentAdmin(client)).resolves.toBeNull();
  });

  it("signs out", async () => {
    const { client, signOut } = authClient();
    await signOutAdmin(client);
    expect(signOut).toHaveBeenCalledOnce();
  });
});

describe("login validation", () => {
  it("validates required fields and email format", () => {
    const missing = validateLoginForm(new FormData());
    expect(missing.fieldErrors).toEqual({ email: "Informe seu e-mail.", password: "Informe sua senha." });
    const invalid = new FormData(); invalid.set("email", "invalid"); invalid.set("password", "secret");
    expect(validateLoginForm(invalid).fieldErrors?.email).toBe("Informe um e-mail válido.");
  });

  it("normalizes valid credentials", () => {
    const form = new FormData(); form.set("email", " admin@example.com "); form.set("password", "secret");
    expect(validateLoginForm(form).credentials).toEqual({ email: "admin@example.com", password: "secret" });
  });
});
