"use client"

import { Button } from "@/components/ui/button"
import { Trash2, User } from "lucide-react"
import type { Event } from "@/app/actions/events"
import { deleteEvent } from "@/app/actions/events"
import { useTransition } from "react"

interface EventListProps {
  events: Event[]
  selectedDate: string
  onAddEvent: () => void
}

export function EventList({ events, selectedDate, onAddEvent }: EventListProps) {
  const [isPending, startTransition] = useTransition()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteEvent(id)
    })
  }

  const dayEvents = events.filter((e) => e.date === selectedDate)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-muted">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground capitalize">{formatDate(selectedDate)}</h3>
        <Button onClick={onAddEvent} size="sm" className="rounded-full h-10 px-5 font-semibold">
          Ajouter
        </Button>
      </div>

      {dayEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-sm text-muted-foreground">Aucun événement ce jour</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-2xl border border-muted bg-background/50 hover:bg-background transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                    <User className="w-3.5 h-3.5" />
                    <span className="capitalize font-medium">{event.created_by}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(event.id)}
                  className="text-muted-foreground hover:text-destructive rounded-full h-9 w-9 flex-shrink-0"
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
