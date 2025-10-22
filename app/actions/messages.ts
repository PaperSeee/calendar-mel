"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface Message {
  id: number
  content: string
  sender: string
  created_at: string
}

export async function getMessages(): Promise<Message[]> {
  try {
    const messages = await sql`
      SELECT * FROM messages 
      ORDER BY created_at ASC
    `
    return messages as Message[]
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return []
  }
}

export async function createMessage(content: string, sender: string) {
  try {
    await sql`
      INSERT INTO messages (content, sender)
      VALUES (${content}, ${sender})
    `
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to create message:", error)
    throw error
  }
}

export async function deleteMessage(id: number) {
  try {
    await sql`DELETE FROM messages WHERE id = ${id}`
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to delete message:", error)
    throw error
  }
}
