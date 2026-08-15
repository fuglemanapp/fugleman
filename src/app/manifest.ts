import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "WhatSpent", short_name: "WhatSpent", description: "Finanças, agenda e organização para sua família.", start_url: "/dashboard", display: "standalone", background_color: "#f4f8f5", theme_color: "#087d3c", icons: [{ src: "/iconws-transparent.png", sizes: "512x512", type: "image/png" }] };
}
