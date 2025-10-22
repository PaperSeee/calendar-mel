import { neon } from "@neondatabase/serverless"

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error("❌ Database configuration missing!")
  console.error("Please set NEON_DATABASE_URL in your .env file")
  console.error("Example: NEON_DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require")
  throw new Error(
    "Database connection string is missing. Please set NEON_DATABASE_URL or DATABASE_URL environment variable."
  )
}

// Valider le format de l'URL
if (!connectionString.startsWith("postgresql://") && !connectionString.startsWith("postgres://")) {
  console.error("❌ Invalid database URL format!")
  console.error("Current value:", connectionString)
  throw new Error("Database URL must start with postgresql:// or postgres://")
}

export const sql = neon(connectionString)
