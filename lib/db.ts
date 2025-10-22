import { neon } from "@neondatabase/serverless"

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "Database connection string is missing. Please set NEON_DATABASE_URL or DATABASE_URL environment variable."
  )
}

export const sql = neon(connectionString)
