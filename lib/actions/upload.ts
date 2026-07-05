"use server";

import { randomUUID } from "crypto";
import path from "path";
import { requireAdmin } from "@/lib/auth-helpers";
import { createSignedUpload, DOWNLOAD_BUCKET } from "@/lib/supabase-storage";

export type UploadTarget = { storedName: string; token: string; path: string };

/**
 * Reserve a stored name and return a one-time signed upload URL/token so the
 * browser can upload the file straight to Supabase Storage (no size limit
 * from Vercel Server Actions). Admin only.
 */
export async function createUploadTarget(
  fileName: string,
): Promise<UploadTarget> {
  await requireAdmin();
  const ext = path.extname(fileName || "") || "";
  const storedName = `${randomUUID()}${ext}`;
  const { token, path: uploadPath } = await createSignedUpload(
    DOWNLOAD_BUCKET,
    storedName,
  );
  return { storedName, token, path: uploadPath };
}
