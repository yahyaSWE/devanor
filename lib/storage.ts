import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  isStorageConfigured,
  uploadToBucket,
  downloadFromBucket,
  deleteFromBucket,
  DOWNLOAD_BUCKET,
} from "./supabase-storage";

// Private download files: stored in Supabase Storage when configured (works on
// serverless/Vercel), otherwise on the local filesystem for local dev. Either
// way they are served only through the auth-gated /api/downloads/[id] route.
const LOCAL_DIR = path.join(process.cwd(), "storage", "uploads");

export type StoredFile = {
  storedName: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export async function saveUpload(file: File): Promise<StoredFile> {
  const ext = path.extname(file.name) || "";
  const storedName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";

  if (isStorageConfigured()) {
    await uploadToBucket(DOWNLOAD_BUCKET, storedName, buffer, mimeType);
  } else {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, storedName), buffer);
  }

  return { storedName, fileName: file.name, mimeType, size: file.size };
}

export async function readUpload(storedName: string): Promise<Buffer> {
  const safe = path.basename(storedName); // prevent path traversal
  if (isStorageConfigured()) {
    return downloadFromBucket(DOWNLOAD_BUCKET, safe);
  }
  return readFile(path.join(LOCAL_DIR, safe));
}

export async function deleteUpload(storedName: string): Promise<void> {
  const safe = path.basename(storedName);
  if (isStorageConfigured()) {
    await deleteFromBucket(DOWNLOAD_BUCKET, safe).catch(() => {});
    return;
  }
  try {
    await unlink(path.join(LOCAL_DIR, safe));
  } catch {
    // already gone — ignore
  }
}
