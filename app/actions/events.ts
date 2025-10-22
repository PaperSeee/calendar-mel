"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

console.log("[v0] Checking Neon env vars:", {
  NEON_NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? "exists" : "missing",
  NEON_POSTGRES_URL: process.env.NEON_POSTGRES_URL ? "exists" : "missing",
})

const sql = neon(process.env.NEON_POSTGRES_URL!)

export interface Event {
  id: number
  title: string
  description: string | null
  date: string
  time: string | null
  created_by: string
  created_at: string
}

export async function getEvents(): Promise<Event[]> {
  const events = await sql`
    SELECT * FROM events 
    ORDER BY date ASC, created_at DESC
  `
  return events as Event[]
}

export async function createEvent(data: {
  title: string
  description?: string
  date: string
  time?: string
  createdBy: string
}) {
  await sql`
    INSERT INTO events (title, description, date, time, created_by)
    VALUES (${data.title}, ${data.description || null}, ${data.date}, ${data.time || null}, ${data.createdBy})
  `
  revalidatePath("/")
}

export async function deleteEvent(id: number) {
  await sql`DELETE FROM events WHERE id = ${id}`
  revalidatePath("/")
}
