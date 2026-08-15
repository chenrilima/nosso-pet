import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "./service";

export async function findCurrentAdmin() {
  return getCurrentAdmin(await createClient());
}

export async function requireAdmin() {
  const admin = await findCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
