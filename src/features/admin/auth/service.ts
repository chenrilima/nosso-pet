import type { DatabaseClient } from "@/data/repositories/shared";
import type { AdminUser } from "./types";

type Credentials = { email: string; password: string };

export async function getCurrentUser(client: DatabaseClient) {
  const { data, error } = await client.auth.getUser();
  return error ? null : data.user;
}

export async function getCurrentAdmin(client: DatabaseClient): Promise<AdminUser | null> {
  const user = await getCurrentUser(client);
  if (!user?.email) return null;

  const { data: profile, error } = await client
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") return null;
  return {
    id: profile.id,
    email: user.email,
    displayName: profile.display_name,
    role: "admin",
  };
}

export async function signInAdmin(client: DatabaseClient, credentials: Credentials) {
  const { error } = await client.auth.signInWithPassword(credentials);
  if (error) return { ok: false as const, reason: "invalid_credentials" as const };

  const admin = await getCurrentAdmin(client);
  if (!admin) {
    await client.auth.signOut();
    return { ok: false as const, reason: "not_admin" as const };
  }
  return { ok: true as const, admin };
}

export async function signOutAdmin(client: DatabaseClient) {
  await client.auth.signOut();
}
