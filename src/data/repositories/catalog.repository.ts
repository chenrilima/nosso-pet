import type { Database } from "@/types/database";
import type { CatalogCategory } from "@/types/domain";
import { repositoryError, repositoryWriteError, type DatabaseClient } from "./shared";

export type OptionGroupRow = Database["public"]["Tables"]["product_option_groups"]["Row"];
export type OptionRow = Database["public"]["Tables"]["product_options"]["Row"];
export type AdminCatalogCategory = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name" | "slug" | "description" | "is_active" | "sort_order"> & { groups: Array<OptionGroupRow & { options: OptionRow[] }> };

export async function listPublicCatalog(client: DatabaseClient): Promise<CatalogCategory[]> {
  const [categoriesResult, groupsResult, optionsResult] = await Promise.all([
    client.from("categories").select("id,name,slug,description,sort_order").eq("is_active", true).order("sort_order").order("name"),
    client.from("product_option_groups").select("id, category_id, name, is_required, sort_order").eq("is_active", true).order("sort_order").order("name"),
    client.from("product_options").select("id, group_id, name, is_active, sort_order").eq("is_active", true).order("sort_order").order("name"),
  ]);
  const error = categoriesResult.error ?? groupsResult.error ?? optionsResult.error;
  if (error) throw repositoryError("catálogo de opções", error);
  return (categoriesResult.data ?? []).map((category) => ({
    id: category.id, name: category.name, slug: category.slug, description: category.description, sortOrder: category.sort_order,
    optionGroups: (groupsResult.data ?? []).filter((group) => group.category_id === category.id).map((group) => ({
      id: group.id, name: group.name, isRequired: group.is_required, sortOrder: group.sort_order,
      options: (optionsResult.data ?? []).filter((option) => option.group_id === group.id).map((option) => ({ id: option.id, name: option.name, isActive: option.is_active, sortOrder: option.sort_order })),
    })),
  }));
}

export async function listAdminCatalog(client: DatabaseClient): Promise<AdminCatalogCategory[]> {
  const [categories, groups, options] = await Promise.all([
    client.from("categories").select("id,name,slug,description,is_active,sort_order").order("sort_order").order("name"),
    client.from("product_option_groups").select("*").order("sort_order").order("name"),
    client.from("product_options").select("*").order("sort_order").order("name"),
  ]);
  const error = categories.error ?? groups.error ?? options.error;
  if (error) throw repositoryError("catálogo de opções", error);
  return (categories.data ?? []).map((category) => ({ ...category, groups: (groups.data ?? []).filter((group) => group.category_id === category.id).map((group) => ({ ...group, options: (options.data ?? []).filter((option) => option.group_id === group.id) })) }));
}

export async function getAdminOptionGroup(client: DatabaseClient, id: string): Promise<OptionGroupRow | null> { const { data, error } = await client.from("product_option_groups").select("*").eq("id", id).maybeSingle(); if (error) throw repositoryError("grupo", error); return data; }
export async function getAdminOption(client: DatabaseClient, id: string): Promise<OptionRow | null> { const { data, error } = await client.from("product_options").select("*").eq("id", id).maybeSingle(); if (error) throw repositoryError("opção", error); return data; }

export async function createOptionGroup(client: DatabaseClient, values: Database["public"]["Tables"]["product_option_groups"]["Insert"]) { const { error } = await client.from("product_option_groups").insert(values); if (error) throw repositoryWriteError("grupo", error); }
export async function updateOptionGroup(client: DatabaseClient, id: string, values: Database["public"]["Tables"]["product_option_groups"]["Update"]) { const { error } = await client.from("product_option_groups").update(values).eq("id", id); if (error) throw repositoryWriteError("grupo", error); }
export async function deleteOptionGroup(client: DatabaseClient, id: string) { const { error } = await client.from("product_option_groups").delete().eq("id", id); if (error) throw repositoryWriteError("grupo", error); }
export async function createOption(client: DatabaseClient, values: Database["public"]["Tables"]["product_options"]["Insert"]) { const { error } = await client.from("product_options").insert(values); if (error) throw repositoryWriteError("opção", error); }
export async function updateOption(client: DatabaseClient, id: string, values: Database["public"]["Tables"]["product_options"]["Update"]) { const { error } = await client.from("product_options").update(values).eq("id", id); if (error) throw repositoryWriteError("opção", error); }
export async function deleteOption(client: DatabaseClient, id: string) { const { error } = await client.from("product_options").delete().eq("id", id); if (error) throw repositoryWriteError("opção", error); }
