import { createClient } from "@supabase/supabase-js";
import { createUploadTarget } from "@/lib/actions/upload";

// Client-side direct upload to Supabase Storage. The browser uploads the file
// straight to Supabase via a one-time signed URL, bypassing Vercel's Server
// Action body limit — so large files (up to 25 MB) work.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DOWNLOAD_BUCKET = "downloads";

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export type StoredMeta = {
  storedName: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export function directUploadConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON);
}

export async function uploadFileToStorage(file: File): Promise<StoredMeta> {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error(
      "Uploads are not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File must be smaller than 25 MB.");
  }

  const target = await createUploadTarget(file.name);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { error } = await supabase.storage
    .from(DOWNLOAD_BUCKET)
    .uploadToSignedUrl(target.path, target.token, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
  if (error) throw new Error(error.message || "Upload failed.");

  return {
    storedName: target.storedName,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
  };
}
