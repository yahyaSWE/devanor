import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Public bucket for client logos; private bucket for gated downloads.
export const LOGO_BUCKET = "logos";
export const DOWNLOAD_BUCKET = "downloads";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when Supabase Storage env vars are present (prod / configured dev). */
export function isStorageConfigured(): boolean {
  return Boolean(url && serviceKey);
}

let cached: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  cached ??= createClient(url, serviceKey, { auth: { persistSession: false } });
  return cached;
}

const BUCKET_PUBLIC: Record<string, boolean> = {
  [LOGO_BUCKET]: true,
  [DOWNLOAD_BUCKET]: false,
};

const ensured = new Set<string>();

// Create the bucket on first use so the app self-configures once the env vars
// are present — no manual dashboard setup needed.
async function ensureBucket(client: SupabaseClient, bucket: string): Promise<void> {
  if (ensured.has(bucket)) return;
  const { data } = await client.storage.getBucket(bucket);
  if (!data) {
    const { error } = await client.storage.createBucket(bucket, {
      public: BUCKET_PUBLIC[bucket] ?? false,
    });
    if (error && !/already exists/i.test(error.message)) throw error;
  }
  ensured.add(bucket);
}

export async function uploadToBucket(
  bucket: string,
  path: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const client = getClient();
  await ensureBucket(client, bucket);
  const { error } = await client.storage
    .from(bucket)
    .upload(path, body, { contentType, upsert: true });
  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string): string {
  return getClient().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

// Create a one-time signed upload URL so the browser can upload a (large) file
// straight to Supabase Storage, bypassing the Vercel/Server-Action body limit.
export async function createSignedUpload(
  bucket: string,
  storedName: string,
): Promise<{ token: string; path: string }> {
  const client = getClient();
  await ensureBucket(client, bucket);
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(storedName, { upsert: true });
  if (error || !data) {
    throw error ?? new Error("Could not create upload URL");
  }
  return { token: data.token, path: data.path };
}

export async function downloadFromBucket(
  bucket: string,
  path: string,
): Promise<Buffer> {
  const { data, error } = await getClient().storage.from(bucket).download(path);
  if (error || !data) throw error ?? new Error("File not found");
  return Buffer.from(await data.arrayBuffer());
}

export async function deleteFromBucket(
  bucket: string,
  path: string,
): Promise<void> {
  await getClient().storage.from(bucket).remove([path]);
}
