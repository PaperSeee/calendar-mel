import { neon } from "@neondatabase/serverless"

// Use the connection string from environment variables
const sql = neon(process.env.NEON_POSTGRES_URL!)

export { sql }
