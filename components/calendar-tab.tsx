"use client"

import { useState } from "react"
import { CalendarView } from "@/components/calendar-view"
import { EventDialog } from "@/components/event-dialog"
import type { Event } from "@/app/actions/events"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Heart, Sparkles, Clock } from "lucide-react"

interface CalendarTabProps {
  currentUser: string
  events: Event[]
}

export function CalendarTab({ currentUser, events }: CalendarTabProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Mettre à jour l'heure toutes les secondes
  useState(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(interval)
  })

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  const formatCurrentDate = () => {
    return currentDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrentTime = () => {
    return currentDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Statistiques
  const totalEvents = events.length
  const iliasEvents = events.filter(e => e.created_by === "ilias").length
  const melissaEvents = events.filter(e => e.created_by === "melissa").length
  
  // Événements à venir
  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => {
      // S'assurer que date est une chaîne de caractères
      const dateA = typeof a.date === 'string' ? a.date : ''
      const dateB = typeof b.date === 'string' ? b.date : ''
      return dateA.localeCompare(dateB)
    })
    .slice(0, 3)

  return (
    <>
      {/* Date et heure actuelles */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 mb-4">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="font-bold text-foreground capitalize">{formatCurrentDate()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50">
              <Clock className="w-4 h-4 text-primary" />
              <p className="font-mono font-bold text-primary tabular-nums">{formatCurrentTime()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CalendarView 
        events={events} 
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />

      {/* Statistiques et événements à venir */}
      <div className="grid gap-4 mt-6">
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{totalEvents}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-accent/10 mx-auto mb-2 flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-accent">{iliasEvents}</p>
              <p className="text-xs text-muted-foreground">Ilias</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 mx-auto mb-2 flex items-center justify-center">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-secondary">{melissaEvents}</p>
              <p className="text-xs text-muted-foreground">Melissa</p>
            </CardContent>
          </Card>
        </div>

        {/* Événements à venir */}
        {upcomingEvents.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Prochains événements</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date)
                  const today = new Date()
                  const isToday = eventDate.toDateString() === today.toDateString()
                  const tomorrow = new Date(today)
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString()
                  
                  let dateLabel = eventDate.toLocaleDateString("fr-FR", { 
                    day: "numeric", 
                    month: "short" 
                  })
                  if (isToday) dateLabel = "Aujourd'hui"
                  if (isTomorrow) dateLabel = "Demain"

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDate(event.date)
                        setIsDialogOpen(true)
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{dateLabel}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedDate && (
        <EventDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedDate={selectedDate}
          currentUser={currentUser}
          events={events}
        />
      )}
    </>
  )
}
