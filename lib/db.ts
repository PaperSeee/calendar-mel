import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.NEON_POSTGRES_URL!)

export type Event = {
  id: number
  title: string
  description: string | null
  date: string
  time: string | null
  created_by: string
  created_at: string
}

export type Message = {
  id: number
  content: string
  sender: string
  created_at: string
}
