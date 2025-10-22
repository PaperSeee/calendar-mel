"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.NEON_POSTGRES_URL!)

export interface Message {
  id: number
  content: string
  sender: string
  created_at: string
}

export async function getMessages(): Promise<Message[]> {
  const messages = await sql`
    SELECT * FROM messages 
    ORDER BY created_at ASC
  `
  return messages as Message[]
}

export async function createMessage(content: string, sender: string) {
  await sql`
    INSERT INTO messages (content, sender)
    VALUES (${content}, ${sender})
  `
  revalidatePath("/")
}

export async function deleteMessage(id: number) {
  await sql`DELETE FROM messages WHERE id = ${id}`
  revalidatePath("/")
}
