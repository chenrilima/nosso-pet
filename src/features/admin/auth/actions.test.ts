import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createClient: vi.fn(), signInAdmin: vi.fn(), redirect: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("./service", () => ({ signInAdmin: mocks.signInAdmin, signOutAdmin: vi.fn() }));

import { loginAction } from "./actions";

const LOGIN_FAILURE_MESSAGE = "Não foi possível acessar o painel com essas credenciais.";

function credentials() {
  const data = new FormData();
  data.set("email", "user@example.com");
  data.set("password", "secret");
  return data;
}

describe("login action", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.createClient.mockResolvedValue({}); });

  it.each(["invalid_credentials", "not_admin"] as const)("uses the same safe message for %s", async (reason) => {
    mocks.signInAdmin.mockResolvedValue({ ok: false, reason });
    await expect(loginAction({ status: "idle" }, credentials())).resolves.toEqual({ status: "error", message: LOGIN_FAILURE_MESSAGE });
  });
});
