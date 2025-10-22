"use client"

import { useState, useEffect } from "react"
import { getMessages, addMessage, deleteMessage, type Message } from "@/lib/messages-storage"

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    setMessages(getMessages())
  }, [])

  const sendMessage = (message: Omit<Message, "id" | "createdAt">) => {
    const newMessage = addMessage(message)
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }

  const removeMessage = (id: string) => {
    deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return { messages, sendMessage, removeMessage }
}
