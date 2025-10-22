import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless"],
  },
}

export default nextConfig
