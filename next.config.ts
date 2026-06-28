import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
};

export default withSerwist(nextConfig);
