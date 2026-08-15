import type { DatabaseClient } from "@/data/repositories/shared";

export type AdminDashboardSummary = {
  products: number;
  categories: number;
  services: number;
  faqs: number;
  galleryImages: number;
};

const tables = ["products", "categories", "services", "faqs", "gallery_images"] as const;

export async function getAdminDashboardSummary(client: DatabaseClient): Promise<AdminDashboardSummary> {
  const results = await Promise.all(
    tables.map(async (table) => {
      const { count, error } = await client.from(table).select("id", { count: "exact", head: true });
      if (error) throw new Error(`Não foi possível contar ${table}.`);
      return count ?? 0;
    }),
  );
  return {
    products: results[0],
    categories: results[1],
    services: results[2],
    faqs: results[3],
    galleryImages: results[4],
  };
}
