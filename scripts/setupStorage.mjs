import { createClient } from "@supabase/supabase-js";

// Run once after setting env vars:
//   node --env-file=.env scripts/setupStorage.mjs
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function ensureBucket(name, isPublic) {
  const { data } = await supabase.storage.getBucket(name);
  if (data) {
    console.log(`bucket "${name}" already exists (public=${data.public})`);
    return;
  }
  const { error } = await supabase.storage.createBucket(name, {
    public: isPublic,
  });
  if (error) {
    console.error(`failed to create "${name}":`, error.message);
    process.exit(1);
  }
  console.log(`created bucket "${name}" (public=${isPublic})`);
}

await ensureBucket("logos", true);
await ensureBucket("downloads", false);
console.log("storage setup done");
