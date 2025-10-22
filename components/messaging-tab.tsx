"use client"

import type React from "react"
import { useState, useEffect, useRef, useTransition, useOptimistic } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash2, MessageCircle } from "lucide-react"
import type { Message } from "@/app/actions/messages"
import { createMessage, deleteMessage } from "@/app/actions/messages"

interface MessagingTabProps {
  currentUser: string
  messages: Message[]
}

export function MessagingTab({ currentUser, messages }: MessagingTabProps) {
  const [messageText, setMessageText] = useState("")
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mise à jour optimiste
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage],
  )

  const otherUser = currentUser === "ilias" ? "melissa" : "ilias"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    const text = messageText.trim()
    setMessageText("")

    // Message optimiste (affiché immédiatement)
    const optimisticMsg: Message = {
      id: Date.now(), // ID temporaire
      content: text,
      sender: currentUser,
      created_at: new Date().toISOString(),
    }

    addOptimisticMessage(optimisticMsg)
    scrollToBottom()

    startTransition(async () => {
      await createMessage(text, currentUser)
      router.refresh()
    })
  }

  const handleDeleteMessage = (id: number) => {
    startTransition(async () => {
      await deleteMessage(id)
      router.refresh()
    })
  }

  // Polling pour rafraîchir les messages toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [router])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })
    }
  }

  // Utiliser optimisticMessages au lieu de messages dans le render
  const groupedMessages = optimisticMessages.reduce(
    (groups, message) => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, typeof optimisticMessages>,
  )

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="mb-6">
        <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-muted shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground capitalize">
              {otherUser}
            </h2>
            <p className="text-sm text-muted-foreground">
              Conversation privée
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-70">
            <MessageCircle className="w-16 h-16 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-center text-muted-foreground/70">
              Aucun message trouvé. Commencez la conversation !
            </p>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} className="space-y-4 mb-6">
                <div className="flex justify-center">
                  <span className="text-xs font-semibold text-muted-foreground bg-muted/30 px-5 py-2 rounded-full">
                    {formatDate(msgs[0].created_at)}
                  </span>
                </div>
                {msgs.map((message) => {
                  const isCurrentUser = message.sender === currentUser
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex flex-col max-w-[75%] ${
                          isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`group relative rounded-3xl px-5 py-3.5 shadow-sm transition-all ${
                            isCurrentUser
                              ? "bg-primary text-white rounded-br-lg"
                              : "bg-secondary/30 text-foreground border border-muted rounded-bl-lg"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {message.content}
                          </p>
                          {isCurrentUser && (
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              disabled={isPending}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-white rounded-full p-2 shadow-lg hover:scale-110 disabled:opacity-50"
                              aria-label="Supprimer le message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-2 px-2 font-medium">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage}>
        <div className="flex gap-3 p-4 bg-white rounded-3xl border border-muted shadow-sm">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 border-0 bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl h-12 px-5"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!messageText.trim() || isPending}
            className="h-12 w-12 rounded-2xl shadow-sm"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
