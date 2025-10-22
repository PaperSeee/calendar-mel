/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Permettre l'accès aux variables d'environnement pendant le build
  env: {
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

export default nextConfig
