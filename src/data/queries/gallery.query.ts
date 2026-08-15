import { toGalleryImage } from "@/data/adapters/gallery.adapter";
import { listPublishedGalleryImageRows } from "@/data/repositories/gallery.repository";
import { createPublicQueryContext, type PublicQueryContext } from "./context";
import { runPublicQuery } from "./result";
export async function getPublishedGallery(context?: PublicQueryContext) {
  const ctx = context ?? await createPublicQueryContext();
  return runPublicQuery("gallery", async () => (await listPublishedGalleryImageRows(ctx.client)).map((row) => toGalleryImage(row, ctx.assetUrl)));
}
