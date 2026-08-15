import type { Service } from "@/types/domain";
import type { Database } from "@/types/database";
import { repositoryError, type DatabaseClient } from "./shared";

const mapService = (row: Database["public"]["Tables"]["services"]["Row"]): Service => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, iconKey: row.icon_key, imagePath: row.image_path, pricingType: row.pricing_type, price: row.price, priceFrom: row.price_from, durationMinutes: row.duration_minutes, isBookable: row.is_bookable, isFeatured: row.is_featured, sortOrder: row.sort_order });

export async function listActiveServices(client: DatabaseClient): Promise<Service[]> {
  const { data, error } = await client.from("services").select("*").eq("is_active", true).order("sort_order").order("name");
  if (error) throw repositoryError("os serviços", error.message);
  return data.map(mapService);
}

export async function listBookableServices(client: DatabaseClient): Promise<Service[]> {
  const { data, error } = await client.from("services").select("*").eq("is_active", true).eq("is_bookable", true).order("sort_order").order("name");
  if (error) throw repositoryError("os serviços agendáveis", error.message);
  return data.map(mapService);
}
