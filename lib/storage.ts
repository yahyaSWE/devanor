import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Files live OUTSIDE /public so they are never served statically — access is
// gated through an authenticated route handler. Swap this module for Supabase
// Storage later without touching callers.
const STORAGE_DIR = path.join(process.cwd(), "storage", "uploads");

export type StoredFile = {
  storedName: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export async function saveUpload(file: File): Promise<StoredFile> {
  const ext = path.extname(file.name) || "";
  const storedName = `${randomUUID()}${ext}`;
  await mkdir(STORAGE_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(STORAGE_DIR, storedName), buffer);
  return {
    storedName,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export async function readUpload(storedName: string): Promise<Buffer> {
  const safe = path.basename(storedName); // prevent path traversal
  return readFile(path.join(STORAGE_DIR, safe));
}

export async function deleteUpload(storedName: string): Promise<void> {
  const safe = path.basename(storedName);
  try {
    await unlink(path.join(STORAGE_DIR, safe));
  } catch {
    // already gone — ignore
  }
}
