import type { MetadataRoute } from "next";
import { PUBLIC_BRAND_NAME } from "../lib/public-brand";

export default function manifest(): MetadataRoute.Manifest {
  return { name: PUBLIC_BRAND_NAME, short_name: PUBLIC_BRAND_NAME, description: "Finanças, agenda e organização para sua família.", start_url: "/dashboard", display: "standalone", background_color: "#f4f8f5", theme_color: "#087d3c", icons: [{ src: "/iconws-transparent.png", sizes: "512x512", type: "image/png" }] };
}
