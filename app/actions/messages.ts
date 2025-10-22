"use server"

import { sql } from "@/lib/db"

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
