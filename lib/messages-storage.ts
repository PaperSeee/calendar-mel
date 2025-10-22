export interface Message {
  id: string
  text: string
  from: "ilias" | "melissa"
  to: "ilias" | "melissa"
  createdAt: string
}

const MESSAGES_KEY = "couple-calendar-messages"

export function getMessages(): Message[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(MESSAGES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addMessage(message: Omit<Message, "id" | "createdAt">): Message {
  const messages = getMessages()
  const newMessage: Message = {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  messages.push(newMessage)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return newMessage
}

export function deleteMessage(id: string): void {
  const messages = getMessages()
  const filtered = messages.filter((m) => m.id !== id)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered))
}
