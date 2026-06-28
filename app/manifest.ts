import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Charlottenimmm",
    short_name: "Charlottenimmm",
    description: "Baca novel & AU karya Charlottenimmm",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/charlottenim-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
