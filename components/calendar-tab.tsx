"use client"

import { useState, useEffect } from "react"
import { CalendarView } from "@/components/calendar-view"
import { EventDialog } from "@/components/event-dialog"
import type { Event } from "@/app/actions/events"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const upcomingEvents = events
    .filter(e => e.date >= todayString)
    .sort((a, b) => {
      const dateA = typeof a.date === 'string' ? a.date : ''
      const dateB = typeof b.date === 'string' ? b.date : ''
      return dateA.localeCompare(dateB)
    })
    .slice(0, 3)

  return (
    <>
      {/* Date et heure actuelles - Design moderne */}
      <Card className="border border-border/60 shadow-lg bg-gradient-to-br from-card via-card to-card/95 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center shadow-sm">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Aujourd'hui</p>
                <p className="text-lg font-bold text-foreground capitalize tracking-tight">{formatCurrentDate()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20 shadow-sm">
              <Clock className="w-4 h-4 text-primary" />
              <p className="font-mono font-bold text-primary tabular-nums text-lg">{formatCurrentTime()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affichage du calendrier */}
      <CalendarView 
        events={events} 
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />

      {/* Statistiques et événements à venir */}
      <div className="grid gap-5 mt-6">
        {/* Statistiques - Design fintech */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary mb-1 tracking-tight">{totalEvents}</p>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Total</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent mb-1 tracking-tight">{iliasEvents}</p>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Ilias</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-secondary mb-1 tracking-tight">{melissaEvents}</p>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Melissa</p>
            </CardContent>
          </Card>
        </div>

        {/* Événements à venir - Design épuré */}
        {upcomingEvents.length > 0 && (
          <Card className="border border-border/60 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground tracking-tight">Prochains événements</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => {
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
                      onClick={() => {
                        setSelectedDate(event.date)
                        setIsDialogOpen(true)
                      }}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-muted/60 hover:to-muted/30 border border-border/40 transition-all duration-300 cursor-pointer hover:shadow-md group animate-[fadeInUp_0.4s_ease-out_forwards]"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground truncate mb-1">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">{dateLabel}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
