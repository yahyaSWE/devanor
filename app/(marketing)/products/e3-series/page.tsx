import { redirect } from "next/navigation";

// The single E3 Series page was replaced by per-module product pages.
export default function E3SeriesRedirect() {
  redirect("/products");
}
